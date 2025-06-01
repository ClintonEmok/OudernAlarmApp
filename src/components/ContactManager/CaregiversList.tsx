
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import SwipeableCaregiverList from './SwipeableCaregiverList';
import { Contact } from '../../types';

interface CaregiversListProps {
  caregivers: Contact[];
  onUpdatePriorities: (caregivers: Array<{ user_id: number; priority: number }>) => Promise<void>;
  onReorderCaregivers: (caregiver_ids: number[]) => Promise<void>;
  onRemoveCaregiver: (caregiver: Contact) => void;
  onEditCaregiver: (caregiverId: number, priority: number) => void;
}

const CaregiversList: React.FC<CaregiversListProps> = ({
  caregivers,
  onUpdatePriorities,
  onReorderCaregivers,
  onRemoveCaregiver,
  onEditCaregiver
}) => {
  if (caregivers.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Mijn Zorgverleners ({caregivers.length})</CardTitle>
        <p className="text-sm text-gray-600 mt-1">Houd een zorgverlener lang ingedrukt om te verslepen</p>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <SwipeableCaregiverList
          caregivers={caregivers}
          onUpdatePriorities={onUpdatePriorities}
          onReorderCaregivers={onReorderCaregivers}
          onRemoveCaregiver={onRemoveCaregiver}
          onEditCaregiver={onEditCaregiver}
        />
      </CardContent>
    </Card>
  );
};

export default CaregiversList;
