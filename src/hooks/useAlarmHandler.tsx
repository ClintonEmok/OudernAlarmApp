import { useEffect, useRef } from "react";
import { useStore } from "../store/useStore";
import { useNativeFeatures } from "./useNativeFeatures";
import { Alert } from "../types";
import { logger } from "../utils/logger";

export const useAlarmHandler = () => {
  const { alerts } = useStore();
  const {
    sendAlarmNotification,
    getCurrentLocation,
    startLocationTracking,
    locationPermission,
    requestLocationPermissions,
  } = useNativeFeatures();

  const processedAlerts = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleNewAlarms = async () => {
      // Find new alarms that haven't been processed yet
      const newAlarms = alerts.filter(
        (alert) =>
          !processedAlerts.current.has(alert.id) && alert.status === "Active"
      );

      if (newAlarms.length === 0) return;

      logger.info(`New alarms detected: ${newAlarms.length}`);

      for (const alarm of newAlarms) {
        try {
          logger.info(
            `Processing alarm: ${alarm.id} - ${alarm.type} - ${alarm.device_nickname}`
          );

          // Mark as processed immediately to avoid duplicate processing
          processedAlerts.current.add(alarm.id);

          // Send push notification for the alarm
          const deviceName = alarm.device_nickname || "Onbekend apparaat";
          const alarmType = getAlarmTypeDisplayName(alarm.type);

          // await sendAlarmNotification(deviceName, alarmType);
          // logger.info(`Alarm notification sent for: ${deviceName}`);

          // Request location permissions if not granted
          if (!locationPermission) {
            logger.debug("Requesting location permissions due to alarm...");
            await requestLocationPermissions();
          }

          // Start location tracking to help with emergency response
          try {
            await getCurrentLocation();
            logger.debug("Current location obtained for alarm response");

            // Start continuous tracking for emergency situations
            if (
              alarm.type === "SOS" ||
              alarm.type === "Fall" ||
              alarm.type === "emergency"
            ) {
              await startLocationTracking();
              logger.info("Location tracking started for emergency alarm");
            }
          } catch (locationError) {
            logger.warn("Could not obtain location for alarm", locationError);
          }
        } catch (error) {
          logger.error(`Failed to process alarm: ${alarm.id}`, error);
        }
      }
    };

    handleNewAlarms();
  }, [
    alerts,
    sendAlarmNotification,
    getCurrentLocation,
    startLocationTracking,
    locationPermission,
    requestLocationPermissions,
  ]);

  // Clear processed alarms when alerts are empty (e.g., after refresh)
  useEffect(() => {
    if (alerts.length === 0) {
      processedAlerts.current.clear();
    }
  }, [alerts.length]);
};

// Helper function to get display name for alarm types
const getAlarmTypeDisplayName = (type: Alert["type"]): string => {
  switch (type) {
    case "SOS":
      return "Noodoproep";
    case "Fall":
      return "Valalarm";
    case "emergency":
      return "Noodsituatie";
    case "low_battery":
      return "Lage Batterij";
    case "offline":
      return "Offline";
    default:
      return "Alarm";
  }
};
