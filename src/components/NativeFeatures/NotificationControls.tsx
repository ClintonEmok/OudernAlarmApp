
import React from 'react';
import { Button } from '../ui/button';
import { Bell } from 'lucide-react';
import NativeFeatureCard from './NativeFeatureCard';

interface NotificationControlsProps {
  isNative: boolean;
  onSendTestNotification: () => void;
}

const NotificationControls: React.FC<NotificationControlsProps> = ({
  isNative,
  onSendTestNotification
}) => {
  const description = isNative ? 'Native push ready' : 'Web notificaties';

  const actions = (
    <Button size="sm" variant="outline" onClick={onSendTestNotification}>
      Test
    </Button>
  );

  return (
    <NativeFeatureCard
      icon={Bell}
      iconColor="text-orange-600"
      title="Push Notificaties"
      description={description}
      actions={actions}
    />
  );
};

export default NotificationControls;
