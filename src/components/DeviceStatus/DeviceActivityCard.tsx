
import React from 'react';
import { Activity, Clock, MapPin, WifiOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Device } from '../../types';
import { getRelativeTimeInAmsterdam } from '../../utils/timezone';

interface DeviceActivityCardProps {
  device: Device;
}

const DeviceActivityCard: React.FC<DeviceActivityCardProps> = ({
  device
}) => {
  const getStatusBadge = (device: Device) => {
    if (!device.isOnline) {
      return <Badge variant="destructive" className="bg-gray-500">Offline</Badge>;
    }
    
    const lastUpdate = device.lastUpdate;
    const hoursSinceUpdate = (Date.now() - new Date(lastUpdate).getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceUpdate < 1) {
      return <Badge variant="default" className="bg-green-500">Online</Badge>;
    } else if (hoursSinceUpdate < 24) {
      return <Badge variant="secondary">Recentelijk Actief</Badge>;
    } else {
      return <Badge variant="destructive">Offline</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center space-x-2">
          {device.isOnline ? (
            <Activity size={16} className="text-purple-600" />
          ) : (
            <WifiOff size={16} className="text-gray-400" />
          )}
          <span>Status & Activiteit</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Apparaat Status:</span>
            {getStatusBadge(device)}
          </div>
          
          <div className="flex items-start justify-between">
            <span className="text-sm text-gray-600">Laatste Update:</span>
            <div className="flex items-center space-x-1 text-sm text-right">
              <span className={!device.isOnline ? 'text-gray-500' : ''}>
                {getRelativeTimeInAmsterdam(device.lastUpdate)}
              </span>
            </div>
          </div>
          
          {device.location && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">GPS Locatie:</span>
              <div className="flex items-center space-x-1 text-sm">
                <MapPin size={14} className={device.isOnline ? "text-green-500" : "text-gray-400"} />
                <span className={!device.isOnline ? 'text-gray-500' : ''}>
                  {device.isOnline ? 'Beschikbaar' : 'Niet beschikbaar'}
                </span>
              </div>
            </div>
          )}
          
          {device.firmwareVersion && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Firmware:</span>
              <span className={`text-sm font-mono ${!device.isOnline ? 'text-gray-500' : ''}`}>
                {device.firmwareVersion}
              </span>
            </div>
          )}
          
          {!device.isOnline && (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                Apparaat is offline - batterij mogelijk leeg of geen netwerkverbinding
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceActivityCard;
