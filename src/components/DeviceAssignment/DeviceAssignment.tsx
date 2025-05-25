
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '@/hooks/use-toast';
import { useStore } from '../../store/useStore';
import { Smartphone, Plus, TestTube } from 'lucide-react';

const DeviceAssignment = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nickname, setNickname] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const { assignDevice } = useStore();
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
      await assignDevice(phoneNumber.trim(), nickname.trim() || undefined);
      
      toast({
        title: "✓ Apparaat Gekoppeld",
        description: "Het apparaat is succesvol aan uw account gekoppeld.",
      });
      
      // Clear form
      setPhoneNumber('');
      setNickname('');
      
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

  const handleAddTestDevice = async () => {
    setIsAssigning(true);
    try {
      await assignDevice('+3197052655266', 'Test-Alarm');
      
      toast({
        title: "✓ Test Apparaat Gekoppeld",
        description: "Het test apparaat is succesvol gekoppeld.",
      });
      
    } catch (error) {
      console.error('Failed to assign test device:', error);
      toast({
        title: "Koppeling Test Apparaat Mislukt",
        description: error instanceof Error ? error.message : "Er is een fout opgetreden bij het koppelen van het test apparaat.",
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
      <CardContent className="space-y-4">
        {/* Quick Test Device Button */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Test Apparaat</h4>
              <p className="text-sm text-blue-700">Koppel snel het test apparaat voor demo doeleinden</p>
            </div>
            <Button 
              variant="outline"
              size="sm"
              onClick={handleAddTestDevice}
              disabled={isAssigning}
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              <TestTube size={16} className="mr-2" />
              Test Koppelen
            </Button>
          </div>
        </div>

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
