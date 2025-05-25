import { Settings as SettingsIcon, MapPin, Key, Shield, Bell, Users, Smartphone } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

const Settings = () => {
  const settingsCategories = [
    {
      title: 'Locatie & Veiligheid',
      icon: <MapPin size={20} className="text-purple-600" />,
      items: [
        { name: 'Geofence Instellingen', description: 'Veilige zones beheren' },
        { name: 'GPS Frequentie', description: 'Locatie update interval' },
        { name: 'Bewegingsdetectie', description: 'Val- en bewegingssensoren' }
      ]
    },
    {
      title: 'Toegang & Beveiliging',
      icon: <Key size={20} className="text-purple-600" />,
      items: [
        { name: 'Sleutelkluis Code', description: 'Toegangscode beheren' },
        { name: 'Noodcontacten', description: 'Prioriteit en contactgegevens' },
        { name: 'Privacy Instellingen', description: 'Gegevens en toestemmingen' }
      ]
    },
    {
      title: 'Meldingen',
      icon: <Bell size={20} className="text-purple-600" />,
      items: [
        { name: 'Alarm Instellingen', description: 'SOS en automatische alarmen' },
        { name: 'Herinnering Tonen', description: 'Medicatie en afspraken' },
        { name: 'Stilte Periodes', description: 'Rusturen configureren' }
      ]
    },
    {
      title: 'Apparaat',
      icon: <Smartphone size={20} className="text-purple-600" />,
      items: [
        { name: 'Firmware Update', description: 'Systeem bijwerken' },
        { name: 'Batterij Optimalisatie', description: 'Energiebeheer' },
        { name: 'Diagnostiek', description: 'Systeemstatus controleren' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-purple-50 pb-20">
      <div className="p-4 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">Instellingen</h2>
          <p className="text-sm text-gray-600">Beheer uw alarm- en zorgsysteem</p>
        </div>

        {/* Quick Access */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Snelle Toegang</h3>
          <div className="grid grid-cols-2 gap-3">
            <Card className="cursor-pointer hover:bg-purple-50 transition-colors">
              <CardContent className="p-4 text-center">
                <Key size={24} className="mx-auto text-purple-600 mb-2" />
                <p className="font-medium text-gray-900">Sleutelkluis</p>
                <p className="text-xs text-gray-600">Code: ****</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:bg-purple-50 transition-colors">
              <CardContent className="p-4 text-center">
                <Shield size={24} className="mx-auto text-green-600 mb-2" />
                <p className="font-medium text-gray-900">Geofence</p>
                <p className="text-xs text-gray-600">1 zone actief</p>
              </CardContent>
            </Card>
          </div>
        </div>

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
