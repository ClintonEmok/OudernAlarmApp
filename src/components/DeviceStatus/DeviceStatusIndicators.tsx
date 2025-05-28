
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
      status: selectedDevice.signalStrength >= 3 ? 'Online' : selectedDevice.signalStrength >= 1 ? 'Zwak' : 'Offline',
      isActive: selectedDevice.signalStrength >= 1,
      color: selectedDevice.signalStrength >= 3 ? 'bg-green-500' : selectedDevice.signalStrength >= 1 ? 'bg-yellow-500' : 'bg-red-500'
    }
  ];

  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-gray-900">Systeem Status</h4>
      <div className="grid grid-cols-3 gap-3">
        {indicators.map((indicator) => (
          <Card key={indicator.label} className="text-center">
            <CardContent className="p-3">
              <div className={`w-3 h-3 ${indicator.color} rounded-full mx-auto mb-2`}></div>
              <p className="text-xs font-medium text-gray-900">{indicator.label}</p>
              <p className="text-xs text-gray-500">{indicator.status}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Overall Status Badge */}
      <div className="text-center">
        <Badge 
          variant={indicators.every(i => i.isActive) ? "default" : "secondary"}
          className={indicators.every(i => i.isActive) ? "bg-green-500" : ""}
        >
          {indicators.every(i => i.isActive) ? "Alles Operationeel" : "Enkele Problemen"}
        </Badge>
      </div>
    </div>
  );
};

export default DeviceStatusIndicators;
