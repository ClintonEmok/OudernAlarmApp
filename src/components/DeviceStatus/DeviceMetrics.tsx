
import React from 'react';
import { Battery } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Device } from '../../types';

interface DeviceMetricsProps {
  device: Device;
}

const DeviceMetrics: React.FC<DeviceMetricsProps> = ({ device }) => {
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

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Battery */}
      <Card>
        <CardContent className="p-4 text-center">
          <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${getBatteryColor(device.batteryLevel)}`}>
            <Battery size={24} />
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Batterij</h4>
          <p className="text-2xl font-bold text-gray-900">{device.batteryLevel}%</p>
          <p className="text-xs text-gray-500 mt-1">
            {device.batteryLevel > 20 ? 'Goed' : 'Laag'}
          </p>
        </CardContent>
      </Card>

      {/* Signal */}
      <Card>
        <CardContent className="p-4 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
            <div className="flex items-end space-x-0.5">
              {getSignalBars(device.signalStrength)}
            </div>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Signaal</h4>
          <p className="text-2xl font-bold text-gray-900">{device.signalStrength}/5</p>
          <p className="text-xs text-gray-500 mt-1">{device.connectionType}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceMetrics;
