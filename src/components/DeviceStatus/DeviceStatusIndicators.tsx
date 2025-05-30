
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { useStore } from '../../store/useStore';

const DeviceStatusIndicators: React.FC = () => {
  const { selectedDevice } = useStore();

  if (!selectedDevice) {
    return null;
  }

  const indicators = [
    {
      label: 'GPS',
      status: selectedDevice.location ? 'Actief' : 'Inactief',
      isActive: !!selectedDevice.location,
      color: selectedDevice.location ? 'bg-green-500' : 'bg-red-500'
    },
    {
      label: 'SOS',
      status: 'Klaar',
      isActive: true,
      color: 'bg-green-500'
    },
    {
      label: 'Monitor',
      status: 'Online',
      isActive: true,
      color: 'bg-green-500'
    }
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Status Indicatoren</h3>
        <div className="grid grid-cols-3 gap-4">
          {indicators.map((indicator) => (
            <div key={indicator.label} className="text-center">
              <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${indicator.color}`} />
              <p className="text-xs font-medium text-gray-900">{indicator.label}</p>
              <p className="text-xs text-gray-600">{indicator.status}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceStatusIndicators;
