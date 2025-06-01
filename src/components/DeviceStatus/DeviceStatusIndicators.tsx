import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { useStore } from '../../store/useStore';
const DeviceStatusIndicators: React.FC = () => {
  const {
    selectedDevice
  } = useStore();
  if (!selectedDevice) {
    return null;
  }
  const indicators = [{
    label: 'GPS',
    status: selectedDevice.location ? 'Actief' : 'Inactief',
    isActive: !!selectedDevice.location,
    color: selectedDevice.location ? 'bg-green-500' : 'bg-red-500'
  }, {
    label: 'SOS',
    status: 'Klaar',
    isActive: true,
    color: 'bg-green-500'
  }, {
    label: 'Monitor',
    status: 'Online',
    isActive: true,
    color: 'bg-green-500'
  }];
  return <Card>
      
    </Card>;
};
export default DeviceStatusIndicators;