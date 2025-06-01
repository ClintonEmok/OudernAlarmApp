
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Heart, Shield, Wifi, Signal } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Device } from '../../types';

interface DeviceHealthCardProps {
  device: Device;
}

const DeviceHealthCard: React.FC<DeviceHealthCardProps> = ({
  device
}) => {
  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-green-600';
    if (level > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getOverallHealth = () => {
    const batteryHealth = device.batteryLevel > 20 ? 'good' : 'warning';
    const connectionHealth = device.location ? 'good' : 'warning';
    
    if (batteryHealth === 'good' && connectionHealth === 'good') {
      return { status: 'Uitstekend', color: 'bg-green-500', variant: 'default' as const };
    } else if (batteryHealth === 'warning' || connectionHealth === 'warning') {
      return { status: 'Let Op', color: 'bg-yellow-500', variant: 'secondary' as const };
    } else {
      return { status: 'Kritiek', color: 'bg-red-500', variant: 'destructive' as const };
    }
  };

  const health = getOverallHealth();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center space-x-2">
          <Heart size={16} className="text-red-500" />
          <span>Apparaat Gezondheid</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Algehele Status:</span>
            <Badge variant={health.variant}>{health.status}</Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield size={14} className="text-blue-500" />
                <span className="text-sm">Beveiliging</span>
              </div>
              <Badge variant="default" className="bg-green-500">Actief</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wifi size={14} className="text-purple-500" />
                <span className="text-sm">Verbinding</span>
              </div>
              <Badge variant={device.location ? "default" : "secondary"}>
                {device.location ? 'Verbonden' : 'Beperkt'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Signal size={14} className="text-green-500" />
                <span className="text-sm">Signaal</span>
              </div>
              <Badge variant="default">Sterk</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceHealthCard;
