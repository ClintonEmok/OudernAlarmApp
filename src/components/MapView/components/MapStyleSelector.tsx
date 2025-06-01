
import React from 'react';

interface MapStyleSelectorProps {
  mapStyle: string;
  onStyleChange: (style: string) => void;
}

const MapStyleSelector: React.FC<MapStyleSelectorProps> = ({ mapStyle, onStyleChange }) => {
  const mapStyles = [
    { name: 'Straten', value: 'mapbox://styles/mapbox/streets-v12' },
    { name: 'Satelliet', value: 'mapbox://styles/mapbox/satellite-streets-v12' },
    { name: 'Licht', value: 'mapbox://styles/mapbox/light-v11' },
    { name: 'Donker', value: 'mapbox://styles/mapbox/dark-v11' }
  ];

  return (
    <div className="absolute bottom-4 left-4 z-10">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200/50 p-2">
        <select 
          value={mapStyle} 
          onChange={(e) => onStyleChange(e.target.value)}
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
  );
};

export default MapStyleSelector;
