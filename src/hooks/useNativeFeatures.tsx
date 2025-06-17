import { useEffect, useState } from "react";
import { localNotificationService } from "../services/local-notifications";
import { capacitorService } from "../services/capacitor-service";
import { useLocationService } from "./useLocationService";
import { useNotificationService } from "./useNotificationService";
import { logger } from "../utils/logger";
import { pushNotificationService } from "@/services/push-notifications";

export interface NativeFeaturesStatus {
  isInitialized: boolean;
  isNative: boolean;
  isMobile: boolean;
  permissions: {
    location: boolean;
    push: boolean;
    local: boolean;
  };
  errors: string[];
}

export const useNativeFeatures = () => {
  const [status, setStatus] = useState<NativeFeaturesStatus>({
    isInitialized: false,
    isNative: capacitorService.isNative(),
    isMobile: capacitorService.isMobile(),
    permissions: {
      location: false,
      push: false,
      local: false,
    },
    errors: [],
  });

  const locationService = useLocationService();
  const notificationService = useNotificationService();

  useEffect(() => {
    const initialize = async () => {
      const errors: string[] = [];

      try {
        logger.debug("Initializing native features...");
        capacitorService.logPlatformInfo();

        // Initialize push notifications
        try {
          await pushNotificationService.initialize();
          const pushPermissions =
            await pushNotificationService.checkPermissions();
          setStatus((prev) => ({
            ...prev,
            permissions: {
              ...prev.permissions,
              push: pushPermissions.receive === "granted",
            },
          }));
        } catch (error) {
          logger.error("Failed to initialize push notifications", error);
          errors.push("Push notificaties kunnen niet worden geïnitialiseerd");
        }

        // Initialize local notifications
        try {
          await localNotificationService.initialize();
          const localPermissions =
            await localNotificationService.checkPermissions();
          setStatus((prev) => ({
            ...prev,
            permissions: {
              ...prev.permissions,
              local: localPermissions.display === "granted",
            },
          }));
        } catch (error) {
          logger.error("Failed to initialize local notifications", error);
          errors.push("Lokale notificaties kunnen niet worden geïnitialiseerd");
        }

        // Check location permissions
        try {
          const hasLocationPermission =
            await locationService.checkLocationPermissions();
          setStatus((prev) => ({
            ...prev,
            permissions: {
              ...prev.permissions,
              location: hasLocationPermission,
            },
          }));
        } catch (error) {
          logger.error("Failed to check location permissions", error);
          errors.push("Locatie permissies kunnen niet worden gecontroleerd");
        }

        setStatus((prev) => ({
          ...prev,
          isInitialized: true,
          errors,
        }));

        logger.info("Native features initialized successfully");
      } catch (error) {
        logger.error("Failed to initialize native features", error);
        errors.push("Native functies kunnen niet worden geïnitialiseerd");

        setStatus((prev) => ({
          ...prev,
          isInitialized: true,
          errors,
        }));
      }
    };

    initialize();
  }, []);

  const requestAllPermissions = async (): Promise<void> => {
    try {
      logger.debug("Requesting all permissions...");

      const pushPermissions =
        await pushNotificationService.requestPermissions();
      const localPermissions =
        await localNotificationService.requestPermissions();
      const hasLocationPermission =
        await locationService.requestLocationPermissions();

      setStatus((prev) => ({
        ...prev,
        permissions: {
          push: pushPermissions.receive === "granted",
          local: localPermissions.display === "granted",
          location: hasLocationPermission,
        },
      }));

      logger.debug("Permissions updated", {
        location: hasLocationPermission,
        push: pushPermissions.receive === "granted",
        local: localPermissions.display === "granted",
      });
    } catch (error) {
      logger.error("Failed to request permissions", error);
      throw error;
    }
  };

  return {
    ...status,
    ...locationService,
    ...notificationService,
    requestAllPermissions,
    localNotificationService,
    pushNotificationService,
  };
};
