
import { AlertTriangle } from 'lucide-react';

interface SecurityWarningsProps {
  warnings: string[];
}

const SecurityWarnings = ({ warnings }: SecurityWarningsProps) => {
  if (warnings.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
      <div className="flex items-center space-x-2">
        <AlertTriangle className="h-4 w-4 text-red-500" />
        <span className="text-sm font-medium text-red-800">Beveiligingswaarschuwing</span>
      </div>
      {warnings.map((warning, index) => (
        <p key={index} className="text-sm text-red-700 mt-1">{warning}</p>
      ))}
    </div>
  );
};

export default SecurityWarnings;
