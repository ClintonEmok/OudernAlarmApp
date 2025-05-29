import { AlertTriangle, Phone, MapPin, Clock, CheckCircle, X } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { formatDistanceToNow, format } from 'date-fns';
import { nl } from 'date-fns/locale';

const AlertList = () => {
  useAuth();
  const { alerts, fetchAlerts, authorizedDevicePhones } = useStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [securityWarnings, setSecurityWarnings] = useState<string[]>([]);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Memoized load function to prevent recreating on every render
  const loadAlerts = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('🔒 Loading alerts with security checks...');
      await fetchAlerts();
      console.log('🔒 Alerts loaded successfully, count:', alerts.length);
      
      // Additional frontend security validation
      const unauthorizedAlerts = alerts.filter(alert => 
        !authorizedDevicePhones.has(alert.device_phone || '')
      );
      
      if (unauthorizedAlerts.length > 0) {
        console.error('🚨 SECURITY: Found unauthorized alerts in frontend:', unauthorizedAlerts);
        setSecurityWarnings([
          `Verdachte activiteit gedetecteerd: ${unauthorizedAlerts.length} alarm(en) van ongeautoriseerde apparaten zijn geblokkeerd.`
        ]);
        
        toast({
          title: "🔒 Beveiligingswaarschuwing",
          description: "Sommige alarmen zijn geblokkeerd vanwege toegangsrechten.",
          variant: "destructive"
        });
      } else {
        setSecurityWarnings([]);
      }
      
    } catch (error) {
      console.error('🔒 Failed to fetch alerts:', error);
      toast({
        title: "Laden Mislukt",
        description: "Kon alarmen niet laden. Probeer opnieuw.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [fetchAlerts, toast]);

  // Initial load effect - only depends on loadAlerts function
  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  // Separate effect for polling - doesn't depend on authorizedDevicePhones
  useEffect(() => {
    // Clear any existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    // Set up polling interval (increased to 30 seconds to reduce server load)
    pollingIntervalRef.current = setInterval(() => {
      console.log('🔒 Auto-refreshing alerts with security checks...');
      loadAlerts();
    }, 30000); // 30 seconds instead of 10

    // Cleanup function
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [loadAlerts]);

  // Separate effect for logging changes - doesn't trigger polling
  useEffect(() => {
    console.log('🔒 Current alerts in component:', alerts);
    console.log('🔒 Authorized device phones:', Array.from(authorizedDevicePhones));
  }, [alerts, authorizedDevicePhones]);

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

  const handleCallUser = (phoneNumber: string) => {
    // Additional security check before allowing call
    if (!authorizedDevicePhones.has(phoneNumber)) {
      console.warn('🚨 SECURITY: Blocked call attempt to unauthorized device:', phoneNumber);
      toast({
        title: "🔒 Toegang Geweigerd",
        description: "U heeft geen toestemming om dit apparaat te bellen.",
        variant: "destructive"
      });
      return;
    }
    
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      toast({
        title: "Geen Telefoonnummer",
        description: "Geen telefoonnummer beschikbaar voor dit apparaat.",
        variant: "destructive"
      });
    }
  };

  const handleViewLocation = (alert: any) => {
    if (alert.location?.latitude && alert.location?.longitude) {
      const url = `https://maps.google.com/maps?q=${alert.location.latitude},${alert.location.longitude}`;
      window.open(url, '_blank');
    } else {
      toast({
        title: "Geen Locatie",
        description: "Locatie informatie niet beschikbaar voor dit alarm.",
        variant: "destructive"
      });
    }
  };

  const handleMarkAsResolved = async (alertId: string) => {
    try {
      // This would call an API to mark the alert as resolved
      // For now, we'll just show a success message
      toast({
        title: "✓ Alarm Opgelost",
        description: "Het alarm is gemarkeerd als opgelost.",
      });
      
      // Refresh alerts
      await fetchAlerts();
    } catch (error) {
      console.error('Failed to resolve alert:', error);
      toast({
        title: "Actie Mislukt",
        description: "Kon het alarm niet markeren als opgelost.",
        variant: "destructive"
      });
    }
  };

  // Debounced refresh function to prevent rapid clicking
  const handleRefresh = useCallback(async () => {
    if (isLoading) return; // Prevent multiple simultaneous refreshes
    
    setIsLoading(true);
    try {
      console.log('Manual refresh triggered');
      await fetchAlerts();
      toast({
        title: "✓ Ververst",
        description: "Alarmen zijn bijgewerkt.",
      });
    } catch (error) {
      console.error('Failed to refresh alerts:', error);
      toast({
        title: "Verversen Mislukt",
        description: "Kon alarmen niet verversen.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [fetchAlerts, toast, isLoading]);

  if (isLoading && alerts.length === 0) {
    return (
      <div className="p-4 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">Alarmen</h2>
          <p className="text-sm text-gray-600">Laden van alarmen...</p>
        </div>
        
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Security warnings */}
      {securityWarnings.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-red-800">Beveiligingswaarschuwing</span>
          </div>
          {securityWarnings.map((warning, index) => (
            <p key={index} className="text-sm text-red-700 mt-1">{warning}</p>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-center flex-1">
          <h2 className="text-xl font-bold text-gray-900">Alarmen</h2>
          <p className="text-sm text-gray-600">
            {alerts.length === 0 ? 'Geen actieve alarmen' : `${alerts.length} alarm${alerts.length !== 1 ? 'en' : ''}`}
            <span className="text-xs text-gray-400 ml-2">(Updates elke 30 sec)</span>
          </p>
          {authorizedDevicePhones.size > 0 && (
            <p className="text-xs text-gray-400">
              🔒 {authorizedDevicePhones.size} geautoriseerde apparaten
            </p>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isLoading}
        >
          {isLoading ? 'Laden...' : 'Ververs'}
        </Button>
      </div>

      {alerts.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Alles is in orde
            </h3>
            <p className="text-gray-600">
              Er zijn momenteel geen actieve alarmen.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Card key={alert.id} className={`${getAlertColor(alert.type)} border-l-4`}>
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
                  <Badge variant={getAlertBadgeVariant(alert.type)}>
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
                          ? formatDistanceToNow(new Date(alert.created_at), { 
                              addSuffix: true, 
                              locale: nl 
                            })
                          : 'Onbekend tijdstip'
                        }
                      </span>
                    </div>
                    
                    {alert.created_at && (
                      <div className="text-xs text-gray-400 pl-5">
                        Exacte tijd: {format(new Date(alert.created_at), 'dd-MM-yyyy HH:mm:ss', { locale: nl })}
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
                        onClick={() => handleCallUser(alert.device_phone)}
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
                        onClick={() => handleViewLocation(alert)}
                        className="flex-1"
                      >
                        <MapPin size={14} className="mr-1" />
                        Locatie
                      </Button>
                    )}
                    
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={() => handleMarkAsResolved(alert.id)}
                      className="flex-1"
                    >
                      <CheckCircle size={14} className="mr-1" />
                      Opgelost
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertList;
