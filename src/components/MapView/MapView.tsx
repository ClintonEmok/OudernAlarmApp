import { useEffect, useState } from 'react';
import { MapPin, Battery, Signal, Shield, RotateCcw, User, UserX } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useAddressLookup } from '../../hooks/useAddressLookup';
import { useLocationService } from '../../hooks/useLocationService';
import InteractiveMap from './InteractiveMap';
import { Button } from '../ui/button';

// Default Mapbox token
const DEFAULT_MAPBOX_TOKEN = 'pk.eyJ1Ijoic2l0ZWpvYiIsImEiOiJjbWI1YjAyenkyNWYyMmtzYm11MzNzbnY4In0.u0WDvJRRU9bQiNV8WLhQtQ';
const MapView = () => {
  const {
    selectedDevice,
    deviceInfo,
    fetchDevices
  } = useStore();
  const [showUserLocation, setShowUserLocation] = useState(false);
  const {
    address,
    isLoading: addressLoading,
    error: addressError,
    refetch
  } = useAddressLookup({
    device: selectedDevice,
    mapboxToken: DEFAULT_MAPBOX_TOKEN
  });
  const {
    currentLocation,
    locationPermission,
    getCurrentLocation,
    requestLocationPermissions
  } = useLocationService();

  // Automatically fetch devices when component mounts
  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);
  const handleToggleUserLocation = async () => {
    if (!showUserLocation) {
      try {
        if (!locationPermission) {
          const granted = await requestLocationPermissions();
          if (!granted) {
            console.log('Location permission denied');
            return;
          }
        }
        await getCurrentLocation();
        setShowUserLocation(true);
      } catch (error) {
        console.error('Failed to get user location:', error);
      }
    } else {
      setShowUserLocation(false);
    }
  };
  return <div className="h-full flex flex-col">
      {/* Clean Status Bar - only show when device is selected */}
      {selectedDevice && <div className="bg-white p-4 border-b border-blue-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Battery size={16} className="text-green-600" />
                <span className="text-sm font-medium">{selectedDevice.batteryLevel}%</span>
              </div>
              
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-green-600">
                <Shield size={16} />
                <span className="text-sm font-medium">Veilig</span>
              </div>
              {/* User location toggle */}
              <Button variant={showUserLocation ? "default" : "outline"} size="sm" onClick={handleToggleUserLocation} className="p-1 h-8 w-8" title={showUserLocation ? "Verberg mijn locatie" : "Toon mijn locatie"}>
                {showUserLocation ? <User size={14} /> : <UserX size={14} />}
              </Button>
            </div>
          </div>
          
          {selectedDevice.location && <div className="space-y-3">
              {/* Location Title and Time */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm text-gray-500 font-medium">Huidige locatie</h3>
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} className="text-blue-600" />
                    {addressLoading ? <span className="text-lg font-semibold text-gray-900">Adres ophalen...</span> : address ? <span className="text-lg font-semibold text-gray-900">
                        {address.components.city || address.shortAddress || 'Thuis'}
                      </span> : addressError ? <span className="text-lg font-semibold text-red-600">Locatie onbekend</span> : <span className="text-lg font-semibold text-gray-900">Thuis</span>}
                    {addressError && <Button variant="ghost" size="sm" onClick={refetch} className="p-1 h-6 w-6">
                        <RotateCcw size={12} />
                      </Button>}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">Laatste update</span>
                  <div className="text-lg font-semibold text-gray-900">
                    {new Date(selectedDevice.lastUpdate).toLocaleTimeString('nl-NL', {
                hour: '2-digit',
                minute: '2-digit'
              })}
                  </div>
                </div>
              </div>
              
              {/* Coordinates */}
              <div className="text-sm text-gray-500">
                {selectedDevice.location.latitude.toFixed(4)}, {selectedDevice.location.longitude.toFixed(4)}
              </div>

              {/* User location status */}
              {showUserLocation && currentLocation && <div className="flex items-center space-x-2 text-green-600 pt-2 border-t border-gray-100">
                  <User size={12} />
                  <span className="text-xs">
                    Jouw locatie: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
                  </span>
                </div>}
            </div>}
        </div>}

      {/* Full Screen Map */}
      <div className="flex-1 relative">
        <InteractiveMap device={selectedDevice} mapboxToken={DEFAULT_MAPBOX_TOKEN} userLocation={currentLocation} showUserLocation={showUserLocation} />
      </div>
    </div>;
};
export default MapView;