
import { Link, useLocation } from 'react-router-dom';
import { MapPin, AlertTriangle, Bell, Settings, Smartphone } from 'lucide-react';

const navigationItems = [
  {
    path: '/',
    icon: MapPin,
    label: 'Locatie'
  },
  {
    path: '/alerts',
    icon: AlertTriangle,
    label: 'Meldingen'
  },
  {
    path: '/reminders',
    icon: Bell,
    label: 'Herinneringen'
  },
  {
    path: '/device',
    icon: Smartphone,
    label: 'Apparaat'
  },
  {
    path: '/settings',
    icon: Settings,
    label: 'Instellingen'
  }
];

const BottomNavigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-purple-100 px-2 py-1 safe-area-pb">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-500 hover:text-purple-600'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
