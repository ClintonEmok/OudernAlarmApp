
import { PushNotifications, PushNotificationSchema, ActionPerformed, Token } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { capacitorService } from './capacitor-service';
import { logger } from '../utils/logger';

export interface NotificationPayload {
  title: string;
  body: string;
  data?: any;
}

export interface NotificationPermissionStatus {
  receive: 'granted' | 'denied' | 'prompt';
  local: 'granted' | 'denied' | 'prompt';
}

// Helper function to normalize permission states
const normalizePermissionState = (state: string): 'granted' | 'denied' | 'prompt' => {
  if (state === 'granted') return 'granted';
  if (state === 'denied') return 'denied';
  return 'prompt'; // includes 'prompt-with-rationale' and other states
};

class PushNotificationService {
  private isInitialized = false;
  private permissionStatus: NotificationPermissionStatus = {
    receive: 'prompt',
    local: 'prompt'
  };

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    logger.debug('Initializing push notifications...');

    if (!capacitorService.isNative()) {
      logger.debug('Running on web - using fallback notifications');
      await this.initializeWebNotifications();
      return;
    }

    try {
      // Check current permissions first
      await this.checkPermissions();
      
      // Request permission if needed
      if (this.permissionStatus.receive !== 'granted') {
        const permissionResult = await PushNotifications.requestPermissions();
        logger.debug('Push notification permission:', permissionResult);
        this.permissionStatus.receive = normalizePermissionState(permissionResult.receive);
      }

      if (this.permissionStatus.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        await PushNotifications.register();
        
        // Setup listeners
        this.setupListeners();
        
        this.isInitialized = true;
        logger.debug('Push notifications initialized successfully');
      } else {
        logger.warn('Push notification permission denied');
        throw new Error('Push notification permission denied');
      }
    } catch (error) {
      logger.error('Failed to initialize push notifications:', error);
      throw error;
    }
  }

  async checkPermissions(): Promise<NotificationPermissionStatus> {
    try {
      if (capacitorService.isNative()) {
        const pushPermissions = await PushNotifications.checkPermissions();
        const localPermissions = await LocalNotifications.checkPermissions();
        
        this.permissionStatus = {
          receive: normalizePermissionState(pushPermissions.receive),
          local: normalizePermissionState(localPermissions.display)
        };
      } else {
        // Web notification permission check
        if ('Notification' in window) {
          const permission = normalizePermissionState(Notification.permission);
          this.permissionStatus.receive = permission;
          this.permissionStatus.local = permission;
        }
      }
      
      logger.debug('Current notification permissions:', this.permissionStatus);
      return this.permissionStatus;
    } catch (error) {
      logger.error('Failed to check notification permissions:', error);
      return this.permissionStatus;
    }
  }

  async requestPermissions(): Promise<NotificationPermissionStatus> {
    try {
      if (capacitorService.isNative()) {
        const pushPermissions = await PushNotifications.requestPermissions();
        const localPermissions = await LocalNotifications.requestPermissions();
        
        this.permissionStatus = {
          receive: normalizePermissionState(pushPermissions.receive),
          local: normalizePermissionState(localPermissions.display)
        };
      } else {
        // Web notification permission request
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          const normalizedPermission = normalizePermissionState(permission);
          this.permissionStatus.receive = normalizedPermission;
          this.permissionStatus.local = normalizedPermission;
        }
      }
      
      return this.permissionStatus;
    } catch (error) {
      logger.error('Failed to request notification permissions:', error);
      throw error;
    }
  }

  getPermissionStatus(): NotificationPermissionStatus {
    return this.permissionStatus;
  }

  private async initializeWebNotifications(): Promise<void> {
    try {
      // Request web notification permission
      await this.requestPermissions();

      // Initialize local notifications as fallback
      if (capacitorService.isNative()) {
        await LocalNotifications.requestPermissions();
      }
      
      this.isInitialized = true;
    } catch (error) {
      logger.error('Failed to initialize web notifications:', error);
      throw error;
    }
  }

  private setupListeners(): void {
    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', (token: Token) => {
      logger.debug('Push registration success, token: ' + token.value);
      this.sendTokenToServer(token.value);
    });

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError', (error: any) => {
      logger.error('Error on registration: ' + JSON.stringify(error));
    });

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      logger.debug('Push notification received: ', notification);
      this.handleNotificationReceived(notification);
    });

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
      logger.debug('Push notification action performed', notification);
      this.handleNotificationAction(notification);
    });
  }

  private async sendTokenToServer(token: string): Promise<void> {
    try {
      // Store token locally
      localStorage.setItem('push_token', token);
      logger.debug('Push token stored:', token);
      
      // TODO: Send to your backend API
      // await apiService.registerPushToken(token);
    } catch (error) {
      logger.error('Failed to store push token:', error);
    }
  }

  private handleNotificationReceived(notification: PushNotificationSchema): void {
    logger.debug('Notification received in foreground:', notification);
    
    // Show local notification when app is in foreground
    if (capacitorService.isNative()) {
      this.showLocalNotification({
        title: notification.title || 'Nieuwe melding',
        body: notification.body || '',
        data: notification.data
      });
    }
  }

  private handleNotificationAction(action: ActionPerformed): void {
    logger.debug('Notification action:', action);
    
    // Handle notification tap - navigate to relevant screen
    const data = action.notification.data;
    if (data?.screen) {
      // Use React Router for navigation
      window.location.hash = data.screen;
    }
  }

  async sendLocalNotification(payload: NotificationPayload): Promise<void> {
    try {
      // Check permissions first
      if (this.permissionStatus.local !== 'granted') {
        await this.requestPermissions();
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

  async showLocalNotification(payload: NotificationPayload): Promise<void> {
    await this.sendLocalNotification(payload);
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

export const pushNotificationService = new PushNotificationService();
