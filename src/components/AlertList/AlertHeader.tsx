import { Button } from '../ui/button';
interface AlertHeaderProps {
  alertCount: number;
  authorizedDeviceCount: number;
  isLoading: boolean;
  onRefresh: () => void;
}
const AlertHeader = ({
  alertCount,
  authorizedDeviceCount,
  isLoading,
  onRefresh
}: AlertHeaderProps) => {
  return <div className="flex items-center justify-between">
      <div className="text-center flex-1">
        <h2 className="text-xl font-bold text-gray-900">Alarmen</h2>
        
        {authorizedDeviceCount > 0}
      </div>
      <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
        {isLoading ? 'Laden...' : 'Ververs'}
      </Button>
    </div>;
};
export default AlertHeader;