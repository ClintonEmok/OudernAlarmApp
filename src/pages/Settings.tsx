
import { Settings as SettingsIcon, User, Smartphone, Users } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useStore } from '../store/useStore';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const Settings = () => {
  useAuth();
  const { user, logout } = useStore();
  const navigate = useNavigate();

  const settingsCategories = [
    {
      title: 'Account & Profiel',
      icon: <User size={20} className="text-purple-600" />,
      items: [
        { name: 'Persoonlijke Gegevens', description: 'Naam, email en telefoonnummer' },
        { name: 'Wachtwoord Wijzigen', description: 'Account beveiliging' },
        { name: 'Account Verwijderen', description: 'Permanente verwijdering' }
      ]
    },
    {
      title: 'Zorgverlening',
      icon: <Users size={20} className="text-purple-600" />,
      items: [
        { name: 'Zorgverleners Beheren', description: 'Uitnodigen en prioriteiten' },
        { name: 'Patiënten Overzicht', description: 'Mensen die u verzorgt' },
        { name: 'Uitnodigingen', description: 'Pending invites beheren' }
      ]
    },
    {
      title: 'Apparaten',
      icon: <Smartphone size={20} className="text-purple-600" />,
      items: [
        { name: 'Mijn Apparaten', description: 'Gekoppelde alarm apparaten' },
        { name: 'Apparaat Koppelen', description: 'Nieuw apparaat toevoegen' },
        { name: 'Apparaat Ontkoppelen', description: 'Apparaat verwijderen' }
      ]
    }
  ];

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

  return (
    <div className="min-h-screen bg-purple-50 pb-20">
      <div className="p-4 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">Instellingen</h2>
          <p className="text-sm text-gray-600">Beheer uw account en apparaten</p>
        </div>

        {/* User Info */}
        {user && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <User size={24} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  {user.phone_number && (
                    <p className="text-xs text-gray-500">{user.phone_number}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Settings Categories */}
        {settingsCategories.map((category, index) => (
          <div key={index}>
            <div className="flex items-center space-x-2 mb-3">
              {category.icon}
              <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
            </div>
            
            <Card>
              <CardContent className="p-0">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="p-4 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors"
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
        ))}

        {/* Logout */}
        <Card>
          <CardContent className="p-4">
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={handleLogout}
            >
              Uitloggen
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-purple-600 mb-2">
              <SettingsIcon size={32} className="mx-auto" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Ouderen Alarmering</h4>
            <p className="text-sm text-gray-600 mb-3">Versie 2.1.3</p>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full">
                Hulp & Ondersteuning
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Privacy Beleid
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
