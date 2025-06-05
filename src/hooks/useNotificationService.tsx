
import { useCallback } from 'react';
import { localNotificationService } from '../services/local-notifications';
import { logger } from '../utils/logger';

export const useNotificationService = () => {
  // Send test notification
  const sendTestNotification = useCallback(async () => {
    try {
      await localNotificationService.sendLocalNotification({
        title: 'Test Notificatie',
        body: 'Dit is een test notificatie van de Ouderen Alarm app',
        data: { test: true }
      });
    } catch (error) {
      logger.error('Failed to send test notification', error);
      throw error;
    }
  }, []);

  // Send alarm notification
  const sendAlarmNotification = useCallback(async (deviceName: string, alarmType: string) => {
    try {
      await localNotificationService.sendAlarmNotification(deviceName, alarmType);
    } catch (error) {
      logger.error('Failed to send alarm notification', error);
      throw error;
    }
  }, []);

  // Send low battery notification
  const sendLowBatteryNotification = useCallback(async (deviceName: string, batteryLevel: number) => {
    try {
      await localNotificationService.sendLowBatteryNotification(deviceName, batteryLevel);
    } catch (error) {
      logger.error('Failed to send low battery notification', error);
      throw error;
    }
  }, []);

  return {
    sendTestNotification,
    sendAlarmNotification,
    sendLowBatteryNotification
  };
};
