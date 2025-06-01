
import React, { useState, useRef, useEffect } from 'react';
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
  const [isDragging, setIsDragging] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null);
  const [hasMoved, setHasMoved] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // Calculate priority based on index if not set
  const getCaregiverWithPriority = (caregiver: Contact, index: number) => ({
    ...caregiver,
    priority: caregiver.priority || index + 1
  });

  // Touch event handlers for mobile drag-and-drop
  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    const touch = e.touches[0];
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    setHasMoved(false);
    
    // Start long press timer for drag mode
    const timer = setTimeout(() => {
      if (!hasMoved) {
        setIsDragging(true);
        setDraggedItem(index);
        // Add haptic feedback if available
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
    }, 800); // Increased to 800ms for more reliable detection
    
    setLongPressTimer(timer);
  };

  const handleTouchMove = (e: React.TouchEvent, index: number) => {
    if (!touchStartPos) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartPos.x);
    const deltaY = Math.abs(touch.clientY - touchStartPos.y);
    
    // If user has moved more than 10px, consider it a scroll/move gesture
    if (deltaX > 10 || deltaY > 10) {
      setHasMoved(true);
      
      // Clear long press timer if user is scrolling
      if (longPressTimer && !isDragging) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
      }
    }

    // Only handle drag if we're already in drag mode
    if (!isDragging || draggedItem === null) {
      return; // Allow normal scrolling
    }
    
    // Prevent default scrolling when actively dragging
    e.preventDefault();
    
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const cardElement = element?.closest('[data-caregiver-index]');
    
    if (cardElement) {
      const targetIndex = parseInt(cardElement.getAttribute('data-caregiver-index') || '0');
      if (targetIndex !== draggedItem) {
        setDraggedOver(targetIndex);
      }
    }
  };

  const handleTouchEnd = async (e: React.TouchEvent) => {
    // Clear long press timer
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }

    if (isDragging && draggedItem !== null && draggedOver !== null && draggedItem !== draggedOver) {
      await handleReorder(draggedItem, draggedOver);
    }

    // Reset all drag states
    setIsDragging(false);
    setDraggedItem(null);
    setDraggedOver(null);
    setTouchStartPos(null);
    setHasMoved(false);
  };

  // Desktop drag handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItem(index);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';

    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
    setDraggedItem(null);
    setDraggedOver(null);
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDraggedOver(index);
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === dropIndex) {
      setDraggedItem(null);
      setDraggedOver(null);
      setIsDragging(false);
      return;
    }

    await handleReorder(draggedItem, dropIndex);
    setDraggedItem(null);
    setDraggedOver(null);
    setIsDragging(false);
  };

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

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }
    };
  }, [longPressTimer]);

  return (
    <div 
      ref={listRef}
      className="space-y-3"
      style={{ 
        touchAction: isDragging ? 'none' : 'auto'
      }}
    >
      {caregivers.map((caregiver, index) => {
        const caregiverWithPriority = getCaregiverWithPriority(caregiver, index);
        
        return (
          <Card
            key={caregiver.id}
            data-caregiver-index={index}
            className={`border-blue-100 transition-all duration-200 ${
              draggedOver === index ? 'border-blue-300 shadow-md' : ''
            } ${draggedItem === index ? 'opacity-50 scale-105' : ''} ${
              isDragging && draggedItem === index ? 'z-50' : ''
            }`}
            draggable={!isDragging}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onTouchStart={(e) => handleTouchStart(e, index)}
            onTouchMove={(e) => handleTouchMove(e, index)}
            onTouchEnd={handleTouchEnd}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Drag handle */}
                  <div className={`flex-shrink-0 text-gray-400 hover:text-gray-600 ${
                    isDragging && draggedItem === index ? 'text-blue-600' : ''
                  }`}>
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
      
      {isDragging && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm z-50">
          Houd vast en sleep om opnieuw te rangschikken
        </div>
      )}
    </div>
  );
};

export default SwipeableCaregiverList;
