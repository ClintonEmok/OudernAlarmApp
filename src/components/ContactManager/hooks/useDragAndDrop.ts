
import { useState, useRef, useEffect } from 'react';

interface UseDragAndDropProps {
  onReorder: (fromIndex: number, toIndex: number) => Promise<void>;
}

export const useDragAndDrop = ({ onReorder }: UseDragAndDropProps) => {
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [draggedOver, setDraggedOver] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

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

    await onReorder(draggedItem, dropIndex);
    setDraggedItem(null);
    setDraggedOver(null);
    setIsDragging(false);
  };

  const resetDragState = () => {
    setDraggedItem(null);
    setDraggedOver(null);
    setIsDragging(false);
  };

  return {
    draggedItem,
    draggedOver,
    isDragging,
    listRef,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    resetDragState
  };
};
