
import React from 'react';
import { Smartphone, RefreshCw, Unlink } from 'lucide-react';
import { Card, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Device } from '../../types';

interface DeviceOverviewProps {
  device: Device;
  onRefresh: () => void;
  onDisconnect: () => void;
}

const DeviceOverview: React.FC<DeviceOverviewProps> = ({
  device,
  onRefresh,
  onDisconnect
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Smartphone size={24} className="text-purple-600" />
            <div>
              <h3 className="font-semibold text-gray-900">
                {device.nickname || 'Ouderen Alarm Apparaat'}
              </h3>
              <p className="text-sm text-gray-600">ID: {device.id}</p>
              <p className="text-xs text-gray-500">{device.phone_number}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw size={16} />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onDisconnect}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <Unlink size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default DeviceOverview;
