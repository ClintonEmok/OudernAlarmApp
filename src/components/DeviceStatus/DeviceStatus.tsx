import { Battery, Signal, Smartphone, Settings, RefreshCw, Unlink, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import DeviceAssignment from '../DeviceAssignment/DeviceAssignment';

const DeviceStatus = () => {
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

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-green-600 bg-green-100';
    if (level > 20) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getSignalBars = (strength: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <div
        key={i}
        className={`w-1 ${i < strength ? 'bg-blue-600' : 'bg-gray-300'}`}
        style={{ height: `${(i + 1) * 3 + 2}px` }}
      />
    ));
  };

  const handleRefresh = () => {
    fetchDevices();
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

        {/* Device Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone size={24} className="text-purple-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedDevice.nickname || 'Ouderen Alarm Apparaat'}
                  </h3>
                  <p className="text-sm text-gray-600">ID: {selectedDevice.id}</p>
                  <p className="text-xs text-gray-500">{selectedDevice.phone_number}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  <RefreshCw size={16} />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setDisconnectDialog({ isOpen: true, device: selectedDevice })}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Unlink size={16} />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Status Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Battery */}
          <Card>
            <CardContent className="p-4 text-center">
              <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${getBatteryColor(selectedDevice.batteryLevel)}`}>
                <Battery size={24} />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Batterij</h4>
              <p className="text-2xl font-bold text-gray-900">{selectedDevice.batteryLevel}%</p>
              <p className="text-xs text-gray-500 mt-1">
                {selectedDevice.batteryLevel > 20 ? 'Goed' : 'Laag'}
              </p>
            </CardContent>
          </Card>

          {/* Signal */}
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <div className="flex items-end space-x-0.5">
                  {getSignalBars(selectedDevice.signalStrength)}
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Signaal</h4>
              <p className="text-2xl font-bold text-gray-900">{selectedDevice.signalStrength}/5</p>
              <p className="text-xs text-gray-500 mt-1">{selectedDevice.connectionType}</p>
            </CardContent>
          </Card>
        </div>

        {/* Connection Details */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900">Verbinding Details</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Signal size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">Netwerk Type</span>
              </div>
              <span className="font-medium">{selectedDevice.connectionType}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <RefreshCw size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">Laatste Update</span>
              </div>
              <span className="font-medium text-sm">
                {new Date(selectedDevice.lastUpdate).toLocaleTimeString('nl-NL', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Settings size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">Firmware</span>
              </div>
              <span className="font-medium">v{selectedDevice.firmwareVersion}</span>
            </div>
          </CardContent>
        </Card>

        {/* Status Indicators */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center">
            <CardContent className="p-3">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-xs font-medium text-gray-900">GPS</p>
              <p className="text-xs text-gray-500">Actief</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-3">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-xs font-medium text-gray-900">SOS</p>
              <p className="text-xs text-gray-500">Klaar</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-3">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-xs font-medium text-gray-900">Monitor</p>
              <p className="text-xs text-gray-500">Online</p>
            </CardContent>
          </Card>
        </div>

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
