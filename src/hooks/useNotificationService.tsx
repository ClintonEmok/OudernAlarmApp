
import { useCallback } from 'react';
import { pushNotificationService } from '../services/push-notification-service';

export const useNotificationService = () => {
  // Send test notification
  const sendTestNotification = useCallback(async () => {
    try {
      await pushNotificationService.sendLocalNotification({
        title: 'Test Notificatie',
        body: 'Dit is een test notificatie van de Ouderen Alarm app',
        data: { test: true }
      });
    } catch (error) {
      console.error('Failed to send test notification:', error);
      throw error;
    }
  }, []);

  // Send alarm notification
  const sendAlarmNotification = useCallback(async (deviceName: string, alarmType: string) => {
    try {
      await pushNotificationService.sendAlarmNotification(deviceName, alarmType);
    } catch (error) {
      console.error('Failed to send alarm notification:', error);
      throw error;
    }
  }, []);

  // Send low battery notification
  const sendLowBatteryNotification = useCallback(async (deviceName: string, batteryLevel: number) => {
    try {
      await pushNotificationService.sendLowBatteryNotification(deviceName, batteryLevel);
    } catch (error) {
      console.error('Failed to send low battery notification:', error);
      throw error;
    }
  }, []);

  return {
    sendTestNotification,
    sendAlarmNotification,
    sendLowBatteryNotification
  };
};
