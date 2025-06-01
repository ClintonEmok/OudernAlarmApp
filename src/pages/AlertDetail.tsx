
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, ChevronDown, ChevronUp, Clock, Phone, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../components/ui/collapsible';
import { useStore } from '../store/useStore';
import { getFormattedAmsterdamTime } from '../utils/timezone';
import InteractiveMap from '../components/MapView/InteractiveMap';
import { useAddressLookup } from '../hooks/useAddressLookup';

const AlertDetail = () => {
  const { alertId } = useParams();
  const navigate = useNavigate();
  const { alerts } = useStore();
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Find the alert by ID
  const alert = alerts.find(a => a.id === alertId);

  // Mock mapbox token - in real app this would come from env/config
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

  // Create a mock device for the map component
  const mockDevice = alert?.location ? {
    id: 1,
    phone_number: alert.device_phone || '',
    nickname: alert.device_nickname || 'Onbekend apparaat',
    batteryLevel: 75,
    lastUpdate: new Date(),
    firmwareVersion: null,
    location: alert.location,
    created_at: '',
    updated_at: ''
  } : null;

  const { address, isLoading: addressLoading } = useAddressLookup({
    device: mockDevice,
    mapboxToken
  });

  if (!alert) {
    return (
      <div className="h-full bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Alarm niet gevonden</h2>
          <Button onClick={() => navigate('/alerts')}>
            Terug naar alarmen
          </Button>
        </div>
      </div>
    );
  }

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

  const timeInfo = alert.created_at ? getFormattedAmsterdamTime(alert.created_at) : 
    { relativeTime: 'Onbekend tijdstip', exactTime: 'Onbekend' };

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
    <div className="h-full bg-blue-50">
      <div className="safe-area-pt">
        <div className="p-4 pb-2">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/alerts')}
            >
              <ArrowLeft size={20} />
            </Button>
            <h2 className="text-xl font-bold text-gray-900">Noodmelding bekijken</h2>
          </div>
        </div>
        
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="p-4 pt-2 pb-safe space-y-4">
            
            {/* Alert Info Card */}
            <Card className={`${getAlertColor(alert.type)} border-l-4`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <span>{alert.title || `${alert.type} Alarm`}</span>
                  </CardTitle>
                  <Badge variant={getAlertBadgeVariant(alert.type) as any}>
                    {alert.type?.toUpperCase() || 'ALARM'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <User size={16} className="text-gray-500" />
                    <span>Apparaat: {alert.device_nickname || alert.device_phone || 'Onbekend'}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock size={16} className="text-gray-500" />
                    <span>{timeInfo.relativeTime}</span>
                  </div>
                  
                  <div className="text-xs text-gray-400 pl-6">
                    Exacte tijd: {timeInfo.exactTime}
                  </div>
                </div>

                {alert.description && (
                  <div className="pt-2">
                    <p className="text-sm text-gray-700">{alert.description}</p>
                  </div>
                )}

                {/* Responder Information */}
                {responderInfo.count > 0 && (
                  <div className="flex items-center space-x-2 p-3 bg-green-100 rounded-lg">
                    <Phone className="h-4 w-4 text-green-600" />
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
              </CardContent>
            </Card>

            {/* Map Section */}
            {alert.location && (
              <Card>
                <Collapsible open={isMapOpen} onOpenChange={setIsMapOpen}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MapPin size={20} className="text-blue-600" />
                          <CardTitle className="text-lg">Kaart</CardTitle>
                        </div>
                        {isMapOpen ? (
                          <ChevronUp size={20} className="text-gray-500" />
                        ) : (
                          <ChevronDown size={20} className="text-gray-500" />
                        )}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Location coordinates */}
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Latitude: {alert.location.latitude.toFixed(6)}</div>
                          <div>Longitude: {alert.location.longitude.toFixed(6)}</div>
                          {address && !addressLoading && (
                            <div className="pt-1">
                              <div className="font-medium">Adres:</div>
                              <div className="text-gray-700">{address.address}</div>
                            </div>
                          )}
                          {addressLoading && (
                            <div className="text-gray-500">Adres wordt opgehaald...</div>
                          )}
                        </div>
                        
                        {/* Map */}
                        {mapboxToken && (
                          <div className="h-64 rounded-lg overflow-hidden border">
                            <InteractiveMap
                              device={mockDevice}
                              mapboxToken={mapboxToken}
                            />
                          </div>
                        )}
                        
                        {!mapboxToken && (
                          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-center text-gray-500">
                              <MapPin size={32} className="mx-auto mb-2" />
                              <p>Mapbox token vereist voor kaart weergave</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            )}

            {!alert.location && (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  <MapPin size={32} className="mx-auto mb-2" />
                  <p>Geen locatie beschikbaar voor dit alarm</p>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default AlertDetail;
