
import { NotificationPayload } from './types';
import { NotificationHandlers } from './notification-handlers';

export class NotificationTypes {
  constructor(private handlers: NotificationHandlers) {}

  async sendAlarmNotification(deviceName: string, alarmType: string): Promise<void> {
    const payload: NotificationPayload = {
      title: '🚨 Alarm Activatie',
      body: `${deviceName} heeft een ${alarmType} alarm geactiveerd`,
      data: {
        type: 'alarm',
        device: deviceName,
        alarmType,
        screen: '/alerts',
        priority: 'high'
      }
    };

    await this.handlers.showLocalNotification(payload);
  }

  async sendLowBatteryNotification(deviceName: string, batteryLevel: number): Promise<void> {
    const payload: NotificationPayload = {
      title: '🔋 Lage Batterij',
      body: `${deviceName} heeft nog ${batteryLevel}% batterij`,
      data: {
        type: 'battery',
        device: deviceName,
        batteryLevel,
        screen: '/device',
        priority: 'normal'
      }
    };

    await this.handlers.showLocalNotification(payload);
  }

  async sendLocationUpdateNotification(deviceName: string): Promise<void> {
    const payload: NotificationPayload = {
      title: '📍 Locatie Update',
      body: `${deviceName} heeft een nieuwe locatie gedeeld`,
      data: {
        type: 'location',
        device: deviceName,
        screen: '/dashboard',
        priority: 'normal'
      }
    };

    await this.handlers.showLocalNotification(payload);
  }
}
