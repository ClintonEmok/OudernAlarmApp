
import React from 'react';
import { Battery } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Device } from '../../types';

interface BatteryStatusCardProps {
  device: Device;
}

const BatteryStatusCard: React.FC<BatteryStatusCardProps> = ({ device }) => {
  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-green-600';
    if (level > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center space-x-2">
          <Battery size={16} className={getBatteryColor(device.batteryLevel)} />
          <span>Batterij</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{device.batteryLevel}%</span>
            {device.batteryLevel <= 20 && (
              <Badge variant="destructive" className="text-xs">Laag</Badge>
            )}
          </div>
          <Progress 
            value={device.batteryLevel} 
            className="h-2"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BatteryStatusCard;
