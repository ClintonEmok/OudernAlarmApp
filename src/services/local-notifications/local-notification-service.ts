
import { LocalNotifications } from '@capacitor/local-notifications';
import { capacitorService } from '../capacitor-service';
import { logger } from '../../utils/logger';
import { NotificationPayload, LocalNotificationPermissionStatus, normalizePermissionState } from './types';

class LocalNotificationService {
  private isInitialized = false;
  private permissionStatus: LocalNotificationPermissionStatus = {
    display: 'prompt'
  };

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    logger.debug('Initializing local notifications...');

    try {
      // Check current permissions
      await this.checkPermissions();
      
      // Request permissions if needed
      if (this.permissionStatus.display !== 'granted') {
        await this.requestPermissions();
      }

      this.isInitialized = true;
      logger.debug('Local notifications initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize local notifications:', error);
      // Don't throw error - app should continue without notifications
      this.isInitialized = true;
    }
  }

  async checkPermissions(): Promise<LocalNotificationPermissionStatus> {
    try {
      if (capacitorService.isNative()) {
        const permissions = await LocalNotifications.checkPermissions();
        this.permissionStatus = {
          display: normalizePermissionState(permissions.display)
        };
      } else {
        // Web notification permission check
        if ('Notification' in window) {
          const permission = normalizePermissionState(Notification.permission);
          this.permissionStatus.display = permission;
        }
      }
      
      logger.debug('Current local notification permissions:', this.permissionStatus);
      return this.permissionStatus;
    } catch (error) {
      logger.error('Failed to check local notification permissions:', error);
      return this.permissionStatus;
    }
  }

  async requestPermissions(): Promise<LocalNotificationPermissionStatus> {
    try {
      if (capacitorService.isNative()) {
        const permissions = await LocalNotifications.requestPermissions();
        this.permissionStatus = {
          display: normalizePermissionState(permissions.display)
        };
      } else {
        // Web notification permission request
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          const normalizedPermission = normalizePermissionState(permission);
          this.permissionStatus.display = normalizedPermission;
        }
      }
      
      return this.permissionStatus;
    } catch (error) {
      logger.error('Failed to request local notification permissions:', error);
      throw error;
    }
  }

  getPermissionStatus(): LocalNotificationPermissionStatus {
    return this.permissionStatus;
  }

  async sendLocalNotification(payload: NotificationPayload): Promise<void> {
    try {
      // Check permissions first
      if (this.permissionStatus.display !== 'granted') {
        await this.requestPermissions();
      }

      if (this.permissionStatus.display !== 'granted') {
        logger.warn('Local notification permission denied');
        return;
      }

      if (capacitorService.isNative()) {
        await LocalNotifications.schedule({
          notifications: [
            {
              title: payload.title,
              body: payload.body,
              id: Date.now(),
              extra: payload.data,
              schedule: { at: new Date(Date.now() + 1000) },
              sound: 'beep.wav',
              attachments: undefined,
              actionTypeId: '',
              group: 'ouderen-alarm'
            }
          ]
        });
      } else {
        // Web notification fallback
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(payload.title, {
            body: payload.body,
            icon: '/lovable-uploads/d598e881-3925-4b75-bcd7-96ee8359c4e9.png',
            badge: '/lovable-uploads/d598e881-3925-4b75-bcd7-96ee8359c4e9.png',
            data: payload.data,
            tag: 'ouderen-alarm'
          });
        }
      }
    } catch (error) {
      logger.error('Failed to send local notification:', error);
      throw error;
    }
  }

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

    await this.sendLocalNotification(payload);
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

    await this.sendLocalNotification(payload);
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

    await this.sendLocalNotification(payload);
  }
}

export const localNotificationService = new LocalNotificationService();
