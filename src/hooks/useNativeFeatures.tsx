
import { useEffect, useState, useCallback } from 'react';
import { pushNotificationService } from '../services/push-notification-service';
import { geolocationService, LocationCoordinates } from '../services/geolocation-service';
import { capacitorService } from '../services/capacitor-service';

export const useNativeFeatures = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationCoordinates | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [isTracking, setIsTracking] = useState(false);

  // Initialize native features
  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('Initializing native features...');
        
        // Initialize push notifications
        await pushNotificationService.initialize();
        
        // Check location permissions
        const hasLocationPermission = await geolocationService.checkLocationPermissions();
        setLocationPermission(hasLocationPermission);
        
        setIsInitialized(true);
        console.log('Native features initialized successfully');
      } catch (error) {
        console.error('Failed to initialize native features:', error);
      }
    };

    initialize();
  }, []);

  // Get current location
  const getCurrentLocation = useCallback(async () => {
    try {
      const location = await geolocationService.getCurrentLocation();
      setCurrentLocation(location);
      return location;
    } catch (error) {
      console.error('Failed to get current location:', error);
      throw error;
    }
  }, []);

  // Start location tracking
  const startLocationTracking = useCallback(async () => {
    try {
      await geolocationService.startLocationTracking((location) => {
        setCurrentLocation(location);
      });
      setIsTracking(true);
    } catch (error) {
      console.error('Failed to start location tracking:', error);
      throw error;
    }
  }, []);

  // Stop location tracking
  const stopLocationTracking = useCallback(async () => {
    try {
      await geolocationService.stopLocationTracking();
      setIsTracking(false);
    } catch (error) {
      console.error('Failed to stop location tracking:', error);
    }
  }, []);

  // Request location permissions
  const requestLocationPermissions = useCallback(async () => {
    try {
      const granted = await geolocationService.requestLocationPermissions();
      setLocationPermission(granted);
      return granted;
    } catch (error) {
      console.error('Failed to request location permissions:', error);
      return false;
    }
  }, []);

  // Send test notification
  const sendTestNotification = useCallback(async () => {
    try {
      await pushNotificationService.sendLocalNotification({
        title: 'Test Notificatie',
        body: 'Dit is een test notificatie van de Ouderen Alarm app',
        data: { test: true }
      });
    } catch (error) {
      console.error('Failed to send test notification:', error);
      throw error;
    }
  }, []);

  // Send alarm notification
  const sendAlarmNotification = useCallback(async (deviceName: string, alarmType: string) => {
    try {
      await pushNotificationService.sendAlarmNotification(deviceName, alarmType);
    } catch (error) {
      console.error('Failed to send alarm notification:', error);
      throw error;
    }
  }, []);

  // Send low battery notification
  const sendLowBatteryNotification = useCallback(async (deviceName: string, batteryLevel: number) => {
    try {
      await pushNotificationService.sendLowBatteryNotification(deviceName, batteryLevel);
    } catch (error) {
      console.error('Failed to send low battery notification:', error);
      throw error;
    }
  }, []);

  return {
    // Status
    isInitialized,
    isNative: capacitorService.isNative(),
    isMobile: capacitorService.isMobile(),
    
    // Location
    currentLocation,
    locationPermission,
    isTracking,
    getCurrentLocation,
    startLocationTracking,
    stopLocationTracking,
    requestLocationPermissions,
    
    // Notifications
    sendTestNotification,
    sendAlarmNotification,
    sendLowBatteryNotification
  };
};
