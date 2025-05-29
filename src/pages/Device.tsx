
import DeviceStatus from '../components/DeviceStatus/DeviceStatus';
import DebugInfo from '../components/DebugInfo/DebugInfo';
import { capacitorService } from '../services/capacitor-service';
import { useNativeFeatures } from '../hooks/useNativeFeatures';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Smartphone } from 'lucide-react';
import LocationControls from '../components/NativeFeatures/LocationControls';
import NotificationControls from '../components/NativeFeatures/NotificationControls';
import SecurityStatus from '../components/NativeFeatures/SecurityStatus';
import { useStore } from '../store/useStore';
import { useToast } from '@/hooks/use-toast';
import { pushNotificationService } from '../services/push-notification-service';

const Device = () => {
  const [platformInfo, setPlatformInfo] = useState({
    platform: '',
    isNative: false,
    isMobile: false
  });

  const [notificationPermission, setNotificationPermission] = useState(false);

  const { fetchDevices } = useStore();
  const { toast } = useToast();

  const {
    isInitialized,
    isNative,
    currentLocation,
    locationPermission,
    isTracking,
    getCurrentLocation,
    startLocationTracking,
    stopLocationTracking,
    requestLocationPermissions,
    sendTestNotification
  } = useNativeFeatures();

  useEffect(() => {
    setPlatformInfo({
      platform: capacitorService.getPlatform(),
      isNative: capacitorService.isNative(),
      isMobile: capacitorService.isMobile()
    });

    // Check notification permissions
    const checkNotificationPermissions = async () => {
      try {
        const permissions = await pushNotificationService.checkPermissions();
        setNotificationPermission(permissions.receive === 'granted');
      } catch (error) {
        console.error('Failed to check notification permissions:', error);
      }
    };

    checkNotificationPermissions();
  }, []);

  const handleGetLocation = async () => {
    try {
      if (!locationPermission) {
        await requestLocationPermissions();
      }
      await getCurrentLocation();
    } catch (error) {
      console.error('Failed to get location:', error);
    }
  };

  const handleToggleTracking = async () => {
    try {
      if (isTracking) {
        await stopLocationTracking();
      } else {
        if (!locationPermission) {
          await requestLocationPermissions();
        }
        await startLocationTracking();
      }
    } catch (error) {
      console.error('Failed to toggle tracking:', error);
    }
  };

  const handleRequestNotificationPermission = async () => {
    try {
      const permissions = await pushNotificationService.requestPermissions();
      setNotificationPermission(permissions.receive === 'granted');
    } catch (error) {
      console.error('Failed to request notification permissions:', error);
      throw error;
    }
  };

  const handleRefresh = async () => {
    try {
      console.log('Refreshing device data...');
      toast({
        title: "Vernieuwen...",
        description: "Apparaatgegevens worden bijgewerkt.",
      });
      
      await fetchDevices();
      
      toast({
        title: "✓ Bijgewerkt",
        description: "Apparaatgegevens zijn succesvol vernieuwd.",
      });
    } catch (error) {
      console.error('Failed to refresh devices:', error);
      toast({
        title: "Fout bij vernieuwen",
        description: "Kon apparaatgegevens niet bijwerken.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 pb-20">
      {/* Platform info for debugging */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-blue-100 p-2 text-xs text-blue-800 border-b">
          Platform: {platformInfo.platform} | Native: {platformInfo.isNative ? 'Yes' : 'No'} | Mobile: {platformInfo.isMobile ? 'Yes' : 'No'} | Features: {isInitialized ? 'Ready' : 'Loading...'}
        </div>
      )}
      
      <DeviceStatus onRefresh={handleRefresh} />

      {/* Native Features Section */}
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5 text-blue-600" />
              <span>Native Features</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <LocationControls
              locationPermission={locationPermission}
              currentLocation={currentLocation}
              isTracking={isTracking}
              onGetLocation={handleGetLocation}
              onToggleTracking={handleToggleTracking}
            />

            <NotificationControls
              isNative={isNative}
              hasPermission={notificationPermission}
              onSendTestNotification={sendTestNotification}
              onRequestPermission={handleRequestNotificationPermission}
            />

            <SecurityStatus />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Device;
