
import { logger } from '../../../utils/logger';

/**
 * Improved online detection logic that prioritizes battery data over timestamps
 */
export const determineDeviceOnlineStatus = (
  apiDevice: any, 
  lastUpdate: Date,
  batteryLevel: number
): boolean => {
  // IMPROVED ONLINE DETECTION LOGIC:
  // 1. If device has valid battery data (> 0), it's considered online
  // 2. Only use timestamp logic if no battery data is available
  let isOnline = false;
  
  if (batteryLevel > 0) {
    // Device is sending battery data, so it must be online
    isOnline = true;
    logger.debug('Device marked as ONLINE due to battery data', {
      deviceId: apiDevice.id,
      phone: apiDevice.phone_number,
      batteryLevel
    });
  } else {
    // No battery data, fall back to timestamp-based detection
    const ONLINE_THRESHOLD_HOURS = 6;
    const hoursSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60);
    isOnline = hoursSinceUpdate < ONLINE_THRESHOLD_HOURS;
    
    logger.debug('Device online status based on timestamp (no battery data)', {
      deviceId: apiDevice.id,
      phone: apiDevice.phone_number,
      isOnline,
      hoursSinceUpdate: hoursSinceUpdate.toFixed(2),
      threshold: `${ONLINE_THRESHOLD_HOURS} hours`
    });
  }
  
  logger.debug('Final device status calculated', { 
    deviceId: apiDevice.id,
    phone: apiDevice.phone_number,
    batteryLevel, 
    isOnline, 
    lastUpdate: lastUpdate.toISOString(),
    detectionMethod: batteryLevel > 0 ? 'battery-data' : 'timestamp-based'
  });
  
  return isOnline;
};

/**
 * Extract battery level from various possible API response structures
 */
export const extractBatteryLevel = (apiDevice: any): number => {
  return apiDevice.status?.battery_level || 
         apiDevice.batteryLevel || 
         apiDevice.battery_level || 
         0;
};
