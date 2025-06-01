
import React, { useState } from 'react';
import { Phone, MoreVertical, Star, GripVertical } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Contact } from '../../types';
import CaregiverActions from './CaregiverActions';

interface CaregiverCardProps {
  caregiver: Contact;
  index: number;
  priority: number;
  isDragging: boolean;
  draggedItem: number | null;
  draggedOver: number | null;
  onEditCaregiver: (caregiverId: number, priority: number) => void;
  onRemoveCaregiver: (caregiver: Contact) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onTouchStart: (e: React.TouchEvent, index: number) => void;
  onTouchMove: (e: React.TouchEvent, index: number) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

const CaregiverCard: React.FC<CaregiverCardProps> = ({
  caregiver,
  index,
  priority,
  isDragging,
  draggedItem,
  draggedOver,
  onEditCaregiver,
  onRemoveCaregiver,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onTouchStart,
  onTouchMove,
  onTouchEnd
}) => {
  const [showActions, setShowActions] = useState(false);

  const isBeingDragged = draggedItem === index;
  const isDropTarget = draggedOver === index && draggedItem !== index;

  return (
    <Card
      data-caregiver-index={index}
      className={`
        border-blue-100 transition-all duration-200 select-none
        ${isDropTarget ? 'border-blue-300 shadow-lg bg-blue-50' : ''}
        ${isBeingDragged ? 'opacity-60 scale-105 shadow-xl z-50' : ''}
        ${isDragging && !isBeingDragged ? 'opacity-80' : ''}
      `}
      draggable={!isDragging}
      onDragStart={(e) => onDragStart(e, index)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      onTouchStart={(e) => onTouchStart(e, index)}
      onTouchMove={(e) => onTouchMove(e, index)}
      onTouchEnd={onTouchEnd}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          {/* Drag handle - more prominent */}
          <div 
            className={`
              flex-shrink-0 p-2 -ml-2 -my-1 rounded cursor-grab active:cursor-grabbing
              ${isBeingDragged ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}
              transition-colors touch-none
            `}
          >
            <GripVertical size={20} />
          </div>
          
          {/* Priority number */}
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-sm">
              {priority}
            </span>
          </div>
          
          {/* Contact info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-semibold text-gray-900 truncate">{caregiver.name}</h4>
              <Star size={14} className="text-yellow-500 fill-current flex-shrink-0" />
            </div>
            <p className="text-sm text-gray-600 truncate">{caregiver.email}</p>
            {caregiver.phone_number && (
              <p className="text-sm text-gray-500 truncate">{caregiver.phone_number}</p>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center space-x-1 flex-shrink-0">
            {caregiver.phone_number && (
              <Button 
                size="sm" 
                variant="outline" 
                className="p-2 h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `tel:${caregiver.phone_number}`;
                }}
              >
                <Phone size={14} />
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="p-2 h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
            >
              <MoreVertical size={14} />
            </Button>
          </div>
        </div>
        
        {/* Actions dropdown */}
        {showActions && (
          <CaregiverActions
            caregiver={caregiver}
            priority={priority}
            onEdit={() => {
              onEditCaregiver(parseInt(caregiver.id), priority);
              setShowActions(false);
            }}
            onRemove={() => {
              onRemoveCaregiver(caregiver);
              setShowActions(false);
            }}
            onClose={() => setShowActions(false)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default CaregiverCard;
