
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Switch } from '../ui/switch';

interface SettingItem {
  name: string;
  description: string;
}

interface SettingsCategoryProps {
  title: string;
  icon: LucideIcon;
  items: SettingItem[];
  showUserLocationOnMap?: boolean;
  onToggleUserLocation?: (value: boolean) => void;
  onSettingClick: (settingName: string) => void;
}

const SettingsCategory = ({ 
  title, 
  icon: Icon, 
  items, 
  showUserLocationOnMap,
  onToggleUserLocation,
  onSettingClick 
}: SettingsCategoryProps) => {
  return (
    <div>
      <div className="flex items-center space-x-2 mb-3">
        <Icon size={20} className="text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      
      <Card>
        <CardContent className="p-0">
          {/* Special handling for Kaart & Locatie category */}
          {title === 'Kaart & Locatie' && (
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Toon mijn locatie op kaart</h4>
                  <p className="text-sm text-gray-600">Laat jouw huidige positie zien op de kaart</p>
                </div>
                <Switch
                  checked={showUserLocationOnMap || false}
                  onCheckedChange={onToggleUserLocation}
                />
              </div>
            </div>
          )}
          
          {items.map((item, itemIndex) => (
            <div
              key={itemIndex}
              className="p-4 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors active:bg-gray-100"
              onClick={() => onSettingClick(item.name)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <span className="text-gray-400">›</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsCategory;
