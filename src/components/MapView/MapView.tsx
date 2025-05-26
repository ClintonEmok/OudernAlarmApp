
import { useEffect } from 'react';
import { MapPin, Battery, Signal, Shield } from 'lucide-react';
import { useStore } from '../../store/useStore';
import InteractiveMap from './InteractiveMap';

// Default Mapbox token
const DEFAULT_MAPBOX_TOKEN = 'pk.eyJ1Ijoic2l0ZWpvYiIsImEiOiJjbWI1YjAyenkyNWYyMmtzYm11MzNzbnY4In0.u0WDvJRRU9bQiNV8WLhQtQ';

const MapView = () => {
  const { selectedDevice, deviceInfo, fetchDevices } = useStore();

  // Automatically fetch devices when component mounts
  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return (
    <div className="h-full flex flex-col">
      {/* Clean Status Bar - only show when device is selected */}
      {selectedDevice && (
        <div className="bg-white p-3 border-b border-blue-100 shadow-sm">
          <div className="flex items-center justify-between">
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
