import {
  PushNotificationSchema,
  ActionPerformed,
  Token,
} from "@capacitor/push-notifications";
import { LocalNotifications } from "@capacitor/local-notifications";
import { capacitorService } from "../capacitor-service";
import { logger } from "../../utils/logger";
import { NotificationPayload } from "./types";
import { apiService } from "../api";

export class NotificationHandlers {
  private async sendTokenToServer(token: string): Promise<void> {
    try {
      // Store token locally
      localStorage.setItem("push_token", token);
      logger.debug("Push token stored:", token);

      // TODO: Send to your backend API
      await apiService.registerPushToken(token);
    } catch (error) {
      logger.error("Failed to store push token:", error);
    }
  }

  private handleNotificationReceived = (
    notification: PushNotificationSchema
  ): void => {
    logger.debug("Notification received in foreground:", notification);

    // Show local notification when app is in foreground
    if (capacitorService.isNative()) {
      this.showLocalNotification({
        title: notification.title || "Nieuwe melding",
        body: notification.body || "",
        data: notification.data,
      });
    }
  };

  private handleNotificationAction = (action: ActionPerformed): void => {
    logger.debug("Notification action:", action);

    // Handle notification tap - navigate to relevant screen
    const data = action.notification.data;
    if (data?.screen) {
      // Use React Router for navigation
      window.location.hash = data.screen;
    }
  };

  private handleRegistration = (token: Token): void => {
    logger.debug("Push registration success, token: " + token.value);
    this.sendTokenToServer(token.value);
  };

  private handleRegistrationError = (error: any): void => {
    logger.error("Error on registration: " + JSON.stringify(error));
  };

  async showLocalNotification(payload: NotificationPayload): Promise<void> {
    try {
      if (capacitorService.isNative()) {
        await LocalNotifications.schedule({
          notifications: [
            {
              title: payload.title,
              body: payload.body,
              id: Date.now(),
              extra: payload.data,
              schedule: { at: new Date(Date.now() + 1000) },
              sound: "beep.wav",
              attachments: undefined,
              actionTypeId: "",
              group: "ouderen-alarm",
            },
          ],
        });
      } else {
        // Web notification fallback
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(payload.title, {
            body: payload.body,
            icon: "/lovable-uploads/d598e881-3925-4b75-bcd7-96ee8359c4e9.png",
            badge: "/lovable-uploads/d598e881-3925-4b75-bcd7-96ee8359c4e9.png",
            data: payload.data,
            tag: "ouderen-alarm",
          });
        }
      }
    } catch (error) {
      logger.error("Failed to send local notification:", error);
      throw error;
    }
  }

  getHandlers() {
    return {
      onRegistration: this.handleRegistration,
      onRegistrationError: this.handleRegistrationError,
      onNotificationReceived: this.handleNotificationReceived,
      onNotificationAction: this.handleNotificationAction,
    };
  }
}
