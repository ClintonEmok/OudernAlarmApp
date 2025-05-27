
import React from 'react';
import { Button } from '../ui/button';
import { MapPin } from 'lucide-react';
import NativeFeatureCard from './NativeFeatureCard';

interface LocationControlsProps {
  locationPermission: boolean;
  currentLocation: { latitude: number; longitude: number } | null;
  isTracking: boolean;
  onGetLocation: () => void;
  onToggleTracking: () => void;
}

const LocationControls: React.FC<LocationControlsProps> = ({
  locationPermission,
  currentLocation,
  isTracking,
  onGetLocation,
  onToggleTracking
}) => {
  const getLocationDescription = () => {
    let desc = locationPermission ? 'Toegestaan' : 'Geen toestemming';
    if (currentLocation) {
      desc += ` • ${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}`;
    }
    return desc;
  };

  const actions = (
    <>
      <Button size="sm" variant="outline" onClick={onGetLocation}>
        Locatie
      </Button>
      <Button 
        size="sm" 
        variant={isTracking ? "destructive" : "default"} 
        onClick={onToggleTracking}
      >
        {isTracking ? 'Stop' : 'Track'}
      </Button>
    </>
  );

  return (
    <NativeFeatureCard
      icon={MapPin}
      iconColor="text-green-600"
      title="Locatie Services"
      description={getLocationDescription()}
      actions={actions}
    />
  );
};

export default LocationControls;
