
import { StateCreator } from 'zustand';
import { AlertSlice, ApiAlertResponse } from './types';
import { transformApiAlert, isDeviceAuthorized, arraysEqual, extractDevicePhones } from './utils';
import { apiService } from '../../services/api';
import { logger } from '../../utils/logger';

export const createAlertSlice: StateCreator<
  AlertSlice,
  [],
  [],
  AlertSlice
> = (set, get) => ({
  alerts: [],
  authorizedDevicePhones: new Set(),
  
  setAlerts: (alerts) => set({ alerts }),
  
  setAuthorizedDevices: (devicePhones) => {
    const currentDevices = Array.from(get().authorizedDevicePhones);
    
    // Only update if the devices have actually changed
    if (!arraysEqual(currentDevices, devicePhones)) {
      const authorizedSet = new Set(devicePhones);
      logger.debug('Setting authorized devices (changed):', Array.from(authorizedSet));
      set({ authorizedDevicePhones: authorizedSet });
    } else {
      logger.debug('Authorized devices unchanged, skipping update');
    }
  },
  
  fetchAlerts: async () => {
    try {
      logger.security('Starting alert fetch with authorization checks...');
      
      // Fetch devices from both endpoints
      let ownDevices: any[] = [];
      let caregivingDevices: any[] = [];
      let ownDevicesError: any = null;
      let caregivingDevicesError: any = null;
      
      // Fetch own devices
      try {
        logger.debug('Fetching own devices for authorization...');
        const ownDevicesResponse = await apiService.getMyDevices();
        logger.debug('Own devices response:', ownDevicesResponse);
        
        if (Array.isArray(ownDevicesResponse)) {
          ownDevices = ownDevicesResponse;
        } else if (ownDevicesResponse && typeof ownDevicesResponse === 'object' && 'data' in ownDevicesResponse) {
          ownDevices = (ownDevicesResponse as any).data || [];
        }
        logger.debug(`Found ${ownDevices.length} own devices`);
      } catch (error) {
        ownDevicesError = error;
        logger.warn('Failed to fetch own devices:', error);
      }
      
      // Fetch caregiving devices
      try {
        logger.debug('Fetching caregiving devices for authorization...');
        const caregivingDevicesResponse = await apiService.getCaregivingDevices();
        logger.debug('Caregiving devices response:', caregivingDevicesResponse);
        
        if (Array.isArray(caregivingDevicesResponse)) {
          caregivingDevices = caregivingDevicesResponse;
        } else if (caregivingDevicesResponse && typeof caregivingDevicesResponse === 'object' && 'data' in caregivingDevicesResponse) {
          caregivingDevices = (caregivingDevicesResponse as any).data || [];
        }
        logger.debug(`Found ${caregivingDevices.length} caregiving devices`);
      } catch (error) {
        caregivingDevicesError = error;
        logger.warn('Failed to fetch caregiving devices:', error);
      }
      
      // If both endpoints failed, throw an error
      if (ownDevicesError && caregivingDevicesError) {
        logger.error('CRITICAL: Both device endpoints failed');
        throw new Error('Could not fetch any authorized devices');
      }
      
      // Extract phone numbers from both device lists
      const ownDevicePhones = extractDevicePhones(ownDevices);
      const caregivingDevicePhones = extractDevicePhones(caregivingDevices);
      
      // Combine all authorized device phone numbers
      const allAuthorizedPhones = [...ownDevicePhones, ...caregivingDevicePhones];
      
      logger.security('Device authorization summary:', {
        ownDevices: ownDevicePhones.length,
        caregivingDevices: caregivingDevicePhones.length,
        totalAuthorized: allAuthorizedPhones.length,
        ownDevicePhones,
        caregivingDevicePhones,
        allAuthorizedPhones
      });
      
      // Update authorized devices in store (with change detection)
      get().setAuthorizedDevices(allAuthorizedPhones);
      
      // Now fetch alerts
      logger.debug('Fetching alerts from API...');
      const response = await apiService.getDeviceAlarms() as ApiAlertResponse;
      logger.debug('Raw API response:', response);
      
      // Handle paginated response - extract data array
      const alertsData = response?.data || (Array.isArray(response) ? response : []);
      logger.debug('Alerts data to transform:', alertsData);
      
      // Transform each alert to match our interface
      const transformedAlerts = alertsData.map(transformApiAlert);
      logger.debug('Transformed alerts (before filtering):', transformedAlerts);
      
      // SECURITY CHECK: Filter alerts to only include those from authorized devices
      const authorizedAlerts = transformedAlerts.filter(alert => {
        const devicePhone = alert.device_phone;
        const isAuthorized = isDeviceAuthorized(devicePhone, get().authorizedDevicePhones);
        
        if (!isAuthorized) {
          logger.security('SECURITY VIOLATION: Blocking unauthorized alert from device:', {
            alertId: alert.id,
            devicePhone: devicePhone,
            deviceNickname: alert.device_nickname,
            authorizedDevices: Array.from(get().authorizedDevicePhones)
          });
        }
        
        return isAuthorized;
      });
      
      logger.debug('Authorized alerts after filtering:', authorizedAlerts);
      logger.security(`SECURITY SUMMARY: ${transformedAlerts.length} total alerts, ${authorizedAlerts.length} authorized, ${transformedAlerts.length - authorizedAlerts.length} blocked`);
      
      set({ alerts: authorizedAlerts });
    } catch (error) {
      logger.error('Failed to fetch alerts:', error);
      set({ alerts: [] });
    }
  }
});
