import { PushNotifications } from "@capacitor/push-notifications";
import { LocalNotifications } from "@capacitor/local-notifications";
import { capacitorService } from "../capacitor-service";
import { logger } from "../../utils/logger";
import { NotificationHandlers } from "./notification-handlers";
import { NotificationTypes } from "./notification-types";
import { NotificationPayload, NotificationPermissionStatus } from "./types";
import { PermissionManager } from "./permission-manger";

class PushNotificationService {
  private isInitialized = false;
  private permissionManager: PermissionManager;
  private notificationHandlers: NotificationHandlers;
  private notificationTypes: NotificationTypes;

  constructor() {
    this.permissionManager = new PermissionManager();
    this.notificationHandlers = new NotificationHandlers();
    this.notificationTypes = new NotificationTypes(this.notificationHandlers);
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    logger.debug("Initializing push notifications...");

    if (!capacitorService.isNative()) {
      logger.debug("Running on web - using fallback notifications");
      await this.initializeWebNotifications();
      return;
    }

    try {
      // Check current permissions first
      await this.permissionManager.checkPermissions();

      // Request permission if needed
      const currentStatus = this.permissionManager.getPermissionStatus();
      if (currentStatus.receive !== "granted") {
        const permissionResult = await PushNotifications.requestPermissions();
        this.permissionManager.updatePermissionStatus({
          ...currentStatus,
          receive: permissionResult.receive as "granted" | "denied" | "prompt",
        });
      }

      if (this.permissionManager.getPermissionStatus().receive === "granted") {
        // Register with Apple / Google to receive push via APNS/FCM
        await PushNotifications.register();

        // Setup listeners
        this.setupListeners();

        this.isInitialized = true;
        logger.debug("Push notifications initialized successfully");
      } else {
        logger.warn("Push notification permission denied");
        throw new Error("Push notification permission denied");
      }
    } catch (error) {
      logger.error("Failed to initialize push notifications:", error);
      throw error;
    }
  }

  async checkPermissions(): Promise<NotificationPermissionStatus> {
    return this.permissionManager.checkPermissions();
  }

  async requestPermissions(): Promise<NotificationPermissionStatus> {
    return this.permissionManager.requestPermissions();
  }

  getPermissionStatus(): NotificationPermissionStatus {
    return this.permissionManager.getPermissionStatus();
  }

  private async initializeWebNotifications(): Promise<void> {
    try {
      // Request web notification permission
      await this.permissionManager.requestPermissions();

      // Initialize local notifications as fallback
      if (capacitorService.isNative()) {
        await LocalNotifications.requestPermissions();
      }

      this.isInitialized = true;
    } catch (error) {
      logger.error("Failed to initialize web notifications:", error);
      throw error;
    }
  }

  private setupListeners(): void {
    const handlers = this.notificationHandlers.getHandlers();

    // On success, we should be able to receive notifications
    PushNotifications.addListener("registration", handlers.onRegistration);

    // Some issue with our setup and push will not work
    PushNotifications.addListener(
      "registrationError",
      handlers.onRegistrationError
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener(
      "pushNotificationReceived",
      handlers.onNotificationReceived
    );

    // Method called when tapping on a notification
    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      handlers.onNotificationAction
    );
  }

  async sendLocalNotification(payload: NotificationPayload): Promise<void> {
    // Check permissions first
    const currentStatus = this.permissionManager.getPermissionStatus();
    if (currentStatus.local !== "granted") {
      await this.permissionManager.requestPermissions();
    }

    await this.notificationHandlers.showLocalNotification(payload);
  }

  async showLocalNotification(payload: NotificationPayload): Promise<void> {
    await this.sendLocalNotification(payload);
  }

  async sendAlarmNotification(
    deviceName: string,
    alarmType: string
  ): Promise<void> {
    await this.notificationTypes.sendAlarmNotification(deviceName, alarmType);
  }

  async sendLowBatteryNotification(
    deviceName: string,
    batteryLevel: number
  ): Promise<void> {
    await this.notificationTypes.sendLowBatteryNotification(
      deviceName,
      batteryLevel
    );
  }

  async sendLocationUpdateNotification(deviceName: string): Promise<void> {
    await this.notificationTypes.sendLocationUpdateNotification(deviceName);
  }
}

export const pushNotificationService = new PushNotificationService();
