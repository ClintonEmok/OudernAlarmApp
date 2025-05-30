
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Smartphone, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '../../services/api';

const DeviceAccessRequest: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      toast({
        title: "Telefoonnummer vereist",
        description: "Voer een geldig telefoonnummer in.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await apiService.requestDeviceAccess(phoneNumber, message || undefined);
      
      toast({
        title: "✓ Verzoek Verzonden",
        description: "Uw verzoek voor apparaattoegang is verzonden."
      });
      
      // Reset form
      setPhoneNumber('');
      setMessage('');
    } catch (error) {
      console.error('Failed to request device access:', error);
      toast({
        title: "Verzoek Mislukt",
        description: error instanceof Error ? error.message : "Er is een fout opgetreden.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Smartphone className="h-5 w-5 text-blue-600" />
          <span>Apparaattoegang Aanvragen</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Telefoonnummer Apparaat</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+31612345678"
              required
            />
            <p className="text-sm text-gray-600">
              Voer het telefoonnummer in van het apparaat waartoe u toegang wilt.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Bericht (optioneel)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Leg uit waarom u toegang wilt tot dit apparaat..."
              rows={3}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              "Verzenden..."
            ) : (
              <>
                <Send size={16} className="mr-2" />
                Verzoek Verzenden
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DeviceAccessRequest;
