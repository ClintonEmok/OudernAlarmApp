
import React from 'react';
import { Card, CardContent } from '../ui/card';

const DeviceStatusIndicators: React.FC = () => {
  const indicators = [
    { label: 'GPS', status: 'Actief' },
    { label: 'SOS', status: 'Klaar' },
    { label: 'Monitor', status: 'Online' }
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {indicators.map((indicator) => (
        <Card key={indicator.label} className="text-center">
          <CardContent className="p-3">
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
            <p className="text-xs font-medium text-gray-900">{indicator.label}</p>
            <p className="text-xs text-gray-500">{indicator.status}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DeviceStatusIndicators;
