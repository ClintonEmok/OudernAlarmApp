
import { ArrowLeft, Smartphone, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useToast } from '../hooks/use-toast';

const DevicePairing = () => {
  const { assignDevice } = useStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    phone_number: '',
    nickname: ''
  });

  const handlePairDevice = async () => {
    setIsLoading(true);
    try {
      await assignDevice(formData.phone_number, formData.nickname || undefined);
      toast({
        title: "Apparaat gekoppeld",
        description: "Het apparaat is succesvol gekoppeld aan uw account.",
      });
      navigate('/device');
    } catch (error) {
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het koppelen van het apparaat.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 pb-20">
      <div className="p-4 space-y-6">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/settings')}
          >
            <ArrowLeft size={20} />
          </Button>
          <h2 className="text-xl font-bold text-gray-900">Apparaat Koppelen</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone size={20} className="text-blue-600" />
              <span>Nieuw Apparaat Toevoegen</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="phone_number">Telefoonnummer van het apparaat</Label>
              <Input
                id="phone_number"
                type="tel"
                value={formData.phone_number}
                onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                placeholder="+31612345678"
              />
              <p className="text-sm text-gray-600 mt-1">
                Voer het telefoonnummer in dat gekoppeld is aan het alarm apparaat
              </p>
            </div>
            
            <div>
              <Label htmlFor="nickname">Bijnaam (optioneel)</Label>
              <Input
                id="nickname"
                type="text"
                value={formData.nickname}
                onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
                placeholder="bijv. Hoofdapparaat"
              />
              <p className="text-sm text-gray-600 mt-1">
                Geef het apparaat een herkenbare naam
              </p>
            </div>

            <Button 
              onClick={handlePairDevice} 
              disabled={isLoading || !formData.phone_number}
              className="w-full"
            >
              <Plus size={16} className="mr-2" />
              {isLoading ? 'Koppelen...' : 'Apparaat koppelen'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DevicePairing;
