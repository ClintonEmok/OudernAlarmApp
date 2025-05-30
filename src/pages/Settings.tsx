
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { apiService } from '../services/api';
import { settingsCategories } from '../components/Settings/SettingsData';
import UserInfoCard from '../components/Settings/UserInfoCard';
import SettingsCategory from '../components/Settings/SettingsCategory';
import LogoutCard from '../components/Settings/LogoutCard';
import AppInfoCard from '../components/Settings/AppInfoCard';
import { useSettingsNavigation } from '../hooks/useSettingsNavigation';
import { useToast } from '../components/ui/use-toast';

const Settings = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const { handleSettingClick } = useSettingsNavigation();
  const { toast } = useToast();
  
  const [showUserLocationOnMap, setShowUserLocationOnMap] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [alarmNotificationsEnabled, setAlarmNotificationsEnabled] = useState(true);
  const [batteryNotificationsEnabled, setBatteryNotificationsEnabled] = useState(true);
  const [locationNotificationsEnabled, setLocationNotificationsEnabled] = useState(false);

  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      logout();
      navigate('/login');
    }
  };

  const handleSupportClick = () => {
    handleSettingClick('Hulp & Ondersteuning');
  };

  const handleToggleNotifications = (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    if (!enabled) {
      // If notifications are disabled, disable all sub-notifications
      setAlarmNotificationsEnabled(false);
      setBatteryNotificationsEnabled(false);
      setLocationNotificationsEnabled(false);
    }
    
    toast({
      title: enabled ? "Notificaties ingeschakeld" : "Notificaties uitgeschakeld",
      description: enabled ? "Je ontvangt nu push notificaties" : "Je ontvangt geen push notificaties meer",
    });
  };

  const handleToggleAlarmNotifications = (enabled: boolean) => {
    setAlarmNotificationsEnabled(enabled);
    toast({
      title: enabled ? "Alarm meldingen ingeschakeld" : "Alarm meldingen uitgeschakeld",
      description: enabled ? "Je wordt gewaarschuwd bij noodoproepen" : "Je ontvangt geen alarm meldingen meer",
    });
  };

  const handleToggleBatteryNotifications = (enabled: boolean) => {
    setBatteryNotificationsEnabled(enabled);
    toast({
      title: enabled ? "Batterij waarschuwingen ingeschakeld" : "Batterij waarschuwingen uitgeschakeld",
      description: enabled ? "Je wordt gewaarschuwd bij lage batterij" : "Je ontvangt geen batterij waarschuwingen meer",
    });
  };

  const handleToggleLocationNotifications = (enabled: boolean) => {
    setLocationNotificationsEnabled(enabled);
    toast({
      title: enabled ? "Locatie updates ingeschakeld" : "Locatie updates uitgeschakeld",
      description: enabled ? "Je wordt op de hoogte gehouden van locatie wijzigingen" : "Je ontvangt geen locatie updates meer",
    });
  };

  return (
    <div className="h-full bg-blue-50 overflow-y-auto">
      <div className="safe-area-pt">
        <div className="p-4 space-y-6 pb-20">
          <div className="text-center pt-4">
            <h2 className="text-xl font-bold text-gray-900">Instellingen</h2>
            <p className="text-sm text-gray-600">Beheer uw account en apparaten</p>
          </div>

          {/* User Info */}
          {user && <UserInfoCard user={user} />}

          {/* Settings Categories */}
          {settingsCategories.map((category, index) => (
            <SettingsCategory
              key={index}
              title={category.title}
              icon={category.icon}
              items={category.items}
              showUserLocationOnMap={showUserLocationOnMap}
              onToggleUserLocation={setShowUserLocationOnMap}
              notificationsEnabled={notificationsEnabled}
              alarmNotificationsEnabled={alarmNotificationsEnabled}
              batteryNotificationsEnabled={batteryNotificationsEnabled}
              locationNotificationsEnabled={locationNotificationsEnabled}
              onToggleNotifications={handleToggleNotifications}
              onToggleAlarmNotifications={handleToggleAlarmNotifications}
              onToggleBatteryNotifications={handleToggleBatteryNotifications}
              onToggleLocationNotifications={handleToggleLocationNotifications}
              onSettingClick={handleSettingClick}
            />
          ))}

          {/* Logout */}
          <LogoutCard onLogout={handleLogout} />

          {/* App Info */}
          <AppInfoCard onSupportClick={handleSupportClick} />
        </div>
      </div>
    </div>
  );
};

export default Settings;
