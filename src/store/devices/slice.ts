import { StateCreator } from 'zustand';
import { DeviceState } from '../types';
import { DeviceActions } from './types';
import { transformApiDevice } from './utils/deviceTransformation';
import { apiService } from '../../services/api';
import { logger } from '../../utils/logger';
import { Device } from '../../types';

export type DeviceSlice = DeviceState & DeviceActions;

// Re-export types for backward compatibility
export type { DeviceActions };

export const createDeviceSlice: StateCreator<
  DeviceSlice & { 
    deviceInfo: { batteryLevel: number; lastUpdate: Date };
    setDeviceInfo: (info: any) => void;
    alerts: any[];
  },
  [],
  [],
  DeviceSlice
> = (set, get) => ({
  devices: [],
  ownDevices: [],
  caregivingDevices: [],
  selectedDevice: null,
  
  setDevices: (devices) => set({ devices }),
  setSelectedDevice: (device) => set({ selectedDevice: device }),
  
  updateDeviceInfo: () => {
    const { selectedDevice } = get();
    if (selectedDevice) {
      get().setDeviceInfo({
        batteryLevel: selectedDevice.batteryLevel,
        lastUpdate: selectedDevice.lastUpdate
      });
    }
  },
  
  fetchDevices: async () => {
    try {
      logger.info('Starting device fetch process with improved online detection');
      logger.debug('Using endpoint: /my-devices/own');
      
      // Get recent alarms for context (last 24 hours)
      let recentAlarms: any[] = [];
      try {
        logger.debug('Fetching recent alarms for device activity context...');
        const alarmsResponse = await apiService.getDeviceAlarms();
        const alarmsData = alarmsResponse?.data || (Array.isArray(alarmsResponse) ? alarmsResponse : []);
        
        // Filter to last 24 hours
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        recentAlarms = alarmsData.filter((alarm: any) => 
          alarm.created_at && new Date(alarm.created_at) > twentyFourHoursAgo
        );
        
        logger.debug('Recent alarms fetched for device context:', {
          totalAlarms: alarmsData.length,
          recentAlarms: recentAlarms.length,
          devicePhones: recentAlarms.map(a => a.device?.phone_number).filter(Boolean)
        });
      } catch (alarmError) {
        logger.warn('Could not fetch recent alarms for device context (non-critical):', alarmError);
      }
      
      // Fetch own devices using the correct endpoint
      const ownDevicesResponse = await apiService.getMyDevices();
      logger.debug('Own devices API response received', { 
        type: typeof ownDevicesResponse,
        keys: Object.keys(ownDevicesResponse || {})
      });
      
      // Check if response is an array (expected format for /my-devices/own)
      if (!ownDevicesResponse) {
        logger.warn('No response received from devices API');
        set({ devices: [], ownDevices: [], caregivingDevices: [] });
        return;
      }
      
      // Handle response - should be an array directly
      let ownDevices: Device[] = [];
      if (Array.isArray(ownDevicesResponse)) {
        ownDevices = ownDevicesResponse.map(device => transformApiDevice(device, recentAlarms));
        logger.debug('Response is array format - processing devices', { count: ownDevices.length });
      } else if (ownDevicesResponse && typeof ownDevicesResponse === 'object' && 'data' in ownDevicesResponse && Array.isArray((ownDevicesResponse as any).data)) {
        ownDevices = ((ownDevicesResponse as any).data).map((device: any) => transformApiDevice(device, recentAlarms));
        logger.debug('Response has data property - processing devices', { count: ownDevices.length });
      } else {
        logger.warn('Unexpected response format from devices API', ownDevicesResponse);
        ownDevices = [];
      }
      
      // Try to fetch caregiving devices separately (optional)
      let caregivingDevices: Device[] = [];
      try {
        const caregivingResponse = await apiService.getCaregivingDevices();
        logger.debug('Caregiving devices response received', caregivingResponse);
        if (Array.isArray(caregivingResponse)) {
          caregivingDevices = caregivingResponse.map(device => transformApiDevice(device, recentAlarms));
        } else if (caregivingResponse && typeof caregivingResponse === 'object' && 'data' in caregivingResponse && Array.isArray((caregivingResponse as any).data)) {
          caregivingDevices = ((caregivingResponse as any).data).map((device: any) => transformApiDevice(device, recentAlarms));
        }
      } catch (caregivingError) {
        logger.debug('Could not fetch caregiving devices (optional)', caregivingError);
      }
      
      const allDevices = [...ownDevices, ...caregivingDevices];
      
      logger.debug('Device fetch results with improved battery-based online detection', {
        ownDevices: ownDevices.length,
        caregivingDevices: caregivingDevices.length,
        total: allDevices.length,
        onlineDevices: allDevices.filter(d => d.isOnline).length,
        devicesWithBattery: allDevices.filter(d => d.batteryLevel > 0).length,
        recentAlarmsConsidered: recentAlarms.length
      });
      
      set({ 
        devices: allDevices,
        ownDevices,
        caregivingDevices
      });
      
      if (allDevices.length > 0) {
        const { selectedDevice, setSelectedDevice } = get();
        if (!selectedDevice) {
          logger.debug('Setting first device as selected', { deviceId: allDevices[0].id });
          setSelectedDevice(allDevices[0]);
        }
        get().updateDeviceInfo();
      } else {
        logger.info('No devices found in response');
      }
      
      logger.info('Device fetch completed successfully with battery-based online detection');
    } catch (error) {
      logger.error('Failed to fetch devices', error);
      set({ devices: [], ownDevices: [], caregivingDevices: [] });
    }
  },
  
  fetchOwnDevices: async () => {
    try {
      logger.debug('Fetching own devices...');
      const devices = await apiService.getOwnDevices();
      logger.debug('Own devices response received', devices);
      const transformedDevices = Array.isArray(devices) ? devices.map(device => transformApiDevice(device)) : [];
      set({ ownDevices: transformedDevices });
    } catch (error) {
      logger.error('Failed to fetch own devices', error);
      set({ ownDevices: [] });
    }
  },
  
  fetchCaregivingDevices: async () => {
    try {
      logger.debug('Fetching caregiving devices...');
      const devices = await apiService.getCaregivingDevices();
      logger.debug('Caregiving devices response received', devices);
      const transformedDevices = Array.isArray(devices) ? devices.map(device => transformApiDevice(device)) : [];
      set({ caregivingDevices: transformedDevices });
    } catch (error) {
      logger.error('Failed to fetch caregiving devices', error);
      set({ caregivingDevices: [] });
    }
  },
  
  assignDevice: async (phone_number: string, nickname?: string) => {
    try {
      logger.info('Starting device assignment', { phone_number, nickname });
      
      const response = await apiService.assignDevice(phone_number, nickname);
      logger.debug('Device assignment response received', response);
      
      logger.debug('Refreshing devices after assignment...');
      await get().fetchDevices();
      logger.info('Device assignment completed successfully');
    } catch (error) {
      logger.error('Failed to assign device', error);
      throw error;
    }
  },
  
  unassignDevice: async (id: number) => {
    try {
      logger.info('Unassigning device', { deviceId: id });
      await apiService.unassignDevice(id);
      await get().fetchDevices();
      logger.info('Device unassignment completed');
    } catch (error) {
      logger.error('Failed to unassign device', error);
      throw error;
    }
  },
  
  getDevice: async (id: number): Promise<Device> => {
    try {
      logger.debug('Getting device details', { deviceId: id });
      const apiDevice = await apiService.getDevice(id);
      logger.debug('Device details response received', apiDevice);
      return transformApiDevice(apiDevice);
    } catch (error) {
      logger.error('Failed to get device details', error);
      throw error;
    }
  },
  
  requestDeviceAccess: async (phone_number: string, message?: string) => {
    try {
      logger.info('Requesting device access', { phone_number });
      await apiService.requestDeviceAccess(phone_number, message);
      logger.info('Device access request sent successfully');
    } catch (error) {
      logger.error('Failed to request device access', error);
      throw error;
    }
  }
});
