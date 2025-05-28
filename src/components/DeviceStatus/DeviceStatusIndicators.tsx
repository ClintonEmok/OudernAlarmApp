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
    status: selectedDevice.signalStrength >= 3 ? 'Online' : selectedDevice.signalStrength >= 1 ? 'Zwak' : 'Offline',
    isActive: selectedDevice.signalStrength >= 1,
    color: selectedDevice.signalStrength >= 3 ? 'bg-green-500' : selectedDevice.signalStrength >= 1 ? 'bg-yellow-500' : 'bg-red-500'
  }];
  return;
};
export default DeviceStatusIndicators;