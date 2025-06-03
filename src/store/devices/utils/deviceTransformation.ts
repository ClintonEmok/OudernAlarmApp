
import { Device } from '../../../types';
import { logger } from '../../../utils/logger';
import { getMostRecentTimestamp } from './timestampHelpers';
import { determineDeviceOnlineStatus, extractBatteryLevel } from './onlineDetection';

/**
 * Helper function to transform API device response to Device type
 */
export const transformApiDevice = (apiDevice: any, recentAlarms: any[] = []): Device => {
  logger.debug('Transforming API device with alarm context:', {
    deviceId: apiDevice.id,
    phone: apiDevice.phone_number,
    recentAlarmsCount: recentAlarms.length
  });
  
  // Transform location data, converting string coordinates to numbers
  let location = undefined;
  if (apiDevice.location) {
    location = {
      latitude: parseFloat(apiDevice.location.latitude),
      longitude: parseFloat(apiDevice.location.longitude)
    };
  }
  
  // Get the most recent timestamp from status, location, updated_at AND recent alarms
  const lastUpdate = getMostRecentTimestamp(apiDevice, recentAlarms);
  
  // Get battery level from API status
  const batteryLevel = extractBatteryLevel(apiDevice);
  
  // Determine online status using improved logic
  const isOnline = determineDeviceOnlineStatus(apiDevice, lastUpdate, batteryLevel);
  
  // Only use real data from API for firmware
  const firmwareVersion = apiDevice.firmwareVersion || 
                         apiDevice.firmware_version || 
                         null;
  
  logger.debug('Device firmware version extracted', { 
    deviceId: apiDevice.id,
    firmwareVersion 
  });
  
  return {
    id: apiDevice.id || 0,
    phone_number: apiDevice.phone_number || '',
    nickname: apiDevice.nickname,
    batteryLevel: batteryLevel,
    lastUpdate: lastUpdate,
    firmwareVersion: firmwareVersion,
    status: apiDevice.status,
    location: location,
    created_at: apiDevice.created_at,
    updated_at: apiDevice.updated_at,
    isOnline: isOnline
  };
};
