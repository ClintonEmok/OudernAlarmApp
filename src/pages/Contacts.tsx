
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ContactManager from '../components/ContactManager/ContactManager';
import { Button } from '../components/ui/button';

const Contacts = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col bg-blue-50">
      <div className="flex-shrink-0 p-4 pb-2">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/settings')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>Terug</span>
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <ContactManager />
      </div>
    </div>
  );
};

export default Contacts;
