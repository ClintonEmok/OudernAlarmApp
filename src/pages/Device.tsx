import DeviceStatus from "../components/DeviceStatus/DeviceStatus";
import DebugInfo from "../components/DebugInfo/DebugInfo";
import { capacitorService } from "../services/capacitor-service";
import { useNativeFeatures } from "../hooks/useNativeFeatures";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Smartphone } from "lucide-react";
import LocationControls from "../components/NativeFeatures/LocationControls";
import NotificationControls from "../components/NativeFeatures/NotificationControls";
import SecurityStatus from "../components/NativeFeatures/SecurityStatus";
import { useStore } from "../store/useStore";
import { useToast } from "@/hooks/use-toast";
import { localNotificationService } from "../services/local-notifications";
import { logger } from "../utils/logger";

const Device = () => {
  const [platformInfo, setPlatformInfo] = useState({
    platform: "",
    isNative: false,
    isMobile: false,
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
    sendTestNotification,
  } = useNativeFeatures();

  useEffect(() => {
    setPlatformInfo({
      platform: capacitorService.getPlatform(),
      isNative: capacitorService.isNative(),
      isMobile: capacitorService.isMobile(),
    });

    // Check notification permissions
    const checkNotificationPermissions = async () => {
      try {
        const permissions = await localNotificationService.checkPermissions();
        setNotificationPermission(permissions.display === "granted");
      } catch (error) {
        logger.error("Failed to check notification permissions", error);
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
      logger.error("Failed to get location", error);
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
      logger.error("Failed to toggle tracking", error);
    }
  };

  const handleRequestNotificationPermission = async () => {
    try {
      const permissions = await localNotificationService.requestPermissions();
      setNotificationPermission(permissions.display === "granted");
    } catch (error) {
      logger.error("Failed to request notification permissions", error);
      throw error;
    }
  };

  const handleRefresh = async () => {
    try {
      logger.debug("Refreshing device data");
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
      logger.error("Failed to refresh devices", error);
      toast({
        title: "Fout bij vernieuwen",
        description: "Kon apparaatgegevens niet bijwerken.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-full bg-blue-50 flex flex-col">
      <div className="flex-1 overflow-y-auto pt-safe">
        {/* Platform info for debugging */}
        {process.env.NODE_ENV === "development"}

        <DeviceStatus onRefresh={handleRefresh} />

        {/* Native Features Section */}
        {/* {isNative && (
          <div className="p-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone size={20} />
                  <span>Native Functies</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <LocationControls 
                  currentLocation={currentLocation} 
                  locationPermission={locationPermission} 
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
        )} */}
      </div>
    </div>
  );
};

export default Device;
