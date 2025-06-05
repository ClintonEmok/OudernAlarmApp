
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Bell, Check, X, AlertCircle } from 'lucide-react';
import NativeFeatureCard from './NativeFeatureCard';
import { useToast } from '../ui/use-toast';

interface NotificationControlsProps {
  isNative: boolean;
  hasPermission: boolean;
  onSendTestNotification: () => Promise<void>;
  onRequestPermission: () => Promise<void>;
}

const NotificationControls: React.FC<NotificationControlsProps> = ({
  isNative,
  hasPermission,
  onSendTestNotification,
  onRequestPermission
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTestNotification = async () => {
    try {
      setIsLoading(true);
      await onSendTestNotification();
      toast({
        title: "Test notificatie verzonden",
        description: "Controleer je notificaties",
      });
    } catch (error) {
      console.error('Failed to send test notification:', error);
      toast({
        title: "Fout bij versturen notificatie",
        description: "Probeer het opnieuw",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestPermission = async () => {
    try {
      setIsLoading(true);
      await onRequestPermission();
      toast({
        title: "Permissies bijgewerkt",
        description: "Notificatie instellingen zijn gecontroleerd",
      });
    } catch (error) {
      console.error('Failed to request permission:', error);
      toast({
        title: "Fout bij permissie aanvraag",
        description: "Probeer het opnieuw",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDescription = () => {
    if (!hasPermission) {
      return 'Permissie vereist';
    }
    return isNative ? 'Lokale notificaties actief' : 'Web notificaties actief';
  };

  const getIconColor = () => {
    if (!hasPermission) return 'text-red-600';
    return 'text-green-600';
  };

  const getStatusIcon = () => {
    if (!hasPermission) return <X size={16} className="text-red-600" />;
    return <Check size={16} className="text-green-600" />;
  };

  const actions = (
    <div className="flex gap-2">
      {!hasPermission && (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleRequestPermission}
          disabled={isLoading}
        >
          <AlertCircle size={14} className="mr-1" />
          Toestaan
        </Button>
      )}
      {hasPermission && (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleTestNotification}
          disabled={isLoading}
        >
          {isLoading ? 'Bezig...' : 'Test'}
        </Button>
      )}
    </div>
  );

  return (
    <NativeFeatureCard
      icon={Bell}
      iconColor={getIconColor()}
      title="Lokale Notificaties"
      description={getDescription()}
      actions={actions}
      statusIndicator={getStatusIcon()}
    />
  );
};

export default NotificationControls;
