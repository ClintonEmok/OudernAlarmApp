
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '../../services/api';
import { useStore } from '../../store/useStore';
import { Smartphone, Plus } from 'lucide-react';

const DeviceAssignment = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nickname, setNickname] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const { fetchDevices } = useStore();
  const { toast } = useToast();

  const handleAssignDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      toast({
        title: "Telefoonnummer vereist",
        description: "Voer het telefoonnummer van het apparaat in.",
        variant: "destructive"
      });
      return;
    }

    setIsAssigning(true);
    
    try {
      await apiService.assignDevice(phoneNumber.trim(), nickname.trim() || undefined);
      
      toast({
        title: "✓ Apparaat Gekoppeld",
        description: "Het apparaat is succesvol aan uw account gekoppeld.",
      });
      
      // Clear form
      setPhoneNumber('');
      setNickname('');
      
      // Refresh devices list
      await fetchDevices();
      
    } catch (error) {
      console.error('Failed to assign device:', error);
      toast({
        title: "Koppeling Mislukt",
        description: error instanceof Error ? error.message : "Er is een fout opgetreden bij het koppelen van het apparaat.",
        variant: "destructive"
      });
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus size={20} className="text-purple-600" />
          <span>Apparaat Koppelen</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAssignDevice} className="space-y-4">
          <div>
            <Label htmlFor="phoneNumber">Telefoonnummer Apparaat *</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="+31612345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Voer het telefoonnummer in zoals vermeld op het apparaat
            </p>
          </div>
          
          <div>
            <Label htmlFor="nickname">Bijnaam (optioneel)</Label>
            <Input
              id="nickname"
              type="text"
              placeholder="Bijvoorbeeld: Oma's Alarm"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isAssigning}
          >
            {isAssigning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Koppelen...
              </>
            ) : (
              <>
                <Smartphone size={16} className="mr-2" />
                Apparaat Koppelen
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DeviceAssignment;
