
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

const PrivacyHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center space-x-4">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => navigate('/settings')}
        className="shrink-0"
      >
        <ArrowLeft size={20} />
      </Button>
      <div>
        <h2 className="text-xl font-bold text-gray-900">Privacy Beleid</h2>
        <p className="text-sm text-gray-600">Ouderen Alarmering</p>
      </div>
    </div>
  );
};

export default PrivacyHeader;
