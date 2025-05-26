
import DeviceStatus from '../components/DeviceStatus/DeviceStatus';
import DebugInfo from '../components/DebugInfo/DebugInfo';
import { capacitorService } from '../services/capacitor-service';
import { useNativeFeatures } from '../hooks/useNativeFeatures';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { MapPin, Bell, Shield, Smartphone } from 'lucide-react';

const Device = () => {
  const [platformInfo, setPlatformInfo] = useState({
    platform: '',
    isNative: false,
    isMobile: false
  });

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

  return (
    <div className="min-h-screen bg-blue-50 pb-20">
      {/* Platform info for debugging */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-blue-100 p-2 text-xs text-blue-800 border-b">
          Platform: {platformInfo.platform} | Native: {platformInfo.isNative ? 'Yes' : 'No'} | Mobile: {platformInfo.isMobile ? 'Yes' : 'No'} | Features: {isInitialized ? 'Ready' : 'Loading...'}
        </div>
      )}
      
      <DeviceStatus />

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
            {/* Location Services */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Locatie Services</p>
                  <p className="text-sm text-gray-600">
                    {locationPermission ? 'Toegestaan' : 'Geen toestemming'}
                    {currentLocation && ` • ${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}`}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={handleGetLocation}>
                  Locatie
                </Button>
                <Button 
                  size="sm" 
                  variant={isTracking ? "destructive" : "default"} 
                  onClick={handleToggleTracking}
                >
                  {isTracking ? 'Stop' : 'Track'}
                </Button>
              </div>
            </div>

            {/* Push Notifications */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium">Push Notificaties</p>
                  <p className="text-sm text-gray-600">
                    {isNative ? 'Native push ready' : 'Web notificaties'}
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={sendTestNotification}>
                Test
              </Button>
            </div>

            {/* Security Features */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium">Veiligheid</p>
                  <p className="text-sm text-gray-600">
                    SOS knop en alarm systeem
                  </p>
                </div>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Device;
