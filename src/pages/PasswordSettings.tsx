
import { ArrowLeft, Lock, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useToast } from '../hooks/use-toast';

const PasswordSettings = () => {
  const { updatePassword } = useStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });

  const handleSave = async () => {
    if (formData.new_password !== formData.new_password_confirmation) {
      toast({
        title: "Fout",
        description: "De nieuwe wachtwoorden komen niet overeen.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await updatePassword(formData);
      toast({
        title: "Wachtwoord gewijzigd",
        description: "Uw wachtwoord is succesvol gewijzigd.",
      });
      navigate('/settings');
    } catch (error) {
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het wijzigen van uw wachtwoord.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 pb-20">
      <div className="p-4 space-y-6">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/settings')}
          >
            <ArrowLeft size={20} />
          </Button>
          <h2 className="text-xl font-bold text-gray-900">Wachtwoord Wijzigen</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock size={20} className="text-purple-600" />
              <span>Beveiligingsinstellingen</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="current_password">Huidig wachtwoord</Label>
              <Input
                id="current_password"
                type="password"
                value={formData.current_password}
                onChange={(e) => setFormData(prev => ({ ...prev, current_password: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="new_password">Nieuw wachtwoord</Label>
              <Input
                id="new_password"
                type="password"
                value={formData.new_password}
                onChange={(e) => setFormData(prev => ({ ...prev, new_password: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="new_password_confirmation">Bevestig nieuw wachtwoord</Label>
              <Input
                id="new_password_confirmation"
                type="password"
                value={formData.new_password_confirmation}
                onChange={(e) => setFormData(prev => ({ ...prev, new_password_confirmation: e.target.value }))}
              />
            </div>

            <Button 
              onClick={handleSave} 
              disabled={isLoading || !formData.current_password || !formData.new_password || !formData.new_password_confirmation}
              className="w-full"
            >
              <Save size={16} className="mr-2" />
              {isLoading ? 'Opslaan...' : 'Wachtwoord wijzigen'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PasswordSettings;
