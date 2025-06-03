
import { logger } from '../../../utils/logger';

/**
 * Helper function to find the most recent timestamp from device data AND recent alarms
 */
export const getMostRecentTimestamp = (apiDevice: any, recentAlarms: any[] = []): Date => {
  const timestamps: Date[] = [];
  
  // Check status timestamp
  if (apiDevice.status?.timestamp) {
    timestamps.push(new Date(apiDevice.status.timestamp));
  }
  
  // Check location timestamp
  if (apiDevice.location?.timestamp) {
    timestamps.push(new Date(apiDevice.location.timestamp));
  }
  
  // Fallback to updated_at
  if (apiDevice.updated_at) {
    timestamps.push(new Date(apiDevice.updated_at));
  }
  
  // Check recent alarms from this device (last 24 hours)
  const devicePhone = apiDevice.phone_number;
  if (devicePhone && recentAlarms.length > 0) {
    const deviceAlarms = recentAlarms.filter(alarm => 
      alarm.device?.phone_number === devicePhone &&
      alarm.created_at
    );
    
    deviceAlarms.forEach(alarm => {
      timestamps.push(new Date(alarm.created_at));
    });
    
    logger.debug('Recent alarms found for device:', {
      devicePhone,
      alarmCount: deviceAlarms.length,
      alarmTimestamps: deviceAlarms.map(a => a.created_at)
    });
  }
  
  // Return the most recent timestamp, or current time if none found
  const mostRecent = timestamps.length > 0 ? 
    new Date(Math.max(...timestamps.map(t => t.getTime()))) : 
    new Date(apiDevice.updated_at || Date.now());
    
  logger.debug('Most recent timestamp calculated', {
    deviceId: apiDevice.id,
    devicePhone: apiDevice.phone_number,
    statusTimestamp: apiDevice.status?.timestamp,
    locationTimestamp: apiDevice.location?.timestamp,
    updatedAt: apiDevice.updated_at,
    totalTimestamps: timestamps.length,
    mostRecent: mostRecent.toISOString()
  });
  
  return mostRecent;
};
