
import { StateCreator } from 'zustand';
import { DeviceState } from './types';
import { Device, ApiDevicesResponse } from '../types';
import { apiService } from '../services/api';

// Helper function to transform API device response to Device type
const transformApiDevice = (apiDevice: any): Device => {
  return {
    id: apiDevice.id || 0,
    phone_number: apiDevice.phone_number || '',
    nickname: apiDevice.nickname,
    batteryLevel: apiDevice.batteryLevel || apiDevice.battery_level || 85,
    signalStrength: apiDevice.signalStrength || apiDevice.signal_strength || 4,
    connectionType: apiDevice.connectionType || apiDevice.connection_type || '4G',
    lastUpdate: apiDevice.lastUpdate ? new Date(apiDevice.lastUpdate) : new Date(),
    firmwareVersion: apiDevice.firmwareVersion || apiDevice.firmware_version || '1.0.0',
    status: apiDevice.status,
    location: apiDevice.location,
    created_at: apiDevice.created_at,
    updated_at: apiDevice.updated_at
  };
};

export interface DeviceActions {
  setDevices: (devices: Device[]) => void;
  setSelectedDevice: (device: Device | null) => void;
  updateDeviceInfo: () => void;
  fetchDevices: () => Promise<void>;
  fetchOwnDevices: () => Promise<void>;
  fetchCaregivingDevices: () => Promise<void>;
  assignDevice: (phone_number: string, nickname?: string) => Promise<void>;
  unassignDevice: (id: number) => Promise<void>;
  getDevice: (id: number) => Promise<Device>;
  requestDeviceAccess: (phone_number: string, message?: string) => Promise<void>;
}

export type DeviceSlice = DeviceState & DeviceActions;

export const createDeviceSlice: StateCreator<
  DeviceSlice & { 
    deviceInfo: { batteryLevel: number; connectionType: '5G' | '4G' | 'WiFi'; signalStrength: number; lastUpdate: Date };
    setDeviceInfo: (info: any) => void;
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
        connectionType: selectedDevice.connectionType,
        signalStrength: selectedDevice.signalStrength,
        lastUpdate: selectedDevice.lastUpdate
      });
    }
  },
  
  fetchDevices: async () => {
    try {
      const devicesResponse = await apiService.getMyDevices() as ApiDevicesResponse;
      const ownDevices = (devicesResponse.own || []).map(transformApiDevice);
      const caregivingDevices = (devicesResponse.caregiving || []).map(transformApiDevice);
      const allDevices = [...ownDevices, ...caregivingDevices];
      
      set({ 
        devices: allDevices,
        ownDevices,
        caregivingDevices
      });
      
      if (allDevices.length > 0) {
        const { selectedDevice, setSelectedDevice } = get();
        if (!selectedDevice) {
          setSelectedDevice(allDevices[0]);
        }
        get().updateDeviceInfo();
      }
    } catch (error) {
      console.error('Failed to fetch devices:', error);
      set({ devices: [], ownDevices: [], caregivingDevices: [] });
    }
  },
  
  fetchOwnDevices: async () => {
    try {
      const devices = await apiService.getOwnDevices();
      const transformedDevices = Array.isArray(devices) ? devices.map(transformApiDevice) : [];
      set({ ownDevices: transformedDevices });
    } catch (error) {
      console.error('Failed to fetch own devices:', error);
      set({ ownDevices: [] });
    }
  },
  
  fetchCaregivingDevices: async () => {
    try {
      const devices = await apiService.getCaregivingDevices();
      const transformedDevices = Array.isArray(devices) ? devices.map(transformApiDevice) : [];
      set({ caregivingDevices: transformedDevices });
    } catch (error) {
      console.error('Failed to fetch caregiving devices:', error);
      set({ caregivingDevices: [] });
    }
  },
  
  assignDevice: async (phone_number: string, nickname?: string) => {
    try {
      await apiService.assignDevice(phone_number, nickname);
      await get().fetchDevices();
    } catch (error) {
      console.error('Failed to assign device:', error);
      throw error;
    }
  },
  
  unassignDevice: async (id: number) => {
    try {
      await apiService.unassignDevice(id);
      await get().fetchDevices();
    } catch (error) {
      console.error('Failed to unassign device:', error);
      throw error;
    }
  },
  
  getDevice: async (id: number): Promise<Device> => {
    try {
      const apiDevice = await apiService.getDevice(id);
      return transformApiDevice(apiDevice);
    } catch (error) {
      console.error('Failed to get device:', error);
      throw error;
    }
  },
  
  requestDeviceAccess: async (phone_number: string, message?: string) => {
    try {
      await apiService.requestDeviceAccess(phone_number, message);
    } catch (error) {
      console.error('Failed to request device access:', error);
      throw error;
    }
  }
});
