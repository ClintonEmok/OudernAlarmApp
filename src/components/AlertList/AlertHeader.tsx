
import { Button } from '../ui/button';

interface AlertHeaderProps {
  alertCount: number;
  authorizedDeviceCount: number;
  isLoading: boolean;
  onRefresh: () => void;
}

const AlertHeader = ({ alertCount, authorizedDeviceCount, isLoading, onRefresh }: AlertHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="text-center flex-1">
        <h2 className="text-xl font-bold text-gray-900">Alarmen</h2>
        <p className="text-sm text-gray-600">
          {alertCount === 0 ? 'Geen actieve alarmen' : `${alertCount} alarm${alertCount !== 1 ? 'en' : ''}`}
          <span className="text-xs text-gray-400 ml-2">(Updates elke 30 sec)</span>
        </p>
        {authorizedDeviceCount > 0 && (
          <p className="text-xs text-gray-400">
            🔒 {authorizedDeviceCount} geautoriseerde apparaten
          </p>
        )}
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRefresh}
        disabled={isLoading}
      >
        {isLoading ? 'Laden...' : 'Ververs'}
      </Button>
    </div>
  );
};

export default AlertHeader;
