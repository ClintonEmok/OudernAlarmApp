
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ContactManager from '../components/ContactManager/ContactManager';
import { Button } from '../components/ui/button';

const Contacts = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full bg-blue-50 overflow-y-auto">
      <div className="safe-area-pt">
        <div className="p-4 space-y-6 pb-20">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/settings')}
            >
              <ArrowLeft size={20} />
            </Button>
            <h2 className="text-xl font-bold text-gray-900">Zorgverleners</h2>
          </div>
          <ContactManager />
        </div>
      </div>
    </div>
  );
};

export default Contacts;
