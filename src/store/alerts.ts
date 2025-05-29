
import { StateCreator } from 'zustand';
import { AlertState } from './types';
import { Alert } from '../types';
import { apiService } from '../services/api';

export interface AlertActions {
  setAlerts: (alerts: Alert[]) => void;
  fetchAlerts: () => Promise<void>;
  authorizedDevicePhones: Set<string>;
  setAuthorizedDevices: (devicePhones: string[]) => void;
}

export type AlertSlice = AlertState & AlertActions;

// Define the API response structure
interface ApiAlertResponse {
  data?: any[];
  [key: string]: any;
}

// Transform API response to match our Alert interface
const transformApiAlert = (apiAlert: any): Alert => {
  console.log('Transforming API alert:', apiAlert);
  
  // Map Dutch alert types to English
  const typeMapping: { [key: string]: Alert['type'] } = {
    'Noodoproep': 'SOS',
    'Valalarm': 'Fall',
    'Low Battery': 'low_battery',
    'Offline': 'offline'
  };

  const mappedType = typeMapping[apiAlert.triggered_alerts] || 'emergency';
  
  return {
    id: apiAlert.id.toString(),
    type: mappedType,
    timestamp: new Date(apiAlert.created_at),
    isFalseAlarm: false,
    status: 'Active',
    // Map device information
    device_phone: apiAlert.device?.phone_number || '',
    device_nickname: apiAlert.device?.user?.name || apiAlert.device?.connection_number || 'Onbekend apparaat',
    title: `${apiAlert.triggered_alerts} Alarm`,
    description: `Alarm ontvangen van ${apiAlert.device?.user?.name || 'onbekend apparaat'}`,
    message: `${apiAlert.triggered_alerts} - ${apiAlert.device?.connection_number || 'Onbekend'}`,
    created_at: apiAlert.created_at,
    // Add location if available (the API might provide this in other endpoints)
    location: undefined
  };
};

// Security function to check if user has access to device
const isDeviceAuthorized = (devicePhone: string, authorizedDevices: Set<string>): boolean => {
  const isAuthorized = authorizedDevices.has(devicePhone);
  console.log(`🔒 Device authorization check: ${devicePhone} -> ${isAuthorized ? 'AUTHORIZED' : 'DENIED'}`);
  return isAuthorized;
};

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
    const authorizedSet = new Set(devicePhones);
    console.log('🔒 Setting authorized devices:', Array.from(authorizedSet));
    set({ authorizedDevicePhones: authorizedSet });
  },
  
  fetchAlerts: async () => {
    try {
      console.log('🔒 SECURITY: Starting alert fetch with authorization checks...');
      
      // First, get user's authorized devices
      console.log('🔒 Fetching user devices for authorization...');
      const userDevicesResponse = await apiService.getMyDevices();
      console.log('🔒 User devices response:', userDevicesResponse);
      
      // Extract device phone numbers from user's devices
      let authorizedDevicePhones: string[] = [];
      if (Array.isArray(userDevicesResponse)) {
        authorizedDevicePhones = userDevicesResponse
          .map(device => device.phone_number)
          .filter(phone => phone && phone.trim() !== '');
      } else if (userDevicesResponse && typeof userDevicesResponse === 'object' && 'data' in userDevicesResponse) {
        authorizedDevicePhones = ((userDevicesResponse as any).data || [])
          .map((device: any) => device.phone_number)
          .filter((phone: string) => phone && phone.trim() !== '');
      }
      
      console.log('🔒 SECURITY: Authorized device phones:', authorizedDevicePhones);
      
      // Update authorized devices in store
      get().setAuthorizedDevices(authorizedDevicePhones);
      
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
