
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Device } from '../../../types';

interface UseMapInstanceProps {
  mapContainer: React.RefObject<HTMLDivElement>;
  mapboxToken: string;
  device: Device | null;
  mapStyle: string;
}

export const useMapInstance = ({ 
  mapContainer, 
  mapboxToken, 
  device, 
  mapStyle 
}: UseMapInstanceProps) => {
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Set Mapbox access token
    mapboxgl.accessToken = mapboxToken;

    // Use device location if available, otherwise use default Netherlands location
    const defaultLat = 52.3676;
    const defaultLng = 4.9041;
    const lat = device?.location?.latitude || defaultLat;
    const lng = device?.location?.longitude || defaultLng;

    console.log('Map initialized with location:', { lat, lng, device: device?.nickname });

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [lng, lat],
      zoom: 15,
      pitch: 45,
      attributionControl: false,
    });

    // Add navigation controls to bottom-right
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'bottom-right'
    );

    // Add fullscreen control to bottom-right
    map.current.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapContainer, mapboxToken, mapStyle, device]);

  return map.current;
};
