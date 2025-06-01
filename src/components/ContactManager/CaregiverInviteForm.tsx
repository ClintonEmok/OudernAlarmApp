
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '../../hooks/use-toast';

interface CaregiverInviteFormProps {
  onInviteCaregiver: (email: string) => Promise<void>;
}

const CaregiverInviteForm: React.FC<CaregiverInviteFormProps> = ({ onInviteCaregiver }) => {
  const { toast } = useToast();
  const [newCaregiverEmail, setNewCaregiverEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaregiverEmail.trim()) return;

    setIsLoading(true);
    try {
      await onInviteCaregiver(newCaregiverEmail);
      setNewCaregiverEmail('');
      toast({
        title: "Uitnodiging verzonden",
        description: `Een uitnodiging is verzonden naar ${newCaregiverEmail}`,
      });
    } catch (error) {
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het verzenden van de uitnodiging.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <Plus size={20} className="text-blue-600" />
          <span>Zorgverlener Uitnodigen</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">E-mailadres</Label>
            <Input
              id="email"
              type="email"
              placeholder="zorgverlener@voorbeeld.nl"
              value={newCaregiverEmail}
              onChange={(e) => setNewCaregiverEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Uitnodiging versturen...' : 'Uitnodiging versturen'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CaregiverInviteForm;
