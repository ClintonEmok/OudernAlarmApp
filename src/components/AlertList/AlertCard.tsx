import { AlertTriangle, Phone, MapPin, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { formatDistanceToNow, format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { nl } from 'date-fns/locale';
import { Alert } from '../../types';

interface AlertCardProps {
  alert: Alert;
  onCall: (phoneNumber: string) => void;
  onViewLocation: (alert: Alert) => void;
  onMarkAsResolved: (alertId: string) => void;
}

const AMSTERDAM_TIMEZONE = 'Europe/Amsterdam';

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

  const formatTimeInAmsterdam = (dateString: string) => {
    try {
      const date = new Date(dateString);
      
      // Format relative time using Amsterdam timezone
      const relativeTime = formatDistanceToNow(date, { 
        addSuffix: true, 
        locale: nl 
      });

      // Format exact time in Amsterdam timezone
      const exactTime = formatInTimeZone(
        date, 
        AMSTERDAM_TIMEZONE, 
        'dd-MM-yyyy HH:mm:ss', 
        { locale: nl }
      );

      return { relativeTime, exactTime };
    } catch (error) {
      console.error('Error formatting time:', error);
      return { relativeTime: 'Onbekend tijdstip', exactTime: 'Onbekend' };
    }
  };

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
          
          <div className="flex flex-col space-y-2 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock size={14} />
              <span>
                {alert.created_at 
                  ? formatTimeInAmsterdam(alert.created_at).relativeTime
                  : 'Onbekend tijdstip'
                }
              </span>
            </div>
            
            {alert.created_at && (
              <div className="text-xs text-gray-400 pl-5">
                Exacte tijd: {formatTimeInAmsterdam(alert.created_at).exactTime}
              </div>
            )}
            
            {alert.location && (
              <div className="flex items-center space-x-1">
                <MapPin size={14} />
                <span>Locatie beschikbaar</span>
              </div>
            )}
          </div>
          
          <div className="flex space-x-2 pt-2">
            {alert.device_phone && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onCall(alert.device_phone!)}
                className="flex-1"
              >
                <Phone size={14} className="mr-1" />
                Bellen
              </Button>
            )}
            
            {alert.location && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onViewLocation(alert)}
                className="flex-1"
              >
                <MapPin size={14} className="mr-1" />
                Locatie
              </Button>
            )}
            
            <Button 
              size="sm" 
              variant="default"
              onClick={() => onMarkAsResolved(alert.id)}
              className="flex-1"
            >
              <CheckCircle size={14} className="mr-1" />
              Opgelost
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertCard;
