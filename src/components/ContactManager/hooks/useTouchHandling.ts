
import { useState, useEffect } from 'react';

interface UseTouchHandlingProps {
  isDragging: boolean;
  onStartDrag: (index: number) => void;
  onUpdateDragTarget: (index: number) => void;
  onEndDrag: () => void;
}

export const useTouchHandling = ({ 
  isDragging, 
  onStartDrag, 
  onUpdateDragTarget, 
  onEndDrag 
}: UseTouchHandlingProps) => {
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null);
  const [hasMoved, setHasMoved] = useState(false);

  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    const touch = e.touches[0];
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    setHasMoved(false);
    
    const timer = setTimeout(() => {
      if (!hasMoved) {
        onStartDrag(index);
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
    }, 800);
    
    setLongPressTimer(timer);
  };

  const handleTouchMove = (e: React.TouchEvent, index: number) => {
    if (!touchStartPos) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartPos.x);
    const deltaY = Math.abs(touch.clientY - touchStartPos.y);
    
    if (deltaX > 10 || deltaY > 10) {
      setHasMoved(true);
      
      if (longPressTimer && !isDragging) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
      }
    }

    if (!isDragging) {
      return;
    }
    
    e.preventDefault();
    
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const cardElement = element?.closest('[data-caregiver-index]');
    
    if (cardElement) {
      const targetIndex = parseInt(cardElement.getAttribute('data-caregiver-index') || '0');
      onUpdateDragTarget(targetIndex);
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }

    onEndDrag();
    setTouchStartPos(null);
    setHasMoved(false);
  };

  useEffect(() => {
    return () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }
    };
  }, [longPressTimer]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
};
