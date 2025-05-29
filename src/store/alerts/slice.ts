
import { StateCreator } from 'zustand';
import { AlertSlice, ApiAlertResponse } from './types';
import { transformApiAlert, isDeviceAuthorized, arraysEqual, extractDevicePhones } from './utils';
import { apiService } from '../../services/api';

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
      console.log('🔒 Setting authorized devices (changed):', Array.from(authorizedSet));
      set({ authorizedDevicePhones: authorizedSet });
    } else {
      console.log('🔒 Authorized devices unchanged, skipping update');
    }
  },
  
  fetchAlerts: async () => {
    try {
      console.log('🔒 SECURITY: Starting alert fetch with authorization checks...');
      
      // Fetch devices from both endpoints
      let ownDevices: any[] = [];
      let caregivingDevices: any[] = [];
      let ownDevicesError: any = null;
      let caregivingDevicesError: any = null;
      
      // Fetch own devices
      try {
        console.log('🔒 Fetching own devices for authorization...');
        const ownDevicesResponse = await apiService.getMyDevices();
        console.log('🔒 Own devices response:', ownDevicesResponse);
        
        if (Array.isArray(ownDevicesResponse)) {
          ownDevices = ownDevicesResponse;
        } else if (ownDevicesResponse && typeof ownDevicesResponse === 'object' && 'data' in ownDevicesResponse) {
          ownDevices = (ownDevicesResponse as any).data || [];
        }
        console.log(`🔒 Found ${ownDevices.length} own devices`);
      } catch (error) {
        ownDevicesError = error;
        console.warn('🔒 Failed to fetch own devices:', error);
      }
      
      // Fetch caregiving devices
      try {
        console.log('🔒 Fetching caregiving devices for authorization...');
        const caregivingDevicesResponse = await apiService.getCaregivingDevices();
        console.log('🔒 Caregiving devices response:', caregivingDevicesResponse);
        
        if (Array.isArray(caregivingDevicesResponse)) {
          caregivingDevices = caregivingDevicesResponse;
        } else if (caregivingDevicesResponse && typeof caregivingDevicesResponse === 'object' && 'data' in caregivingDevicesResponse) {
          caregivingDevices = (caregivingDevicesResponse as any).data || [];
        }
        console.log(`🔒 Found ${caregivingDevices.length} caregiving devices`);
      } catch (error) {
        caregivingDevicesError = error;
        console.warn('🔒 Failed to fetch caregiving devices:', error);
      }
      
      // If both endpoints failed, throw an error
      if (ownDevicesError && caregivingDevicesError) {
        console.error('🔒 CRITICAL: Both device endpoints failed');
        throw new Error('Could not fetch any authorized devices');
      }
      
      // Extract phone numbers from both device lists
      const ownDevicePhones = extractDevicePhones(ownDevices);
      const caregivingDevicePhones = extractDevicePhones(caregivingDevices);
      
      // Combine all authorized device phone numbers
      const allAuthorizedPhones = [...ownDevicePhones, ...caregivingDevicePhones];
      
      console.log('🔒 SECURITY: Device authorization summary:', {
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
      console.log('🔒 Fetching alerts from API...');
      const response = await apiService.getDeviceAlarms() as ApiAlertResponse;
      console.log('🔒 Raw API response:', response);
      
      // Handle paginated response - extract data array
      const alertsData = response?.data || (Array.isArray(response) ? response : []);
      console.log('🔒 Alerts data to transform:', alertsData);
      
      // Transform each alert to match our interface
      const transformedAlerts = alertsData.map(transformApiAlert);
      console.log('🔒 Transformed alerts (before filtering):', transformedAlerts);
      
      // SECURITY CHECK: Filter alerts to only include those from authorized devices
      const authorizedAlerts = transformedAlerts.filter(alert => {
        const devicePhone = alert.device_phone;
        const isAuthorized = isDeviceAuthorized(devicePhone, get().authorizedDevicePhones);
        
        if (!isAuthorized) {
          console.warn('🚨 SECURITY VIOLATION: Blocking unauthorized alert from device:', {
            alertId: alert.id,
            devicePhone: devicePhone,
            deviceNickname: alert.device_nickname,
            authorizedDevices: Array.from(get().authorizedDevicePhones)
          });
        }
        
        return isAuthorized;
      });
      
      console.log('🔒 SECURITY: Authorized alerts after filtering:', authorizedAlerts);
      console.log(`🔒 SECURITY SUMMARY: ${transformedAlerts.length} total alerts, ${authorizedAlerts.length} authorized, ${transformedAlerts.length - authorizedAlerts.length} blocked`);
      
      set({ alerts: authorizedAlerts });
    } catch (error) {
      console.error('🔒 SECURITY: Failed to fetch alerts:', error);
      set({ alerts: [] });
    }
  }
});
