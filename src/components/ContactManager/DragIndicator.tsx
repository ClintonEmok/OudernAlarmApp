
import React from 'react';

interface DragIndicatorProps {
  isDragging: boolean;
}

const DragIndicator: React.FC<DragIndicatorProps> = ({ isDragging }) => {
  if (!isDragging) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm z-50">
      Houd vast en sleep om opnieuw te rangschikken
    </div>
  );
};

export default DragIndicator;
