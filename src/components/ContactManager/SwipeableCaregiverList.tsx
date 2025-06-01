
import React, { useState, useRef } from 'react';
import { Phone, Edit, Star, Trash2, GripVertical } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Contact } from '../../types';

interface SwipeableCaregiverListProps {
  caregivers: Contact[];
  onUpdatePriorities: (caregivers: Array<{
    user_id: number;
    priority: number;
  }>) => Promise<void>;
  onReorderCaregivers: (caregiver_ids: number[]) => Promise<void>;
  onRemoveCaregiver: (caregiver: Contact) => void;
  onEditCaregiver: (careggiverId: number, priority: number) => void;
}

const SwipeableCaregiverList: React.FC<SwipeableCaregiverListProps> = ({
  caregivers,
  onUpdatePriorities,
  onReorderCaregivers,
  onRemoveCaregiver,
  onEditCaregiver
}) => {
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [draggedOver, setDraggedOver] = useState<number | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  // Calculate priority based on index if not set
  const getCaregiverWithPriority = (caregiver: Contact, index: number) => ({
    ...caregiver,
    priority: caregiver.priority || index + 1
  });

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';

    // Style the dragged element
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    // Reset opacity
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
    setDraggedItem(null);
    setDraggedOver(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDraggedOver(index);
  };

  const handleDragLeave = () => {
    setDraggedOver(null);
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === dropIndex) {
      setDraggedItem(null);
      setDraggedOver(null);
      return;
    }

    // Create new array with reordered items
    const newCaregivers = [...caregivers];
    const draggedCaregiver = newCaregivers[draggedItem];

    // Remove dragged item and insert at new position
    newCaregivers.splice(draggedItem, 1);
    newCaregivers.splice(dropIndex, 0, draggedCaregiver);

    // Create ordered list of caregiver IDs for the new reorder endpoint
    const reorderedIds = newCaregivers.map(caregiver => parseInt(caregiver.id));

    try {
      // Use the new reorder endpoint
      await onReorderCaregivers(reorderedIds);
    } catch (error) {
      console.error('Failed to reorder caregivers:', error);
      // Fallback to old priority update method if reorder fails
      try {
        const updatedCaregivers = newCaregivers.map((caregiver, index) => ({
          user_id: parseInt(caregiver.id),
          priority: index + 1
        }));
        await onUpdatePriorities(updatedCaregivers);
      } catch (fallbackError) {
        console.error('Failed to update priorities as fallback:', fallbackError);
      }
    }

    setDraggedItem(null);
    setDraggedOver(null);
  };

  return (
    <div className="space-y-3">
      {caregivers.map((caregiver, index) => {
        const caregiverWithPriority = getCaregiverWithPriority(caregiver, index);
        
        return (
          <Card
            key={caregiver.id}
            className={`border-blue-100 transition-all duration-200 ${
              draggedOver === index ? 'border-blue-300 shadow-md' : ''
            } ${draggedItem === index ? 'opacity-50' : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Drag handle */}
                  <div className="flex-shrink-0 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                    <GripVertical size={20} />
                  </div>
                  
                  {/* Priority number */}
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {caregiverWithPriority.priority}
                    </span>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900">{caregiver.name}</h4>
                      <div className="flex items-center">
                        <Star size={14} className="text-yellow-500 fill-current" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{caregiver.email}</p>
                    {caregiver.phone_number && (
                      <p className="text-sm text-gray-500">{caregiver.phone_number}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {caregiver.phone_number && (
                    <Button size="sm" variant="outline" className="p-2">
                      <Phone size={16} />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="p-2"
                    onClick={() => onEditCaregiver(parseInt(caregiver.id), caregiverWithPriority.priority)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="p-2 text-red-600 border-red-300 hover:bg-red-50"
                    onClick={() => onRemoveCaregiver(caregiver)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SwipeableCaregiverList;
