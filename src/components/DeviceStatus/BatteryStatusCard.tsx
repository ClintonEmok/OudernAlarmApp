
import React from 'react';
import { Battery, WifiOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Device } from '../../types';

interface BatteryStatusCardProps {
  device: Device;
}

const BatteryStatusCard: React.FC<BatteryStatusCardProps> = ({ device }) => {
  const getBatteryColor = (level: number, isOnline: boolean) => {
    if (!isOnline) return 'text-gray-400';
    if (level > 50) return 'text-green-600';
    if (level > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBatteryIcon = () => {
    if (!device.isOnline) {
      return <WifiOff size={16} className="text-gray-400" />;
    }
    return <Battery size={16} className={getBatteryColor(device.batteryLevel, device.isOnline || false)} />;
  };

  const getBatteryDisplay = () => {
    if (!device.isOnline) {
      return "Offline";
    }
    return `${device.batteryLevel}%`;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center space-x-2">
          {getBatteryIcon()}
          <span>Batterij</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`text-2xl font-bold ${!device.isOnline ? 'text-gray-400' : ''}`}>
              {getBatteryDisplay()}
            </span>
            {!device.isOnline && (
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                Geen contact
              </Badge>
            )}
            {device.isOnline && device.batteryLevel <= 20 && (
              <Badge variant="destructive" className="text-xs">Laag</Badge>
            )}
          </div>
          <Progress 
            value={device.isOnline ? device.batteryLevel : 0} 
            className="h-2"
          />
          {!device.isOnline && (
            <p className="text-xs text-gray-500 mt-1">
              Laatste contact: {device.lastUpdate.toLocaleString('nl-NL')}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BatteryStatusCard;
