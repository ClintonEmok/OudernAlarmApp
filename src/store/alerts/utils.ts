import { toZonedTime } from 'date-fns-tz';
import { Alert } from '../../types';

const AMSTERDAM_TIMEZONE = 'Europe/Amsterdam';

// Transform API response to match our Alert interface
export const transformApiAlert = (apiAlert: any): Alert => {
  console.log('Transforming API alert:', apiAlert);
  
  // Map Dutch alert types to English
  const typeMapping: { [key: string]: Alert['type'] } = {
    'Noodoproep': 'SOS',
    'Valalarm': 'Fall',
    'Low Battery': 'low_battery',
    'Offline': 'offline'
  };

  const mappedType = typeMapping[apiAlert.triggered_alerts] || 'emergency';
  
  // Convert UTC timestamp to Amsterdam timezone
  const convertToAmsterdamTime = (utcTimestamp: string): Date => {
    try {
      const utcDate = new Date(utcTimestamp);
      return toZonedTime(utcDate, AMSTERDAM_TIMEZONE);
    } catch (error) {
      console.error('Error converting timestamp to Amsterdam time:', error);
      return new Date(utcTimestamp); // Fallback to original timestamp
    }
  };
  
  return {
    id: apiAlert.id.toString(),
    type: mappedType,
    timestamp: convertToAmsterdamTime(apiAlert.created_at),
    isFalseAlarm: false,
    status: 'Active',
    // Map device information
    device_phone: apiAlert.device?.phone_number || '',
    device_nickname: apiAlert.device?.user?.name || apiAlert.device?.connection_number || 'Onbekend apparaat',
    title: `${apiAlert.triggered_alerts} Alarm`,
    description: `Alarm ontvangen van ${apiAlert.device?.user?.name || 'onbekend apparaat'}`,
    message: `${apiAlert.triggered_alerts} - ${apiAlert.device?.connection_number || 'Onbekend'}`,
    created_at: apiAlert.created_at, // Keep original UTC timestamp for API consistency
    // Add location if available (the API might provide this in other endpoints)
    location: undefined
  };
};

// Security function to check if user has access to device
export const isDeviceAuthorized = (devicePhone: string, authorizedDevices: Set<string>): boolean => {
  const isAuthorized = authorizedDevices.has(devicePhone);
  console.log(`🔒 Device authorization check: ${devicePhone} -> ${isAuthorized ? 'AUTHORIZED' : 'DENIED'}`);
  return isAuthorized;
};

// Helper function to compare arrays for changes
export const arraysEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, index) => val === sortedB[index]);
};

// Helper function to extract device phone numbers from API response
export const extractDevicePhones = (devices: any[]): string[] => {
  return devices
    .map(device => device.phone_number)
    .filter(phone => phone && phone.trim() !== '');
};
