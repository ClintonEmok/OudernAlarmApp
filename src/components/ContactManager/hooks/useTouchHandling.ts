
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
  const [isDragMode, setIsDragMode] = useState(false);

  const LONG_PRESS_DURATION = 500; // Reduced from 800ms
  const MOVE_THRESHOLD = 10; // Pixels to consider as movement

  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    const touch = e.touches[0];
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    setHasMoved(false);
    setIsDragMode(false);
    
    const timer = setTimeout(() => {
      if (!hasMoved) {
        setIsDragMode(true);
        onStartDrag(index);
        // Haptic feedback if available
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
    }, LONG_PRESS_DURATION);
    
    setLongPressTimer(timer);
  };

  const handleTouchMove = (e: React.TouchEvent, index: number) => {
    if (!touchStartPos) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartPos.x);
    const deltaY = Math.abs(touch.clientY - touchStartPos.y);
    
    // Check if user has moved beyond threshold
    if (deltaX > MOVE_THRESHOLD || deltaY > MOVE_THRESHOLD) {
      setHasMoved(true);
      
      // Cancel long press if not in drag mode yet
      if (longPressTimer && !isDragMode) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
      }
    }

    // Only prevent default if we're actually dragging
    if (isDragging && isDragMode) {
      e.preventDefault();
      
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      const cardElement = element?.closest('[data-caregiver-index]');
      
      if (cardElement) {
        const targetIndex = parseInt(cardElement.getAttribute('data-caregiver-index') || '0');
        onUpdateDragTarget(targetIndex);
      }
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }

    if (isDragMode) {
      onEndDrag();
    }
    
    setTouchStartPos(null);
    setHasMoved(false);
    setIsDragMode(false);
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
