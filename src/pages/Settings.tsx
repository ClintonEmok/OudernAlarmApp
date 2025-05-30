
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

const Settings = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const { handleSettingClick } = useSettingsNavigation();
  const [showUserLocationOnMap, setShowUserLocationOnMap] = useState(false);

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
