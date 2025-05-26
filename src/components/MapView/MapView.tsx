
import { useState } from 'react';
import { MapPin, Battery, Signal, Shield } from 'lucide-react';
import { useStore } from '../../store/useStore';
import MapboxToken from '../MapboxToken/MapboxToken';
import InteractiveMap from './InteractiveMap';

const MapView = () => {
  const { selectedDevice, deviceInfo } = useStore();
  const [mapboxToken, setMapboxToken] = useState('');

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
        {mapboxToken ? (
          <InteractiveMap device={selectedDevice} mapboxToken={mapboxToken} />
        ) : (
          /* Fallback mock map when no token */
          <div className="h-full bg-gradient-to-br from-blue-50 to-blue-100 relative">
            <div className="absolute inset-0 bg-gray-200 bg-opacity-50">
              <div className="w-full h-full relative overflow-hidden">
                {/* Grid pattern to simulate map */}
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px'
                  }}
                />
                
                {/* Current location marker */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                      <MapPin size={16} className="text-white" />
                    </div>
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-md shadow-md text-xs font-medium border">
                      Configureer Mapbox Token
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;
