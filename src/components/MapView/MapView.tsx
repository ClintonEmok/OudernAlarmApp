
import { useState } from 'react';
import { MapPin, Battery, Signal, Shield } from 'lucide-react';
import { useStore } from '../../store/useStore';
import MapboxToken from '../MapboxToken/MapboxToken';
import InteractiveMap from './InteractiveMap';

// Default Mapbox token
const DEFAULT_MAPBOX_TOKEN = 'pk.eyJ1Ijoic2l0ZWpvYiIsImEiOiJjbWI1YjAyenkyNWYyMmtzYm11MzNzbnY4In0.u0WDvJRRU9bQiNV8WLhQtQ';

const MapView = () => {
  const { selectedDevice, deviceInfo } = useStore();
  const [mapboxToken, setMapboxToken] = useState(DEFAULT_MAPBOX_TOKEN);

  const handleTokenSaved = (token: string) => {
    setMapboxToken(token);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Status Bar */}
      <div className="bg-white p-4 border-b border-blue-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Battery size={16} className="text-green-600" />
              <span className="text-sm font-medium">{deviceInfo.batteryLevel}%</span>
            </div>
            <div className="flex items-center space-x-1">
              <Signal size={16} className="text-blue-600" />
              <span className="text-sm font-medium">{deviceInfo.connectionType}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-green-600">
            <Shield size={16} />
            <span className="text-sm font-medium">Veilig</span>
          </div>
        </div>
      </div>

      {/* Mapbox Token Configuration */}
      <div className="p-4">
        <MapboxToken onTokenSaved={handleTokenSaved} />
      </div>

      {/* Map Area */}
      <div className="flex-1 relative">
        <InteractiveMap device={selectedDevice} mapboxToken={mapboxToken} />
      </div>
    </div>
  );
};

export default MapView;
