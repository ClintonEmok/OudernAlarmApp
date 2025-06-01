
import { useEffect, useState } from 'react';
import { pushNotificationService } from '../services/push-notifications';
import { capacitorService } from '../services/capacitor-service';
import { useLocationService } from './useLocationService';
import { useNotificationService } from './useNotificationService';
import { logger } from '../utils/logger';

export interface NativeFeaturesStatus {
  isInitialized: boolean;
  isNative: boolean;
  isMobile: boolean;
  permissions: {
    location: boolean;
    notifications: boolean;
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
      notifications: false
    },
    errors: []
  });
  
  const locationService = useLocationService();
  const notificationService = useNotificationService();

  // Initialize native features
  useEffect(() => {
    const initialize = async () => {
      const errors: string[] = [];
      
      try {
        logger.debug('Initializing native features...');
        capacitorService.logPlatformInfo();
        
        // Initialize push notifications
        try {
          await pushNotificationService.initialize();
          const notificationPermissions = await pushNotificationService.checkPermissions();
          
          setStatus(prev => ({
            ...prev,
            permissions: {
              ...prev.permissions,
              notifications: notificationPermissions.receive === 'granted'
            }
          }));
        } catch (error) {
          logger.error('Failed to initialize notifications', error);
          errors.push('Notificaties kunnen niet worden geïnitialiseerd');
        }
        
        // Check location permissions
        try {
          const hasLocationPermission = await locationService.checkLocationPermissions();
          setStatus(prev => ({
            ...prev,
            permissions: {
              ...prev.permissions,
              location: hasLocationPermission
            }
          }));
        } catch (error) {
          logger.error('Failed to check location permissions', error);
          errors.push('Locatie permissies kunnen niet worden gecontroleerd');
        }
        
        setStatus(prev => ({
          ...prev,
          isInitialized: true,
          errors
        }));
        
        logger.info('Native features initialized successfully');
      } catch (error) {
        logger.error('Failed to initialize native features', error);
        errors.push('Native functies kunnen niet worden geïnitialiseerd');
        
        setStatus(prev => ({
          ...prev,
          isInitialized: true,
          errors
        }));
      }
    };

    initialize();
  }, []);

  // Request all permissions
  const requestAllPermissions = async (): Promise<void> => {
    try {
      logger.debug('Requesting all permissions...');
      
      // Request notification permissions
      const notificationPermissions = await pushNotificationService.requestPermissions();
      
      // Request location permissions
      const hasLocationPermission = await locationService.requestLocationPermissions();
      
      setStatus(prev => ({
        ...prev,
        permissions: {
          location: hasLocationPermission,
          notifications: notificationPermissions.receive === 'granted'
        }
      }));
      
      logger.debug('Permissions updated', {
        location: hasLocationPermission,
        notifications: notificationPermissions.receive === 'granted'
      });
    } catch (error) {
      logger.error('Failed to request permissions', error);
      throw error;
    }
  };

  return {
    // Status
    ...status,
    
    // Location service
    ...locationService,
    
    // Notification service
    ...notificationService,
    
    // Permission management
    requestAllPermissions,
    
    // Push notification service
    pushNotificationService
  };
};
