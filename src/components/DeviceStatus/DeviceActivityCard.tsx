
import React from 'react';
import { Activity, Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Device } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';

interface DeviceActivityCardProps {
  device: Device;
}

const DeviceActivityCard: React.FC<DeviceActivityCardProps> = ({ device }) => {
  const getStatusBadge = (device: Device) => {
    const lastUpdate = device.lastUpdate || new Date(device.updated_at);
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
          <Activity size={16} className="text-purple-600" />
          <span>Status & Activiteit</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Apparaat Status:</span>
            {getStatusBadge(device)}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Laatste Update:</span>
            <div className="flex items-center space-x-1 text-sm">
              <Clock size={14} className="text-gray-400" />
              <span>
                {device.lastUpdate 
                  ? formatDistanceToNow(device.lastUpdate, { 
                      addSuffix: true, 
                      locale: nl 
                    })
                  : formatDistanceToNow(new Date(device.updated_at), { 
                      addSuffix: true, 
                      locale: nl 
                    })
                }
              </span>
            </div>
          </div>
          
          {device.location && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">GPS Locatie:</span>
              <div className="flex items-center space-x-1 text-sm">
                <MapPin size={14} className="text-green-500" />
                <span>Beschikbaar</span>
              </div>
            </div>
          )}
          
          {device.firmwareVersion && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Firmware:</span>
              <span className="text-sm font-mono">{device.firmwareVersion}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceActivityCard;
