
import React, { useState } from 'react';
import { Contact } from '../../types';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { useTouchHandling } from './hooks/useTouchHandling';
import CaregiverCard from './CaregiverCard';
import DragIndicator from './DragIndicator';

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
  const [isDragging, setIsDragging] = useState(false);

  // Calculate priority based on index if not set
  const getCaregiverWithPriority = (caregiver: Contact, index: number) => ({
    ...caregiver,
    priority: caregiver.priority || index + 1
  });

  const handleReorder = async (fromIndex: number, toIndex: number) => {
    const newCaregivers = [...caregivers];
    const draggedCaregiver = newCaregivers[fromIndex];

    newCaregivers.splice(fromIndex, 1);
    newCaregivers.splice(toIndex, 0, draggedCaregiver);

    const reorderedIds = newCaregivers.map(caregiver => parseInt(caregiver.id));

    try {
      await onReorderCaregivers(reorderedIds);
    } catch (error) {
      console.error('Failed to reorder caregivers:', error);
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
  };

  const {
    listRef,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop
  } = useDragAndDrop({ onReorder: handleReorder });

  const handleStartDrag = (index: number) => {
    setDraggedItem(index);
    setIsDragging(true);
  };

  const handleUpdateDragTarget = (index: number) => {
    if (draggedItem !== index) {
      setDraggedOver(index);
    }
  };

  const handleEndDrag = async () => {
    if (isDragging && draggedItem !== null && draggedOver !== null && draggedItem !== draggedOver) {
      await handleReorder(draggedItem, draggedOver);
    }
    
    setDraggedItem(null);
    setDraggedOver(null);
    setIsDragging(false);
  };

  const {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = useTouchHandling({
    isDragging,
    onStartDrag: handleStartDrag,
    onUpdateDragTarget: handleUpdateDragTarget,
    onEndDrag: handleEndDrag
  });

  return (
    <div className="relative">
      <DragIndicator isDragging={isDragging} />
      
      <div 
        ref={listRef}
        className="space-y-3"
        style={{ 
          touchAction: isDragging ? 'none' : 'pan-y pinch-zoom'
        }}
      >
        {caregivers.map((caregiver, index) => {
          const caregiverWithPriority = getCaregiverWithPriority(caregiver, index);
          
          return (
            <CaregiverCard
              key={caregiver.id}
              caregiver={caregiver}
              index={index}
              priority={caregiverWithPriority.priority}
              isDragging={isDragging}
              draggedItem={draggedItem}
              draggedOver={draggedOver}
              onEditCaregiver={onEditCaregiver}
              onRemoveCaregiver={onRemoveCaregiver}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SwipeableCaregiverList;
