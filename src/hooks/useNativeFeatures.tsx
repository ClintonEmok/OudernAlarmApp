
import { useEffect, useState } from 'react';
import { pushNotificationService } from '../services/push-notification-service';
import { capacitorService } from '../services/capacitor-service';
import { useLocationService } from './useLocationService';
import { useNotificationService } from './useNotificationService';

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
        console.log('Initializing native features...');
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
          console.error('Failed to initialize notifications:', error);
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
          console.error('Failed to check location permissions:', error);
          errors.push('Locatie permissies kunnen niet worden gecontroleerd');
        }
        
        setStatus(prev => ({
          ...prev,
          isInitialized: true,
          errors
        }));
        
        console.log('Native features initialized successfully');
      } catch (error) {
        console.error('Failed to initialize native features:', error);
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
      console.log('Requesting all permissions...');
      
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
      
      console.log('Permissions updated:', {
        location: hasLocationPermission,
        notifications: notificationPermissions.receive === 'granted'
      });
    } catch (error) {
      console.error('Failed to request permissions:', error);
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
