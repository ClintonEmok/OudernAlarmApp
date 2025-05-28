
import { useEffect } from 'react';
import { MapPin, Battery, Signal, Shield, RotateCcw } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useAddressLookup } from '../../hooks/useAddressLookup';
import InteractiveMap from './InteractiveMap';
import { Button } from '../ui/button';

// Default Mapbox token
const DEFAULT_MAPBOX_TOKEN = 'pk.eyJ1Ijoic2l0ZWpvYiIsImEiOiJjbWI1YjAyenkyNWYyMmtzYm11MzNzbnY4In0.u0WDvJRRU9bQiNV8WLhQtQ';

const MapView = () => {
  const { selectedDevice, deviceInfo, fetchDevices } = useStore();
  const { address, isLoading: addressLoading, error: addressError, refetch } = useAddressLookup({
    device: selectedDevice,
    mapboxToken: DEFAULT_MAPBOX_TOKEN
  });

  // Automatically fetch devices when component mounts
  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return (
    <div className="h-full flex flex-col">
      {/* Clean Status Bar - only show when device is selected */}
      {selectedDevice && (
        <div className="bg-white p-3 border-b border-blue-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Battery size={16} className="text-green-600" />
                <span className="text-sm font-medium">{selectedDevice.batteryLevel}%</span>
              </div>
              <div className="flex items-center space-x-1">
                <Signal size={16} className="text-blue-600" />
                <span className="text-sm font-medium">{selectedDevice.connectionType}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-green-600">
              <Shield size={16} />
              <span className="text-sm font-medium">Veilig</span>
            </div>
          </div>
          
          {selectedDevice.location && (
            <div className="space-y-1">
              {/* Address Information */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin size={14} className="text-blue-600" />
                  <div className="flex-1">
                    {addressLoading ? (
                      <span className="text-sm text-gray-500">Adres ophalen...</span>
                    ) : address ? (
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          {address.shortAddress}
                        </span>
                        {address.address !== address.shortAddress && (
                          <div className="text-xs text-gray-600 truncate" title={address.address}>
                            {address.address}
                          </div>
                        )}
                      </div>
                    ) : addressError ? (
                      <span className="text-sm text-red-600">{addressError}</span>
                    ) : (
                      <span className="text-sm text-gray-500">Adres niet beschikbaar</span>
                    )}
                  </div>
                </div>
                {addressError && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={refetch}
                    className="p-1 h-6 w-6"
                  >
                    <RotateCcw size={12} />
                  </Button>
                )}
              </div>
              
              {/* Coordinates */}
              <div className="flex items-center space-x-2 text-gray-500">
                <span className="text-xs">
                  {selectedDevice.location.latitude.toFixed(6)}, {selectedDevice.location.longitude.toFixed(6)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Full Screen Map */}
      <div className="flex-1 relative">
        <InteractiveMap device={selectedDevice} mapboxToken={DEFAULT_MAPBOX_TOKEN} />
      </div>
    </div>
  );
};

export default MapView;
