
import { useToast } from '@/hooks/use-toast';
import { useStore } from '../../../store/useStore';
import { Alert } from '../../../types';

export const useAlertHandlers = () => {
  const { toast } = useToast();
  const { fetchAlerts, authorizedDevicePhones } = useStore();

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

  const handleViewLocation = (alert: Alert) => {
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

  return {
    handleCallUser,
    handleViewLocation,
    handleMarkAsResolved
  };
};
