import { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { AlertTriangle, Unlink, Smartphone } from 'lucide-react';
import DeviceAssignment from '../DeviceAssignment/DeviceAssignment';
import DeviceOverview from './DeviceOverview';
import DeviceMetrics from './DeviceMetrics';
import DeviceConnectionDetails from './DeviceConnectionDetails';
import DeviceStatusIndicators from './DeviceStatusIndicators';

interface DeviceStatusProps {
  onRefresh?: () => void;
}

const DeviceStatus = ({ onRefresh }: DeviceStatusProps) => {
  useAuth();
  const { devices, selectedDevice, fetchDevices, setSelectedDevice, unassignDevice } = useStore();
  const { toast } = useToast();
  const [disconnectDialog, setDisconnectDialog] = useState<{
    isOpen: boolean;
    device: any;
  }>({ isOpen: false, device: null });

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  useEffect(() => {
    if (devices.length > 0 && !selectedDevice) {
      setSelectedDevice(devices[0]);
    }
  }, [devices, selectedDevice, setSelectedDevice]);

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      fetchDevices();
    }
  };

  const handleDisconnectDevice = async () => {
    if (!disconnectDialog.device) return;
    
    try {
      await unassignDevice(disconnectDialog.device.id);
      toast({
        title: "✓ Apparaat Ontkoppeld",
        description: `${disconnectDialog.device.nickname || disconnectDialog.device.phone_number} is succesvol ontkoppeld.`,
      });
      setDisconnectDialog({ isOpen: false, device: null });
      
      // If we disconnected the selected device, clear selection
      if (selectedDevice?.id === disconnectDialog.device.id) {
        setSelectedDevice(null);
      }
    } catch (error) {
      console.error('Failed to disconnect device:', error);
      toast({
        title: "Ontkoppelen Mislukt",
        description: error instanceof Error ? error.message : "Er is een fout opgetreden.",
        variant: "destructive"
      });
    }
  };

  if (!selectedDevice) {
    return (
      <div className="p-4 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">Apparaat Status</h2>
          <p className="text-sm text-gray-600">Koppel uw eerste apparaat</p>
        </div>
        
        <DeviceAssignment />
        
        <Card className="text-center py-8">
          <CardContent>
            <Smartphone size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Geen Apparaten Gekoppeld
            </h3>
            <p className="text-gray-600">
              Gebruik het formulier hierboven om uw eerste apparaat te koppelen.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">Apparaat Status</h2>
          <p className="text-sm text-gray-600">Overzicht van uw monitoring apparaat</p>
        </div>

        <DeviceOverview
          device={selectedDevice}
          onRefresh={handleRefresh}
          onDisconnect={() => setDisconnectDialog({ isOpen: true, device: selectedDevice })}
        />

        <DeviceMetrics device={selectedDevice} />

        <DeviceConnectionDetails device={selectedDevice} />

        <DeviceStatusIndicators />

        {/* Device Selection if multiple devices */}
        {devices.length > 1 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Ander Apparaat Selecteren</h4>
            <div className="grid gap-2">
              {devices.map((device) => (
                <div key={device.id} className="flex items-center justify-between">
                  <Button
                    variant={selectedDevice.id === device.id ? "default" : "outline"}
                    className="flex-1 justify-start mr-2"
                    onClick={() => setSelectedDevice(device)}
                  >
                    {device.nickname || device.phone_number}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDisconnectDialog({ isOpen: true, device })}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <Unlink size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Add another device option */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Nieuw Apparaat Toevoegen</h4>
          <DeviceAssignment />
        </div>
      </div>

      {/* Disconnect Confirmation Dialog */}
      <Dialog open={disconnectDialog.isOpen} onOpenChange={(open) => !open && setDisconnectDialog({ isOpen: false, device: null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Apparaat Ontkoppelen</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              Weet u zeker dat u het apparaat <strong>{disconnectDialog.device?.nickname || disconnectDialog.device?.phone_number}</strong> wilt ontkoppelen?
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                Na het ontkoppelen hebt u geen toegang meer tot dit apparaat en de bijbehorende alarmen.
              </p>
            </div>
          </div>

          <DialogFooter className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setDisconnectDialog({ isOpen: false, device: null })}
            >
              Annuleren
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDisconnectDevice}
            >
              <Unlink size={16} className="mr-2" />
              Ontkoppelen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeviceStatus;
