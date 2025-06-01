
import { useState, useEffect, useCallback, useRef } from 'react';
import { useStore } from '../store/useStore';
import { useToast } from '@/hooks/use-toast';
import { logger } from '../utils/logger';

export const useDevicePolling = () => {
  const { fetchDevices, refreshAll } = useStore();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Manual refresh function
  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return; // Prevent multiple simultaneous refreshes
    
    setIsRefreshing(true);
    try {
      logger.debug('Manual device refresh triggered');
      await refreshAll();
      toast({
        title: "✓ Bijgewerkt",
        description: "Apparaten en locaties zijn ververst.",
      });
    } catch (error) {
      logger.error('Failed to refresh devices', error);
      toast({
        title: "Verversen Mislukt",
        description: "Kon apparaten niet verversen.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshAll, toast, isRefreshing]);

  // Set up automatic polling for devices (60 seconds interval)
  useEffect(() => {
    // Clear any existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    // Set up polling interval (60 seconds for devices to reduce server load)
    pollingIntervalRef.current = setInterval(() => {
      logger.debug('Auto-refreshing devices...');
      fetchDevices();
    }, 60000); // 60 seconds

    // Cleanup function
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [fetchDevices]);

  return {
    isRefreshing,
    handleRefresh
  };
};
