
import { useState, useCallback } from 'react';
import { geolocationService, LocationCoordinates } from '../services/geolocation-service';
import { logger } from '../utils/logger';

export const useLocationService = () => {
  const [currentLocation, setCurrentLocation] = useState<LocationCoordinates | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [isTracking, setIsTracking] = useState(false);

  // Get current location
  const getCurrentLocation = useCallback(async () => {
    try {
      const location = await geolocationService.getCurrentLocation();
      setCurrentLocation(location);
      return location;
    } catch (error) {
      logger.error('Failed to get current location', error);
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
      logger.error('Failed to start location tracking', error);
      throw error;
    }
  }, []);

  // Stop location tracking
  const stopLocationTracking = useCallback(async () => {
    try {
      await geolocationService.stopLocationTracking();
      setIsTracking(false);
    } catch (error) {
      logger.error('Failed to stop location tracking', error);
    }
  }, []);

  // Request location permissions
  const requestLocationPermissions = useCallback(async () => {
    try {
      const granted = await geolocationService.requestLocationPermissions();
      setLocationPermission(granted);
      return granted;
    } catch (error) {
      logger.error('Failed to request location permissions', error);
      return false;
    }
  }, []);

  // Check location permissions
  const checkLocationPermissions = useCallback(async () => {
    const hasPermission = await geolocationService.checkLocationPermissions();
    setLocationPermission(hasPermission);
    return hasPermission;
  }, []);

  return {
    currentLocation,
    locationPermission,
    isTracking,
    getCurrentLocation,
    startLocationTracking,
    stopLocationTracking,
    requestLocationPermissions,
    checkLocationPermissions
  };
};
