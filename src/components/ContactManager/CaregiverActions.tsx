
import React, { useEffect, useRef } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Contact } from '../../types';

interface CaregiverActionsProps {
  caregiver: Contact;
  priority: number;
  onEdit: () => void;
  onRemove: () => void;
  onClose: () => void;
}

const CaregiverActions: React.FC<CaregiverActionsProps> = ({
  caregiver,
  priority,
  onEdit,
  onRemove,
  onClose
}) => {
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div 
      ref={actionsRef}
      className="mt-3 pt-3 border-t border-gray-200 flex space-x-2 animate-fade-in"
    >
      <Button
        size="sm"
        variant="outline"
        className="flex-1 text-blue-600 border-blue-300 hover:bg-blue-50"
        onClick={onEdit}
      >
        <Edit size={14} className="mr-2" />
        Bewerken
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
        onClick={onRemove}
      >
        <Trash2 size={14} className="mr-2" />
        Verwijderen
      </Button>
    </div>
  );
};

export default CaregiverActions;
