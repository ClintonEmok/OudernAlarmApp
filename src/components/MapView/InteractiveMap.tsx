
import React, { useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Device } from '../../types';
import { LocationCoordinates } from '../../services/geolocation-service';
import { useMapInstance } from './hooks/useMapInstance';
import { useMapMarkers } from './hooks/useMapMarkers';
import MapStyleSelector from './components/MapStyleSelector';

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
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/streets-v12');

  // Initialize map instance
  const map = useMapInstance({
    mapContainer,
    mapboxToken,
    device,
    mapStyle
  });

  // Handle markers
  const { cleanup } = useMapMarkers({
    map,
    device,
    userLocation,
    showUserLocation
  });

  // Cleanup on unmount
  React.useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return (
    <div className="relative w-full h-full">
      {/* Map container */}
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Map style selector */}
      <MapStyleSelector 
        mapStyle={mapStyle} 
        onStyleChange={setMapStyle} 
      />
    </div>
  );
};

export default InteractiveMap;
