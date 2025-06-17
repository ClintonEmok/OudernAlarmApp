import { PushNotifications } from "@capacitor/push-notifications";
import { LocalNotifications } from "@capacitor/local-notifications";
import { capacitorService } from "../capacitor-service";
import { logger } from "../../utils/logger";
import {
  NotificationPermissionStatus,
  normalizePermissionState,
} from "./types";

export class PermissionManager {
  private permissionStatus: NotificationPermissionStatus = {
    receive: "prompt",
    local: "prompt",
  };

  async checkPermissions(): Promise<NotificationPermissionStatus> {
    try {
      if (capacitorService.isNative()) {
        const pushPermissions = await PushNotifications.checkPermissions();
        const localPermissions = await LocalNotifications.checkPermissions();

        this.permissionStatus = {
          receive: normalizePermissionState(pushPermissions.receive),
          local: normalizePermissionState(localPermissions.display),
        };
      } else {
        // Web notification permission check
        if ("Notification" in window) {
          const permission = normalizePermissionState(Notification.permission);
          this.permissionStatus.receive = permission;
          this.permissionStatus.local = permission;
        }
      }

      logger.debug("Current notification permissions:", this.permissionStatus);
      return this.permissionStatus;
    } catch (error) {
      logger.error("Failed to check notification permissions:", error);
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
          local: normalizePermissionState(localPermissions.display),
        };
      } else {
        // Web notification permission request
        if ("Notification" in window) {
          const permission = await Notification.requestPermission();
          const normalizedPermission = normalizePermissionState(permission);
          this.permissionStatus.receive = normalizedPermission;
          this.permissionStatus.local = normalizedPermission;
        }
      }

      return this.permissionStatus;
    } catch (error) {
      logger.error("Failed to request notification permissions:", error);
      throw error;
    }
  }

  getPermissionStatus(): NotificationPermissionStatus {
    return this.permissionStatus;
  }

  updatePermissionStatus(status: NotificationPermissionStatus): void {
    this.permissionStatus = status;
  }
}
