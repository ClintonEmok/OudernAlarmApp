
import { httpClient } from './http-client';

export interface PushTokenRegistration {
  token: string;
  platform: 'web' | 'ios' | 'android';
  device_info?: {
    model?: string;
    os_version?: string;
  };
}

export interface NotificationPreferences {
  battery_alerts: boolean;
  alarm_notifications: boolean;
  location_updates: boolean;
  quiet_hours_start?: string; // HH:MM format
  quiet_hours_end?: string; // HH:MM format
}

class NotificationApiService {
  async registerPushToken(data: PushTokenRegistration) {
    return httpClient.post('/notifications/register-token', data);
  }

  async updateNotificationPreferences(preferences: NotificationPreferences) {
    return httpClient.put('/notifications/preferences', preferences);
  }

  async getNotificationPreferences(): Promise<NotificationPreferences> {
    return httpClient.get('/notifications/preferences');
  }

  async getNotificationHistory() {
    return httpClient.get('/notifications/history');
  }

  async markNotificationAsRead(notificationId: number) {
    return httpClient.put(`/notifications/${notificationId}/read`, {});
  }
}

export const notificationApiService = new NotificationApiService();
