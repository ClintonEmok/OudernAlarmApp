
import { StateCreator } from 'zustand';
import { AlertState } from './types';
import { Alert } from '../types';
import { apiService } from '../services/api';

export interface AlertActions {
  setAlerts: (alerts: Alert[]) => void;
  fetchAlerts: () => Promise<void>;
}

export type AlertSlice = AlertState & AlertActions;

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

export const createAlertSlice: StateCreator<
  AlertSlice,
  [],
  [],
  AlertSlice
> = (set) => ({
  alerts: [],
  
  setAlerts: (alerts) => set({ alerts }),
  
  fetchAlerts: async () => {
    try {
      console.log('Fetching alerts from API...');
      const response = await apiService.getDeviceAlarms();
      console.log('Raw API response:', response);
      
      // Handle paginated response - extract data array
      const alertsData = response?.data || (Array.isArray(response) ? response : []);
      console.log('Alerts data to transform:', alertsData);
      
      // Transform each alert to match our interface
      const transformedAlerts = alertsData.map(transformApiAlert);
      console.log('Transformed alerts:', transformedAlerts);
      
      set({ alerts: transformedAlerts });
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
      set({ alerts: [] });
    }
  }
});
