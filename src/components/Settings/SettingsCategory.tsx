
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
  notificationsEnabled?: boolean;
  alarmNotificationsEnabled?: boolean;
  batteryNotificationsEnabled?: boolean;
  locationNotificationsEnabled?: boolean;
  onToggleNotifications?: (value: boolean) => void;
  onToggleAlarmNotifications?: (value: boolean) => void;
  onToggleBatteryNotifications?: (value: boolean) => void;
  onToggleLocationNotifications?: (value: boolean) => void;
  onSettingClick: (settingName: string) => void;
}

const SettingsCategory = ({ 
  title, 
  icon: Icon, 
  items, 
  showUserLocationOnMap,
  onToggleUserLocation,
  notificationsEnabled,
  alarmNotificationsEnabled,
  batteryNotificationsEnabled,
  locationNotificationsEnabled,
  onToggleNotifications,
  onToggleAlarmNotifications,
  onToggleBatteryNotifications,
  onToggleLocationNotifications,
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

          {/* Special handling for Notificaties category */}
          {title === 'Notificaties' && (
            <>
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Push Notificaties</h4>
                    <p className="text-sm text-gray-600">Ontvang notificaties van de app</p>
                  </div>
                  <Switch
                    checked={notificationsEnabled || false}
                    onCheckedChange={onToggleNotifications}
                  />
                </div>
              </div>
              
              {notificationsEnabled && (
                <>
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Alarm Meldingen</h4>
                        <p className="text-sm text-gray-600">Notificaties bij noodoproepen en vallen</p>
                      </div>
                      <Switch
                        checked={alarmNotificationsEnabled || false}
                        onCheckedChange={onToggleAlarmNotifications}
                      />
                    </div>
                  </div>

                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Batterij Waarschuwingen</h4>
                        <p className="text-sm text-gray-600">Meldingen bij lage batterij</p>
                      </div>
                      <Switch
                        checked={batteryNotificationsEnabled || false}
                        onCheckedChange={onToggleBatteryNotifications}
                      />
                    </div>
                  </div>

                  <div className="p-4 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Locatie Updates</h4>
                        <p className="text-sm text-gray-600">Meldingen bij locatie wijzigingen</p>
                      </div>
                      <Switch
                        checked={locationNotificationsEnabled || false}
                        onCheckedChange={onToggleLocationNotifications}
                      />
                    </div>
                  </div>
                </>
              )}
            </>
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
