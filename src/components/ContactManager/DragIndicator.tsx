
import React from 'react';
import { Move } from 'lucide-react';

interface DragIndicatorProps {
  isDragging: boolean;
}

const DragIndicator: React.FC<DragIndicatorProps> = ({ isDragging }) => {
  if (!isDragging) return null;

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm z-50 shadow-lg animate-fade-in">
      <div className="flex items-center space-x-2">
        <Move size={16} />
        <span>Sleep om opnieuw te rangschikken</span>
      </div>
    </div>
  );
};

export default DragIndicator;
