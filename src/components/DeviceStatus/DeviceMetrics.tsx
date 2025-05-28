
import React from 'react';
import { Battery, Signal, Wifi, Clock, MapPin, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Device } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';

interface DeviceMetricsProps {
  device: Device;
}

const DeviceMetrics: React.FC<DeviceMetricsProps> = ({ device }) => {
  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-green-600';
    if (level > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBatteryProgressColor = (level: number) => {
    if (level > 50) return 'bg-green-500';
    if (level > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getSignalBars = (strength: number) => {
    return Math.min(Math.max(Math.round(strength), 0), 5);
  };

  const getConnectionIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'wifi':
        return <Wifi size={16} className="text-blue-600" />;
      case '5g':
      case '4g':
      case '3g':
        return <Signal size={16} className="text-blue-600" />;
      default:
        return <Signal size={16} className="text-gray-600" />;
    }
  };

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
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Battery Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <Battery size={16} className={getBatteryColor(device.batteryLevel)} />
              <span>Batterij</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{device.batteryLevel}%</span>
                {device.batteryLevel <= 20 && (
                  <Badge variant="destructive" className="text-xs">Laag</Badge>
                )}
              </div>
              <Progress 
                value={device.batteryLevel} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Signal Strength */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              {getConnectionIcon(device.connectionType)}
              <span>Signaal</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{getSignalBars(device.signalStrength)}/5</span>
                <Badge variant="outline">{device.connectionType}</Badge>
              </div>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((bar) => (
                  <div
                    key={bar}
                    className={`h-4 w-2 rounded-sm ${
                      bar <= getSignalBars(device.signalStrength)
                        ? 'bg-blue-500'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status & Last Update */}
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
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Firmware:</span>
              <span className="text-sm font-mono">{device.firmwareVersion}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Apparaat Gezondheid</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className={`text-lg font-bold ${getBatteryColor(device.batteryLevel)}`}>
                {device.batteryLevel > 50 ? '●' : device.batteryLevel > 20 ? '◐' : '○'}
              </div>
              <p className="text-xs text-gray-600">Batterij</p>
            </div>
            <div>
              <div className={`text-lg font-bold ${getSignalBars(device.signalStrength) >= 3 ? 'text-green-600' : getSignalBars(device.signalStrength) >= 2 ? 'text-yellow-600' : 'text-red-600'}`}>
                {getSignalBars(device.signalStrength) >= 3 ? '●' : getSignalBars(device.signalStrength) >= 2 ? '◐' : '○'}
              </div>
              <p className="text-xs text-gray-600">Verbinding</p>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">
                {device.location ? '●' : '○'}
              </div>
              <p className="text-xs text-gray-600">GPS</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceMetrics;
