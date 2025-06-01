
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Device } from '../../../types';
import { LocationCoordinates } from '../../../services/geolocation-service';
import { 
  createDeviceMarkerElement, 
  createUserMarkerElement, 
  createDevicePopupContent, 
  createUserPopupContent 
} from '../utils/markerUtils';

interface UseMapMarkersProps {
  map: mapboxgl.Map | null;
  device: Device | null;
  userLocation?: LocationCoordinates | null;
  showUserLocation?: boolean;
}

export const useMapMarkers = ({ 
  map, 
  device, 
  userLocation, 
  showUserLocation = false 
}: UseMapMarkersProps) => {
  const deviceMarker = useRef<mapboxgl.Marker | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);

  // Handle device marker
  useEffect(() => {
    if (!map || !device?.location) {
      if (deviceMarker.current) {
        deviceMarker.current.remove();
        deviceMarker.current = null;
      }
      return;
    }

    // Create or update device marker
    if (!deviceMarker.current) {
      const deviceMarkerElement = createDeviceMarkerElement();
      deviceMarker.current = new mapboxgl.Marker(deviceMarkerElement);

      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: false
      }).setHTML(createDevicePopupContent(device));

      deviceMarker.current.setPopup(popup);
    }

    deviceMarker.current
      .setLngLat([device.location.longitude, device.location.latitude])
      .addTo(map);

    console.log('Device marker updated:', { 
      latitude: device.location.latitude, 
      longitude: device.location.longitude 
    });

  }, [map, device]);

  // Handle user marker
  useEffect(() => {
    if (!map || !userLocation || !showUserLocation) {
      if (userMarker.current) {
        userMarker.current.remove();
        userMarker.current = null;
      }
      return;
    }

    // Create or update user marker
    if (!userMarker.current) {
      const userMarkerElement = createUserMarkerElement();
      userMarker.current = new mapboxgl.Marker(userMarkerElement);

      const userPopup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: false
      }).setHTML(createUserPopupContent(userLocation.accuracy, userLocation.timestamp));

      userMarker.current.setPopup(userPopup);
    }

    userMarker.current
      .setLngLat([userLocation.longitude, userLocation.latitude])
      .addTo(map);

    console.log('User location marker updated:', { 
      latitude: userLocation.latitude, 
      longitude: userLocation.longitude 
    });

  }, [map, userLocation, showUserLocation]);

  // Update device location when it changes
  useEffect(() => {
    if (map && deviceMarker.current && device?.location) {
      const { latitude, longitude } = device.location;
      console.log('Updating device location to:', { latitude, longitude });
      
      // Fly to new location
      map.flyTo({
        center: [longitude, latitude],
        zoom: 15,
        essential: true
      });
      
      // Update marker position
      deviceMarker.current.setLngLat([longitude, latitude]);
    }
  }, [device?.location, map]);

  // Cleanup function
  const cleanup = () => {
    if (deviceMarker.current) {
      deviceMarker.current.remove();
      deviceMarker.current = null;
    }
    if (userMarker.current) {
      userMarker.current.remove();
      userMarker.current = null;
    }
  };

  return { cleanup };
};
