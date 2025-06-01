
import { useState, useEffect, useCallback } from 'react';
import { GeocodingService, GeocodeResult } from '../services/geocoding-service';
import { Device } from '../types';
import { logger } from '../utils/logger';

interface UseAddressLookupProps {
  device: Device | null;
  mapboxToken: string;
}

export const useAddressLookup = ({ device, mapboxToken }: UseAddressLookupProps) => {
  const [address, setAddress] = useState<GeocodeResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const geocodingService = new GeocodingService(mapboxToken);

  const lookupAddress = useCallback(async (latitude: number, longitude: number) => {
    if (!mapboxToken) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await geocodingService.reverseGeocode(latitude, longitude);
      setAddress(result);
    } catch (err) {
      logger.error('Address lookup failed', err);
      setError('Kon adres niet ophalen');
      setAddress(null);
    } finally {
      setIsLoading(false);
    }
  }, [mapboxToken]);

  useEffect(() => {
    if (device?.location?.latitude && device?.location?.longitude) {
      lookupAddress(device.location.latitude, device.location.longitude);
    } else {
      setAddress(null);
      setError(null);
    }
  }, [device?.location?.latitude, device?.location?.longitude, lookupAddress]);

  return {
    address,
    isLoading,
    error,
    refetch: () => {
      if (device?.location?.latitude && device?.location?.longitude) {
        lookupAddress(device.location.latitude, device.location.longitude);
      }
    }
  };
};
