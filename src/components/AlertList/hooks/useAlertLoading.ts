
import { useState, useEffect, useCallback, useRef } from 'react';
import { useStore } from '../../../store/useStore';
import { useToast } from '@/hooks/use-toast';

export const useAlertLoading = () => {
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

  return {
    alerts,
    authorizedDevicePhones,
    isLoading,
    securityWarnings,
    handleRefresh
  };
};
