
import React from 'react';
import { Signal, Wifi } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Device } from '../../types';

interface SignalStatusCardProps {
  device: Device;
}

const SignalStatusCard: React.FC<SignalStatusCardProps> = ({ device }) => {
  const getSignalBars = (strength: number | null) => {
    if (strength === null || strength === undefined) return null;
    return Math.min(Math.max(Math.round(strength), 0), 5);
  };

  const getConnectionIcon = (type: string | null) => {
    if (!type) return <Signal size={16} className="text-gray-400" />;
    
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

  const signalBars = getSignalBars(device.signalStrength);

  return (
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
            {signalBars !== null ? (
              <>
                <span className="text-2xl font-bold">{signalBars}/5</span>
                <Badge variant="outline">{device.connectionType || 'Onbekend'}</Badge>
              </>
            ) : (
              <>
                <span className="text-lg text-gray-500">Onbekend</span>
                <Badge variant="outline" className="text-gray-500">Geen data</Badge>
              </>
            )}
          </div>
          {signalBars !== null ? (
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((bar) => (
                <div
                  key={bar}
                  className={`h-4 w-2 rounded-sm ${
                    bar <= signalBars
                      ? 'bg-blue-500'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          ) : (
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((bar) => (
                <div
                  key={bar}
                  className="h-4 w-2 rounded-sm bg-gray-200"
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SignalStatusCard;
