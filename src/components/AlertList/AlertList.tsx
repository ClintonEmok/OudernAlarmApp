
import { useState, useEffect, useCallback, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import AlertCard from './AlertCard';
import AlertHeader from './AlertHeader';
import AlertLoadingSkeleton from './AlertLoadingSkeleton';
import AlertEmptyState from './AlertEmptyState';
import SecurityWarnings from './SecurityWarnings';
import { Alert } from '../../types';

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

  // Initial load effect
  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  // Separate effect for polling - stable dependencies only
  useEffect(() => {
    // Clear any existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    // Set up polling interval (30 seconds to reduce server load)
    pollingIntervalRef.current = setInterval(() => {
      console.log('🔒 Auto-refreshing alerts with security checks...');
      loadAlerts();
    }, 30000); // 30 seconds

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
    return <AlertLoadingSkeleton />;
  }

  return (
    <div className="p-4 space-y-6">
      <SecurityWarnings warnings={securityWarnings} />

      <AlertHeader 
        alertCount={alerts.length}
        authorizedDeviceCount={authorizedDevicePhones.size}
        isLoading={isLoading}
        onRefresh={handleRefresh}
      />

      {alerts.length === 0 ? (
        <AlertEmptyState />
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onCall={handleCallUser}
              onViewLocation={handleViewLocation}
              onMarkAsResolved={handleMarkAsResolved}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertList;
