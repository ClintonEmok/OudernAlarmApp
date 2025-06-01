
import { Settings as SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

interface AppInfoCardProps {
  onSupportClick: () => void;
}

const AppInfoCard = ({ onSupportClick }: AppInfoCardProps) => {
  const navigate = useNavigate();

  const handlePrivacyPolicyClick = () => {
    navigate('/settings/privacy');
  };

  return (
    <Card>
      <CardContent className="p-4 text-center">
        <div className="text-blue-600 mb-2">
          <SettingsIcon size={32} className="mx-auto" />
        </div>
        <h4 className="font-semibold text-gray-900 mb-1">Ouderen Alarmering</h4>
        <p className="text-sm text-gray-600 mb-3">Versie 2.1.3</p>
        <div className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={onSupportClick}
          >
            Hulp & Ondersteuning
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={handlePrivacyPolicyClick}
          >
            Privacy Beleid
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppInfoCard;
