
import { useState, useEffect, useCallback, useRef } from 'react';
import { useStore } from '../../../store/useStore';
import { useToast } from '@/hooks/use-toast';
import { logger } from '../../../utils/logger';

export const useAlertLoading = () => {
  const { alerts, fetchAlerts, authorizedDevicePhones, refreshAll } = useStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [securityWarnings, setSecurityWarnings] = useState<string[]>([]);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Memoized load function to prevent recreating on every render
  const loadAlerts = useCallback(async () => {
    setIsLoading(true);
    try {
      logger.security('Loading alerts with security checks');
      await fetchAlerts();
      logger.debug(`Alerts loaded successfully, count: ${alerts.length}`);
      
      // Additional frontend security validation
      const unauthorizedAlerts = alerts.filter(alert => 
        !authorizedDevicePhones.has(alert.device_phone || '')
      );
      
      if (unauthorizedAlerts.length > 0) {
        logger.security(`Found unauthorized alerts in frontend: ${unauthorizedAlerts.length} alerts from unauthorized devices blocked`, unauthorizedAlerts);
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
      logger.error('Failed to fetch alerts', error);
      toast({
        title: "Laden Mislukt",
        description: "Kon alarmen niet laden. Probeer opnieuw.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [fetchAlerts, toast, alerts.length, authorizedDevicePhones]);

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
      logger.debug('Auto-refreshing alerts with security checks...');
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
    logger.debug('Current alerts in component', { alertCount: alerts.length, authorizedDevices: Array.from(authorizedDevicePhones) });
  }, [alerts, authorizedDevicePhones]);

  // Use central refresh function for consistency
  const handleRefresh = useCallback(async () => {
    if (isLoading) return; // Prevent multiple simultaneous refreshes
    
    setIsLoading(true);
    try {
      logger.debug('Manual refresh triggered - using central refresh');
      await refreshAll(); // Use central refresh for both devices and alerts
      toast({
        title: "✓ Ververst",
        description: "Alarmen en apparaten zijn bijgewerkt.",
      });
    } catch (error) {
      logger.error('Failed to refresh', error);
      toast({
        title: "Verversen Mislukt",
        description: "Kon gegevens niet verversen.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [refreshAll, toast, isLoading]);

  return {
    alerts,
    authorizedDevicePhones,
    isLoading,
    securityWarnings,
    handleRefresh
  };
};
