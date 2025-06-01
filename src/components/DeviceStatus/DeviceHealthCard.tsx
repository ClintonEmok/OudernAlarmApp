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
      return {
        status: 'Uitstekend',
        color: 'bg-green-500',
        variant: 'default' as const
      };
    } else if (batteryHealth === 'warning' || connectionHealth === 'warning') {
      return {
        status: 'Let Op',
        color: 'bg-yellow-500',
        variant: 'secondary' as const
      };
    } else {
      return {
        status: 'Kritiek',
        color: 'bg-red-500',
        variant: 'destructive' as const
      };
    }
  };
  const health = getOverallHealth();
  return <Card>
      
      
    </Card>;
};
export default DeviceHealthCard;