
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertTriangle, Users, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '../../services/api';

interface DeviceConflictDialogProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
  errorDetails?: {
    deviceOwner?: string;
    deviceId?: number;
    suggestions?: string[];
  };
}

const DeviceConflictDialog: React.FC<DeviceConflictDialogProps> = ({
  isOpen,
  onClose,
  phoneNumber,
  errorDetails
}) => {
  const [requestMessage, setRequestMessage] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const { toast } = useToast();

  const handleRequestAccess = async () => {
    setIsRequesting(true);
    try {
      await apiService.requestDeviceAccess(phoneNumber, requestMessage);
      toast({
        title: "✓ Toegang Aangevraagd",
        description: "Uw verzoek is verzonden naar de eigenaar van het apparaat.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Verzoek Mislukt",
        description: error instanceof Error ? error.message : "Er is een fout opgetreden.",
        variant: "destructive"
      });
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span>Apparaat Al Gekoppeld</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Het apparaat met nummer <strong>{phoneNumber}</strong> is al gekoppeld aan een ander account.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Wat kunt u doen:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {errorDetails?.suggestions?.map((suggestion, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <Label>Toegang aanvragen via bericht (optioneel)</Label>
            <Textarea
              placeholder="Korte uitleg waarom u toegang nodig heeft tot dit apparaat..."
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={onClose}>
            Sluiten
          </Button>
          <Button onClick={handleRequestAccess} disabled={isRequesting}>
            {isRequesting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Verzenden...
              </>
            ) : (
              <>
                <Mail size={16} className="mr-2" />
                Toegang Aanvragen
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeviceConflictDialog;
