
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface NativeFeatureCardProps {
  icon: LucideIcon;
  iconColor: string;
  title: string | React.ReactNode;
  description: string;
  actions?: React.ReactNode;
  statusIndicator?: React.ReactNode;
}

const NativeFeatureCard: React.FC<NativeFeatureCardProps> = ({
  icon: Icon,
  iconColor,
  title,
  description,
  actions,
  statusIndicator
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        <div>
          <div className="font-medium flex items-center gap-2">
            {title}
            {statusIndicator}
          </div>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      {actions && <div className="flex space-x-2">{actions}</div>}
    </div>
  );
};

export default NativeFeatureCard;
