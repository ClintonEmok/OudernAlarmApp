
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface PendingInvitesAlertProps {
  pendingInvites: any[];
}

const PendingInvitesAlert: React.FC<PendingInvitesAlertProps> = ({ pendingInvites }) => {
  if (pendingInvites.length === 0) return null;

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle size={20} className="text-yellow-600" />
          <div>
            <h4 className="font-medium text-yellow-800">Openstaande uitnodigingen</h4>
            <p className="text-sm text-yellow-700">
              U heeft {pendingInvites.length} openstaande uitnodiging(en) voor zorgverleners.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingInvitesAlert;
