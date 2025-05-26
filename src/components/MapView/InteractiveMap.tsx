
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Device } from '../../types';

interface InteractiveMapProps {
  device: Device | null;
  mapboxToken: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ device, mapboxToken }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
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

    // Add scale control
    map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

    // Create custom marker element
    const markerElement = document.createElement('div');
    markerElement.className = 'custom-marker';
    markerElement.style.cssText = `
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
    
    // Add icon to marker
    markerElement.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `;

    // Add marker to map
    marker.current = new mapboxgl.Marker(markerElement)
      .setLngLat([lng, lat])
      .addTo(map.current);

    // Add popup to marker
    if (device) {
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

      marker.current.setPopup(popup);
    }

    // Cleanup
    return () => {
      if (marker.current) {
        marker.current.remove();
      }
      if (map.current) {
        map.current.remove();
      }
    };
  }, [device, mapboxToken, mapStyle]);

  // Update map center and marker when device location changes
  useEffect(() => {
    if (map.current && marker.current && device?.location) {
      const { latitude, longitude } = device.location;
      console.log('Updating map location to:', { latitude, longitude });
      
      // Fly to new location
      map.current.flyTo({
        center: [longitude, latitude],
        zoom: 15,
        essential: true
      });
      
      // Update marker position
      marker.current.setLngLat([longitude, latitude]);
    }
  }, [device?.location]);

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

      {/* Clean device info overlay - only show when device is available */}
      {device && device.location && (
        <div className="absolute bottom-4 left-4 right-4 z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Huidige Locatie</p>
                <p className="font-semibold text-gray-900 text-lg">{device.nickname || 'Ouderen Alarm'}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {device.location.latitude.toFixed(6)}, {device.location.longitude.toFixed(6)}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${device.batteryLevel > 20 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm font-semibold">{device.batteryLevel}%</span>
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(device.lastUpdate).toLocaleTimeString('nl-NL', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
