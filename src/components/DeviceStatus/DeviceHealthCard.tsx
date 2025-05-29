
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Device } from '../../types';

interface DeviceHealthCardProps {
  device: Device;
}

const DeviceHealthCard: React.FC<DeviceHealthCardProps> = ({ device }) => {
  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-green-600';
    if (level > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Apparaat Gezondheid</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className={`text-lg font-bold ${getBatteryColor(device.batteryLevel)}`}>
              {device.batteryLevel > 50 ? '●' : device.batteryLevel > 20 ? '◐' : '○'}
            </div>
            <p className="text-xs text-gray-600">Batterij</p>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">
              {device.location ? '●' : '○'}
            </div>
            <p className="text-xs text-gray-600">GPS</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceHealthCard;
