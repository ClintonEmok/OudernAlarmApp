
import { AlertTriangle, MapPin, Clock, Car } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert } from '../../types';
import { getFormattedAmsterdamTime } from '../../utils/timezone';

interface AlertCardProps {
  alert: Alert;
  onCall: (phoneNumber: string) => void;
  onViewLocation: (alert: Alert) => void;
  onMarkAsResolved: (alertId: string) => void;
}

const AlertCard = ({ alert, onCall, onViewLocation, onMarkAsResolved }: AlertCardProps) => {
  const getAlertIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'sos':
      case 'emergency':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'fall':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'low_battery':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'offline':
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-blue-500" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'sos':
      case 'emergency':
        return 'border-red-200 bg-red-50';
      case 'fall':
        return 'border-orange-200 bg-orange-50';
      case 'low_battery':
        return 'border-yellow-200 bg-yellow-50';
      case 'offline':
        return 'border-gray-200 bg-gray-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  const getAlertBadgeVariant = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'sos':
      case 'emergency':
        return 'destructive';
      case 'fall':
        return 'destructive';
      case 'low_battery':
        return 'secondary';
      default:
        return 'default';
    }
  };

  // Use the central timezone utility for consistent time formatting
  const getTimeInfo = () => {
    if (alert.created_at) {
      return getFormattedAmsterdamTime(alert.created_at);
    }
    return { relativeTime: 'Onbekend tijdstip', exactTime: 'Onbekend' };
  };

  const timeInfo = getTimeInfo();

  // Parse responder information
  const getResponderInfo = () => {
    const caregivers = alert.caregivers_en_route?.trim();
    
    if (!caregivers) {
      return { count: 0, names: [], display: 'Niemand onderweg' };
    }

    const names = caregivers.split(',').map(name => name.trim()).filter(name => name.length > 0);
    const count = names.length;
    
    if (count === 0) {
      return { count: 0, names: [], display: 'Niemand onderweg' };
    } else if (count === 1) {
      return { count: 1, names, display: `${names[0]} is onderweg` };
    } else {
      return { count, names, display: `${count} personen onderweg` };
    }
  };

  const responderInfo = getResponderInfo();

  return (
    <Card className={`${getAlertColor(alert.type)} border-l-4`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getAlertIcon(alert.type)}
            <div>
              <h3 className="font-semibold text-gray-900">
                {alert.title || `${alert.type} Alarm`}
              </h3>
              <p className="text-sm text-gray-600">
                Apparaat: {alert.device_nickname || alert.device_phone || 'Onbekend'}
              </p>
            </div>
          </div>
          <Badge variant={getAlertBadgeVariant(alert.type) as any}>
            {alert.type?.toUpperCase() || 'ALARM'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            {alert.description || alert.message || 'Geen beschrijving beschikbaar'}
          </p>
          
          {/* Responder Information */}
          {responderInfo.count > 0 && (
            <div className="flex items-center space-x-2 p-2 bg-green-100 rounded-lg">
              <Car className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  {responderInfo.display}
                </p>
                {responderInfo.count > 1 && (
                  <p className="text-xs text-green-600">
                    {responderInfo.names.join(', ')}
                  </p>
                )}
              </div>
            </div>
          )}
          
          <div className="flex flex-col space-y-2 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock size={14} />
              <span>{timeInfo.relativeTime}</span>
            </div>
            
            <div className="text-xs text-gray-400 pl-5">
              Exacte tijd: {timeInfo.exactTime}
            </div>
            
            {alert.location && (
              <div className="flex items-center space-x-1">
                <MapPin size={14} />
                <span>Locatie beschikbaar</span>
              </div>
            )}
          </div>
          
          {alert.location && (
            <div className="pt-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onViewLocation(alert)}
                className="w-full"
              >
                <MapPin size={14} className="mr-1" />
                Bekijk Locatie
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertCard;
