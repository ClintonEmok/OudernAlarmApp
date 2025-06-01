
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ContactManager from '../components/ContactManager/ContactManager';
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';

const Contacts = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full bg-blue-50">
      <div className="safe-area-pt">
        <div className="p-4 pb-2">
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
        </div>
        
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="p-4 pt-2 pb-20">
            <ContactManager />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Contacts;
