
import { ArrowLeft, Smartphone, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useToast } from '../components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';
import { Card, CardContent } from '../components/ui/card';

const DeviceUnpairingSettings = () => {
  const navigate = useNavigate();
  const { devices, ownDevices, unpairDevice } = useStore();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleUnpairDevice = async (deviceId: string, deviceName: string) => {
    setIsLoading(deviceId);
    try {
      await unpairDevice(deviceId);
      toast({
        title: "Apparaat ontkoppeld",
        description: `${deviceName} is succesvol ontkoppeld`,
      });
    } catch (error) {
      console.error('Failed to unpair device:', error);
      toast({
        title: "Fout bij ontkoppelen",
        description: "Er is een fout opgetreden bij het ontkoppelen",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  const pairedDevices = [...devices, ...ownDevices];

  return (
    <div className="h-full bg-blue-50 flex flex-col">
      <div className="flex-1 overflow-y-auto pt-safe">
        <div className="p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/settings')}
              className="p-2"
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Apparaat Ontkoppelen</h2>
              <p className="text-sm text-gray-600">Verwijder gekoppelde apparaten</p>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="text-orange-600 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-orange-900 mb-2">Belangrijk</h3>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• Ontkoppelde apparaten kunnen geen alarmen meer verzenden</li>
                  <li>• Locatie tracking wordt stopgezet</li>
                  <li>• Het apparaat moet opnieuw gekoppeld worden voor gebruik</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Device List */}
          {pairedDevices.length > 0 ? (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Gekoppelde Apparaten</h3>
              {pairedDevices.map((device) => (
                <Card key={device.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Smartphone className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {device.name || `Apparaat ${device.id.slice(-4)}`}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {device.phone_number || 'Geen telefoonnummer'}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span className={`w-2 h-2 rounded-full ${
                              device.is_online ? 'bg-green-500' : 'bg-gray-400'
                            }`} />
                            <span>{device.is_online ? 'Online' : 'Offline'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            disabled={isLoading === device.id}
                          >
                            {isLoading === device.id ? "Ontkoppelen..." : "Ontkoppelen"}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Apparaat ontkoppelen?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Weet u zeker dat u dit apparaat wilt ontkoppelen? Het apparaat kan geen alarmen meer verzenden totdat het opnieuw wordt gekoppeld.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuleren</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleUnpairDevice(device.id, device.name || `Apparaat ${device.id.slice(-4)}`)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Ja, ontkoppelen
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Smartphone className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Geen gekoppelde apparaten</h3>
              <p className="text-gray-600 mb-4">U heeft momenteel geen apparaten gekoppeld aan uw account.</p>
              <Button onClick={() => navigate('/settings/device-pairing')}>
                Apparaat Koppelen
              </Button>
            </div>
          )}

          {/* Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Hulp nodig?</h3>
            <p className="text-sm text-blue-800">
              Als u problemen heeft met het ontkoppelen van apparaten, neem dan contact op met onze ondersteuning.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceUnpairingSettings;
