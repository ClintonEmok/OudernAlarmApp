
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Device } from '../../types';
import { LocationCoordinates } from '../../services/geolocation-service';

interface InteractiveMapProps {
  device: Device | null;
  mapboxToken: string;
  userLocation?: LocationCoordinates | null;
  showUserLocation?: boolean;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  device, 
  mapboxToken, 
  userLocation, 
  showUserLocation = false 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const deviceMarker = useRef<mapboxgl.Marker | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/streets-v12');

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

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    // Create device marker if device exists
    if (device?.location) {
      const deviceMarkerElement = document.createElement('div');
      deviceMarkerElement.className = 'device-marker';
      deviceMarkerElement.style.cssText = `
        width: 32px;
        height: 32px;
        background-color: #43A3FA;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      
      deviceMarkerElement.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      `;

      deviceMarker.current = new mapboxgl.Marker(deviceMarkerElement)
        .setLngLat([device.location.longitude, device.location.latitude])
        .addTo(map.current);

      // Add popup to device marker
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: false
      }).setHTML(`
        <div class="p-2">
          <h3 class="font-semibold text-gray-900">${device.nickname || 'Ouderen Alarm'}</h3>
          <p class="text-sm text-gray-600">Batterij: ${device.batteryLevel}%</p>
          <p class="text-sm text-gray-600">Signaal: ${device.signalStrength}/5</p>
          <p class="text-xs text-gray-500">
            Laatste update: ${new Date(device.lastUpdate).toLocaleTimeString('nl-NL', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
      `);

      deviceMarker.current.setPopup(popup);
    }

    // Cleanup
    return () => {
      if (deviceMarker.current) {
        deviceMarker.current.remove();
      }
      if (userMarker.current) {
        userMarker.current.remove();
      }
      if (map.current) {
        map.current.remove();
      }
    };
  }, [device, mapboxToken, mapStyle]);

  // Update device marker when device location changes
  useEffect(() => {
    if (map.current && deviceMarker.current && device?.location) {
      const { latitude, longitude } = device.location;
      console.log('Updating device location to:', { latitude, longitude });
      
      // Fly to new location
      map.current.flyTo({
        center: [longitude, latitude],
        zoom: 15,
        essential: true
      });
      
      // Update marker position
      deviceMarker.current.setLngLat([longitude, latitude]);
    }
  }, [device?.location]);

  // Handle user location marker
  useEffect(() => {
    if (!map.current || !userLocation || !showUserLocation) {
      if (userMarker.current) {
        userMarker.current.remove();
        userMarker.current = null;
      }
      return;
    }

    // Create user marker if it doesn't exist
    if (!userMarker.current) {
      const userMarkerElement = document.createElement('div');
      userMarkerElement.className = 'user-marker';
      userMarkerElement.style.cssText = `
        width: 28px;
        height: 28px;
        background-color: #10B981;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      
      userMarkerElement.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 3.5C14.5 3.5 14 3.9 14 4.4V6H10V4.4C10 3.9 9.5 3.5 9 3.5L3 7V9H1V11H3V17C3 18.1 3.9 19 5 19H9V12H11V19H15C16.1 19 17 18.1 17 17V11H19V9H21Z"/>
        </svg>
      `;

      userMarker.current = new mapboxgl.Marker(userMarkerElement);

      // Add popup to user marker
      const userPopup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: false
      }).setHTML(`
        <div class="p-2">
          <h3 class="font-semibold text-gray-900">Jouw locatie</h3>
          <p class="text-sm text-gray-600">Nauwkeurigheid: ${userLocation.accuracy ? Math.round(userLocation.accuracy) + 'm' : 'Onbekend'}</p>
          <p class="text-xs text-gray-500">
            Bijgewerkt: ${new Date(userLocation.timestamp).toLocaleTimeString('nl-NL', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
      `);

      userMarker.current.setPopup(userPopup);
    }

    // Update user marker position
    userMarker.current
      .setLngLat([userLocation.longitude, userLocation.latitude])
      .addTo(map.current);

    console.log('User location marker updated:', { 
      latitude: userLocation.latitude, 
      longitude: userLocation.longitude 
    });

  }, [userLocation, showUserLocation]);

  const mapStyles = [
    { name: 'Straten', value: 'mapbox://styles/mapbox/streets-v12' },
    { name: 'Satelliet', value: 'mapbox://styles/mapbox/satellite-streets-v12' },
    { name: 'Licht', value: 'mapbox://styles/mapbox/light-v11' },
    { name: 'Donker', value: 'mapbox://styles/mapbox/dark-v11' }
  ];

  return (
    <div className="relative w-full h-full">
      {/* Map container */}
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Clean map style selector */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200/50 p-2">
          <select 
            value={mapStyle} 
            onChange={(e) => setMapStyle(e.target.value)}
            className="text-sm border-none outline-none bg-transparent font-medium"
          >
            {mapStyles.map((style) => (
              <option key={style.value} value={style.value}>
                {style.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
