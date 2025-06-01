
import React from 'react';
import { Phone, Edit, Star, Trash2, GripVertical } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Contact } from '../../types';

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
      onDragStart={(e) => onDragStart(e, index)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      onTouchStart={(e) => onTouchStart(e, index)}
      onTouchMove={(e) => onTouchMove(e, index)}
      onTouchEnd={onTouchEnd}
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
                {priority}
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
              onClick={() => onEditCaregiver(parseInt(caregiver.id), priority)}
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
};

export default CaregiverCard;
