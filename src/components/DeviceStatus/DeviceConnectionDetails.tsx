
import React from 'react';
import { Signal, RefreshCw, Settings } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Device } from '../../types';

interface DeviceConnectionDetailsProps {
  device: Device;
}

const DeviceConnectionDetails: React.FC<DeviceConnectionDetailsProps> = ({ device }) => {
  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold text-gray-900">Verbinding Details</h3>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Signal size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">Netwerk Type</span>
          </div>
          <span className="font-medium">{device.connectionType}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <RefreshCw size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">Laatste Update</span>
          </div>
          <span className="font-medium text-sm">
            {new Date(device.lastUpdate).toLocaleTimeString('nl-NL', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">Firmware</span>
          </div>
          <span className="font-medium">v{device.firmwareVersion}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceConnectionDetails;
