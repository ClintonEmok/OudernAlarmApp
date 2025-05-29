
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Bell, Clock, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService, NotificationPreferences } from '../../services/api';

const NotificationSettings: React.FC = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    battery_alerts: true,
    alarm_notifications: true,
    location_updates: false,
    quiet_hours_start: '22:00',
    quiet_hours_end: '08:00'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getNotificationPreferences();
      setPreferences(data);
    } catch (error) {
      console.error('Failed to load notification preferences:', error);
      // Use defaults if API fails
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async () => {
    try {
      setIsSaving(true);
      await apiService.updateNotificationPreferences(preferences);
      toast({
        title: "✓ Instellingen Opgeslagen",
        description: "Uw notificatie voorkeuren zijn bijgewerkt."
      });
    } catch (error) {
      console.error('Failed to save preferences:', error);
      toast({
        title: "Opslaan Mislukt",
        description: "Kon instellingen niet opslaan. Probeer het opnieuw.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updatePreference = (key: keyof NotificationPreferences, value: boolean | string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="text-gray-500">Instellingen laden...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-blue-600" />
          <span>Notificatie Instellingen</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Notification Types */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Notificatie Types</h4>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Batterij Waarschuwingen</Label>
              <p className="text-sm text-gray-500">
                Ontvang meldingen bij lage batterij
              </p>
            </div>
            <Switch
              checked={preferences.battery_alerts}
              onCheckedChange={(checked) => updatePreference('battery_alerts', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Alarm Meldingen</Label>
              <p className="text-sm text-gray-500">
                Ontvang direct meldingen bij alarmen
              </p>
            </div>
            <Switch
              checked={preferences.alarm_notifications}
              onCheckedChange={(checked) => updatePreference('alarm_notifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Locatie Updates</Label>
              <p className="text-sm text-gray-500">
                Meldingen bij significante beweging
              </p>
            </div>
            <Switch
              checked={preferences.location_updates}
              onCheckedChange={(checked) => updatePreference('location_updates', checked)}
            />
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Stille Uren</span>
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Vanaf</Label>
              <Input
                type="time"
                value={preferences.quiet_hours_start || '22:00'}
                onChange={(e) => updatePreference('quiet_hours_start', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Tot</Label>
              <Input
                type="time"
                value={preferences.quiet_hours_end || '08:00'}
                onChange={(e) => updatePreference('quiet_hours_end', e.target.value)}
              />
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Tijdens stille uren worden alleen kritieke alarmen doorgestuurd
          </p>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t">
          <Button 
            onClick={savePreferences}
            disabled={isSaving}
            className="w-full"
          >
            {isSaving ? 'Opslaan...' : 'Instellingen Opslaan'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
