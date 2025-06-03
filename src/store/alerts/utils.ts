
import { Alert } from '../../types';
import { toAmsterdamTime } from '../../utils/timezone';
import { logger } from '../../utils/logger';

// Transform API response to match our Alert interface
export const transformApiAlert = (apiAlert: any): Alert => {
  logger.debug('Transforming API alert', apiAlert);
  
  // Parse multiple alert types from a single string like "Valalarm, Noodoproep"
  const alertTypes = apiAlert.triggered_alerts.split(',').map((type: string) => type.trim());
  
  // Map Dutch alert types to English - use the first (most important) type
  const typeMapping: { [key: string]: Alert['type'] } = {
    'Noodoproep': 'SOS',
    'Valalarm': 'Fall',
    'Low Battery': 'low_battery',
    'Offline': 'offline'
  };

  const primaryType = alertTypes[0] || 'emergency';
  const mappedType = typeMapping[primaryType] || 'emergency';
  
  // Convert UTC timestamp to Amsterdam timezone - this is the CORRECT time to use
  const amsterdamTime = toAmsterdamTime(apiAlert.created_at);
  
  logger.debug('Timezone conversion for alert:', {
    alertId: apiAlert.id,
    originalUTC: apiAlert.created_at,
    convertedAmsterdam: amsterdamTime.toISOString(),
    amsterdamTimeLocal: amsterdamTime.toString()
  });
  
  // Extract location data if available
  let location = undefined;
  if (apiAlert.location && apiAlert.location.latitude && apiAlert.location.longitude) {
    location = {
      latitude: parseFloat(apiAlert.location.latitude),
      longitude: parseFloat(apiAlert.location.longitude)
    };
  }
  
  // Use connection_number if available, fallback to phone_number
  const deviceIdentifier = apiAlert.device?.connection_number || 
                          apiAlert.device?.phone_number || 
                          'Onbekend apparaat';
  
  // Build description with all alert types if multiple
  const alertDescription = alertTypes.length > 1 
    ? `Meerdere alarmen: ${alertTypes.join(', ')}`
    : `${primaryType} alarm`;
  
  return {
    id: apiAlert.id.toString(),
    type: mappedType,
    timestamp: amsterdamTime, // This is the correctly converted Amsterdam time
    isFalseAlarm: apiAlert.false_alarm || false,
    status: apiAlert.false_alarm ? 'Resolved' : 'Active',
    location: location,
    // Map device information
    device_phone: apiAlert.device?.phone_number || '',
    device_nickname: apiAlert.device?.user?.name || deviceIdentifier,
    title: `${primaryType} Alarm`,
    description: alertDescription,
    message: `${apiAlert.triggered_alerts} - ${deviceIdentifier}`,
    created_at: apiAlert.created_at, // Keep original UTC for reference
    caregivers_en_route: apiAlert.caregivers_en_route || ''
  };
};

// Security function to check if user has access to device
export const isDeviceAuthorized = (devicePhone: string, authorizedDevices: Set<string>): boolean => {
  const isAuthorized = authorizedDevices.has(devicePhone);
  logger.debug(`Device authorization check: ${devicePhone} -> ${isAuthorized ? 'AUTHORIZED' : 'DENIED'}`);
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
