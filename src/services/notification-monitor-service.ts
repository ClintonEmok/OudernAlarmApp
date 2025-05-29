
import { Device } from '../types';
import { pushNotificationService } from './push-notification-service';

export interface NotificationTrigger {
  type: 'battery' | 'alarm' | 'location' | 'offline';
  threshold?: number;
  lastTriggered?: Date;
  cooldownMinutes?: number;
}

class NotificationMonitorService {
  private triggers: Map<string, NotificationTrigger> = new Map();
  private lastDeviceStates: Map<number, Partial<Device>> = new Map();

  // Initialize default triggers
  constructor() {
    this.triggers.set('battery_low', {
      type: 'battery',
      threshold: 20,
      cooldownMinutes: 60 // Don't spam battery notifications
    });
    
    this.triggers.set('battery_critical', {
      type: 'battery',
      threshold: 10,
      cooldownMinutes: 30
    });
  }

  async monitorDevice(device: Device): Promise<void> {
    const lastState = this.lastDeviceStates.get(device.id);
    
    // Check battery level
    await this.checkBatteryLevel(device, lastState);
    
    // Check location changes
    await this.checkLocationUpdate(device, lastState);
    
    // Check device offline status
    await this.checkDeviceOffline(device, lastState);
    
    // Update last state
    this.lastDeviceStates.set(device.id, {
      batteryLevel: device.batteryLevel,
      location: device.location,
      lastUpdate: device.lastUpdate
    });
  }

  private async checkBatteryLevel(device: Device, lastState?: Partial<Device>): Promise<void> {
    // Low battery notification
    if (device.batteryLevel <= 20 && this.shouldTrigger('battery_low')) {
      await pushNotificationService.sendLowBatteryNotification(
        device.nickname || device.phone_number,
        device.batteryLevel
      );
      this.markTriggered('battery_low');
    }
    
    // Critical battery notification
    if (device.batteryLevel <= 10 && this.shouldTrigger('battery_critical')) {
      await pushNotificationService.sendLocalNotification({
        title: '🔴 Kritieke Batterij',
        body: `${device.nickname || device.phone_number} heeft nog slechts ${device.batteryLevel}% batterij!`,
        data: {
          type: 'battery_critical',
          device: device.nickname || device.phone_number,
          batteryLevel: device.batteryLevel,
          screen: '/device',
          priority: 'high'
        }
      });
      this.markTriggered('battery_critical');
    }
  }

  private async checkLocationUpdate(device: Device, lastState?: Partial<Device>): Promise<void> {
    if (!device.location || !lastState?.location) return;
    
    // Calculate distance between locations (simple approximation)
    const distance = this.calculateDistance(
      device.location.latitude,
      device.location.longitude,
      lastState.location.latitude,
      lastState.location.longitude
    );
    
    // Significant movement (more than 100 meters)
    if (distance > 0.1) {
      await pushNotificationService.sendLocationUpdateNotification(
        device.nickname || device.phone_number
      );
    }
  }

  private async checkDeviceOffline(device: Device, lastState?: Partial<Device>): Promise<void> {
    const now = new Date();
    const lastUpdate = new Date(device.lastUpdate);
    const minutesSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60);
    
    // Device hasn't updated in over 30 minutes
    if (minutesSinceUpdate > 30 && this.shouldTrigger('device_offline')) {
      await pushNotificationService.sendLocalNotification({
        title: '📡 Apparaat Offline',
        body: `${device.nickname || device.phone_number} is al ${Math.round(minutesSinceUpdate)} minuten offline`,
        data: {
          type: 'offline',
          device: device.nickname || device.phone_number,
          minutesOffline: Math.round(minutesSinceUpdate),
          screen: '/device',
          priority: 'normal'
        }
      });
      this.markTriggered('device_offline');
    }
  }

  private shouldTrigger(triggerKey: string): boolean {
    const trigger = this.triggers.get(triggerKey);
    if (!trigger || !trigger.lastTriggered || !trigger.cooldownMinutes) {
      return true;
    }
    
    const now = new Date();
    const cooldownMs = trigger.cooldownMinutes * 60 * 1000;
    return (now.getTime() - trigger.lastTriggered.getTime()) > cooldownMs;
  }

  private markTriggered(triggerKey: string): void {
    const trigger = this.triggers.get(triggerKey);
    if (trigger) {
      trigger.lastTriggered = new Date();
    }
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  }

  // Simulate alarm trigger for testing
  async triggerAlarm(device: Device, alarmType: string = 'panic'): Promise<void> {
    await pushNotificationService.sendAlarmNotification(
      device.nickname || device.phone_number,
      alarmType
    );
  }
}

export const notificationMonitorService = new NotificationMonitorService();
