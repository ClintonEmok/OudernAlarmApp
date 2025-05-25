import { Battery, Signal, Smartphone, Settings, RefreshCw, Wifi } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';

const DeviceStatus = () => {
  const { deviceInfo, updateDeviceInfo } = useStore();

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-green-600 bg-green-100';
    if (level > 20) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getSignalBars = (strength: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <div
        key={i}
        className={`w-1 ${i < strength ? 'bg-blue-600' : 'bg-gray-300'}`}
        style={{ height: `${(i + 1) * 3 + 2}px` }}
      />
    ));
  };

  const handleRefresh = () => {
    // Simulate refresh with slight variations
    updateDeviceInfo({
      lastUpdate: new Date(),
      batteryLevel: Math.max(0, deviceInfo.batteryLevel + Math.floor(Math.random() * 6) - 3),
      signalStrength: Math.min(5, Math.max(1, deviceInfo.signalStrength + Math.floor(Math.random() * 3) - 1))
    });
  };

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900">Apparaat Status</h2>
        <p className="text-sm text-gray-600">Overzicht van uw monitoring apparaat</p>
      </div>

      {/* Device Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone size={24} className="text-purple-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Ouderen Alarm Apparaat</h3>
                <p className="text-sm text-gray-600">ID: {deviceInfo.deviceId}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw size={16} />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Status Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Battery */}
        <Card>
          <CardContent className="p-4 text-center">
            <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${getBatteryColor(deviceInfo.batteryLevel)}`}>
              <Battery size={24} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Batterij</h4>
            <p className="text-2xl font-bold text-gray-900">{deviceInfo.batteryLevel}%</p>
            <p className="text-xs text-gray-500 mt-1">
              {deviceInfo.batteryLevel > 20 ? 'Goed' : 'Laag'}
            </p>
          </CardContent>
        </Card>

        {/* Signal */}
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
              <div className="flex items-end space-x-0.5">
                {getSignalBars(deviceInfo.signalStrength)}
              </div>
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Signaal</h4>
            <p className="text-2xl font-bold text-gray-900">{deviceInfo.signalStrength}/5</p>
            <p className="text-xs text-gray-500 mt-1">{deviceInfo.connectionType}</p>
          </CardContent>
        </Card>
      </div>

      {/* Connection Details */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900">Verbinding Details</h3>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Signal size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600">Netwerk Type</span>
            </div>
            <span className="font-medium">{deviceInfo.connectionType}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <RefreshCw size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600">Laatste Update</span>
            </div>
            <span className="font-medium text-sm">
              {deviceInfo.lastUpdate.toLocaleTimeString('nl-NL', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600">Firmware</span>
            </div>
            <span className="font-medium">v{deviceInfo.firmwareVersion}</span>
          </div>
        </CardContent>
      </Card>

      {/* Status Indicators */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center">
          <CardContent className="p-3">
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
            <p className="text-xs font-medium text-gray-900">GPS</p>
            <p className="text-xs text-gray-500">Actief</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-3">
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
            <p className="text-xs font-medium text-gray-900">SOS</p>
            <p className="text-xs text-gray-500">Klaar</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-3">
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
            <p className="text-xs font-medium text-gray-900">Monitor</p>
            <p className="text-xs text-gray-500">Online</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button className="w-full" variant="secondary">
          Apparaat Instellingen
        </Button>
        <Button className="w-full" variant="outline">
          Diagnostiek Uitvoeren
        </Button>
      </div>
    </div>
  );
};

export default DeviceStatus;
