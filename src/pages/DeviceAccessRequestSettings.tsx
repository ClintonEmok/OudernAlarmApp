
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import DeviceAccessRequest from '../components/DeviceAccess/DeviceAccessRequest';

const DeviceAccessRequestSettings = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full bg-blue-50 flex flex-col">
      <div className="flex-1 overflow-y-auto pt-safe">
        <div className="p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/settings')}
              className="p-2"
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Apparaattoegang</h2>
              <p className="text-sm text-gray-600">Vraag toegang aan tot een ander apparaat</p>
            </div>
          </div>

          {/* Device Access Request Form */}
          <DeviceAccessRequest />

          {/* Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Hoe werkt het?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Voer het telefoonnummer in van het apparaat</li>
              <li>• De eigenaar ontvangt een verzoek voor toegang</li>
              <li>• Na goedkeuring kunt u het apparaat monitoren</li>
              <li>• U krijgt toegang tot locatie en alarmen</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceAccessRequestSettings;
