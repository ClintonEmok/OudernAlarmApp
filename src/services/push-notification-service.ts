
import { PushNotifications, PushNotificationSchema, ActionPerformed, Token } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { capacitorService } from './capacitor-service';

export interface NotificationPayload {
  title: string;
  body: string;
  data?: any;
}

class PushNotificationService {
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log('Initializing push notifications...');

    if (!capacitorService.isNative()) {
      console.log('Running on web - using fallback notifications');
      await this.initializeWebNotifications();
      return;
    }

    try {
      // Request permission
      const permissionResult = await PushNotifications.requestPermissions();
      console.log('Push notification permission:', permissionResult);

      if (permissionResult.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        await PushNotifications.register();
        
        // Setup listeners
        this.setupListeners();
        
        this.isInitialized = true;
        console.log('Push notifications initialized successfully');
      } else {
        console.warn('Push notification permission denied');
      }
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
    }
  }

  private async initializeWebNotifications(): Promise<void> {
    try {
      // Request web notification permission
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        console.log('Web notification permission:', permission);
      }

      // Initialize local notifications as fallback
      await LocalNotifications.requestPermissions();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize web notifications:', error);
    }
  }

  private setupListeners(): void {
    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Push registration success, token: ' + token.value);
      // Here you would typically send the token to your backend
      this.sendTokenToServer(token.value);
    });

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Error on registration: ' + JSON.stringify(error));
    });

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      console.log('Push notification received: ', notification);
      this.handleNotificationReceived(notification);
    });

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
      console.log('Push notification action performed', notification);
      this.handleNotificationAction(notification);
    });
  }

  private async sendTokenToServer(token: string): Promise<void> {
    // Store token locally for now
    localStorage.setItem('push_token', token);
    console.log('Push token stored:', token);
    
    // TODO: Send to your backend API
    // await apiService.registerPushToken(token);
  }

  private handleNotificationReceived(notification: PushNotificationSchema): void {
    console.log('Notification received in foreground:', notification);
    
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
    console.log('Notification action:', action);
    
    // Handle notification tap - navigate to relevant screen
    const data = action.notification.data;
    if (data?.screen) {
      window.location.href = data.screen;
    }
  }

  async sendLocalNotification(payload: NotificationPayload): Promise<void> {
    try {
      if (capacitorService.isNative()) {
        await LocalNotifications.schedule({
          notifications: [
            {
              title: payload.title,
              body: payload.body,
              id: Date.now(),
              extra: payload.data,
              schedule: { at: new Date(Date.now() + 1000) }
            }
          ]
        });
      } else {
        // Web notification fallback
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(payload.title, {
            body: payload.body,
            icon: '/favicon.ico',
            data: payload.data
          });
        }
      }
    } catch (error) {
      console.error('Failed to send local notification:', error);
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
        screen: '/alerts'
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
        screen: '/device'
      }
    };

    await this.sendLocalNotification(payload);
  }
}

export const pushNotificationService = new PushNotificationService();
