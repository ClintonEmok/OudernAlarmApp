
import { Link, useLocation } from 'react-router-dom';
import { MapPin, AlertTriangle, Settings, Smartphone } from 'lucide-react';
import { useEffect } from 'react';

const navigationItems = [
  {
    path: '/dashboard',
    icon: MapPin,
    label: 'Locatie'
  },
  {
    path: '/alerts',
    icon: AlertTriangle,
    label: 'Meldingen'
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
  
  useEffect(() => {
    // Add React Router link identifier for PWA navigation service
    const links = document.querySelectorAll('nav a[href^="/"]');
    links.forEach(link => {
      link.setAttribute('data-react-router-link', 'true');
    });
  }, [location]);
  
  // Don't show navigation on login/register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <nav className="bg-white border-t border-blue-100 iphone-navbar">
      <div className="flex justify-around items-center px-2 h-16">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              data-react-router-link="true"
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors touch-manipulation h-12 min-w-0 ${
                isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-blue-600'
              }`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <Icon size={18} className="flex-shrink-0" />
              <span className="text-xs mt-0.5 font-medium leading-tight truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
