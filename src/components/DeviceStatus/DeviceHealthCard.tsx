import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
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
  return;
};
export default DeviceHealthCard;