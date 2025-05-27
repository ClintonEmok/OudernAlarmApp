
import { useEffect, useState } from 'react';
import { pushNotificationService } from '../services/push-notification-service';
import { capacitorService } from '../services/capacitor-service';
import { useLocationService } from './useLocationService';
import { useNotificationService } from './useNotificationService';

export const useNativeFeatures = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  
  const locationService = useLocationService();
  const notificationService = useNotificationService();

  // Initialize native features
  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('Initializing native features...');
        
        // Initialize push notifications
        await pushNotificationService.initialize();
        
        // Check location permissions
        await locationService.checkLocationPermissions();
        
        setIsInitialized(true);
        console.log('Native features initialized successfully');
      } catch (error) {
        console.error('Failed to initialize native features:', error);
      }
    };

    initialize();
  }, [locationService]);

  return {
    // Status
    isInitialized,
    isNative: capacitorService.isNative(),
    isMobile: capacitorService.isMobile(),
    
    // Location service
    ...locationService,
    
    // Notification service
    ...notificationService
  };
};
