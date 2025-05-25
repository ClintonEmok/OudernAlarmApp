
import { MapPin, Battery, Signal, Shield } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Button } from '../ui/Button';

const MapView = () => {
  const { currentLocation, deviceInfo, addAlert } = useStore();

  const handleSOS = () => {
    addAlert({
      type: 'SOS',
      timestamp: new Date(),
      isFalseAlarm: false,
      status: 'Active',
      location: 'Huidige locatie'
    });
  };

  const handleCheckIn = () => {
    console.log('Check-in performed');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Status Bar */}
      <div className="bg-white p-4 border-b border-purple-100">
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

      {/* Map Area */}
      <div className="flex-1 relative bg-gradient-to-br from-purple-50 to-purple-100">
        {/* Mock Map Background */}
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
                <div className="w-8 h-8 bg-purple-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <MapPin size={16} className="text-white" />
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-md shadow-md text-xs font-medium border">
                  Thuis
                </div>
                
                {/* Geofence circle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-purple-300 rounded-full opacity-60 -z-10"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Info Overlay */}
        <div className="absolute top-4 left-4 right-4">
          <div className="bg-white rounded-lg p-3 shadow-md border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Huidige locatie</p>
                <p className="font-semibold text-gray-900">Thuis</p>
                <p className="text-xs text-gray-500">
                  {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Laatste update</p>
                <p className="text-sm font-medium">{new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white p-4 border-t border-purple-100">
        <div className="flex space-x-3">
          <Button
            onClick={handleCheckIn}
            variant="secondary"
            className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
          >
            ✓ Check-in
          </Button>
          <Button
            onClick={handleSOS}
            variant="primary"
            className="flex-1 bg-red-600 hover:bg-red-700 text-white border-red-600"
          >
            🚨 SOS
          </Button>
        </div>
        <p className="text-xs text-gray-500 text-center mt-2">
          Druk op SOS voor noodhulp of Check-in om te laten weten dat alles goed is
        </p>
      </div>
    </div>
  );
};

export default MapView;
