
import { ArrowLeft, User, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useToast } from '../hooks/use-toast';

const ProfileSettings = () => {
  const { user, updateUser } = useStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone_number: user?.phone_number || ''
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateUser(formData);
      toast({
        title: "Profiel bijgewerkt",
        description: "Uw gegevens zijn succesvol opgeslagen.",
      });
      navigate('/settings');
    } catch (error) {
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het opslaan van uw gegevens.",
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
          <h2 className="text-xl font-bold text-gray-900">Persoonlijke Gegevens</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User size={20} className="text-blue-600" />
              <span>Profiel Informatie</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Naam</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="email">E-mailadres</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Telefoonnummer</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone_number}
                onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                placeholder="Optioneel"
              />
            </div>

            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="w-full"
            >
              <Save size={16} className="mr-2" />
              {isLoading ? 'Opslaan...' : 'Opslaan'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSettings;
