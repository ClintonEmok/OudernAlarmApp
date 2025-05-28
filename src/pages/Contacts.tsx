
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ContactManager from '../components/ContactManager/ContactManager';
import { Button } from '../components/ui/button';

const Contacts = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-blue-50 pb-20">
      <div className="p-4 pb-0">
        <div className="flex items-center justify-between mb-4">
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
      <ContactManager />
    </div>
  );
};

export default Contacts;
