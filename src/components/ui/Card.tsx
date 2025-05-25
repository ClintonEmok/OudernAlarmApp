
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => {
  return (
    <div className={cn(
      'bg-white rounded-lg border border-purple-100 shadow-sm',
      className
    )}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className }: CardProps) => {
  return (
    <div className={cn('p-4 border-b border-purple-100', className)}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className }: CardProps) => {
  return (
    <div className={cn('p-4', className)}>
      {children}
    </div>
  );
};
