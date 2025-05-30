
import { useAuth } from '../../hooks/useAuth';
import { ScrollArea } from '../ui/scroll-area';
import AlertCard from './AlertCard';
import AlertHeader from './AlertHeader';
import AlertLoadingSkeleton from './AlertLoadingSkeleton';
import AlertEmptyState from './AlertEmptyState';
import SecurityWarnings from './SecurityWarnings';
import { useAlertLoading } from './hooks/useAlertLoading';
import { useAlertHandlers } from './utils/alertHandlers';
import { useAlarmHandler } from '../../hooks/useAlarmHandler';

const AlertList = () => {
  useAuth();
  
  // Use the alarm handler to trigger native features on new alarms
  useAlarmHandler();
  
  const {
    alerts,
    authorizedDevicePhones,
    isLoading,
    securityWarnings,
    handleRefresh
  } = useAlertLoading();

  const {
    handleCallUser,
    handleViewLocation,
    handleMarkAsResolved
  } = useAlertHandlers();

  if (isLoading && alerts.length === 0) {
    return <AlertLoadingSkeleton />;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 p-4 pb-2">
        <SecurityWarnings warnings={securityWarnings} />
        <AlertHeader 
          alertCount={alerts.length}
          authorizedDeviceCount={authorizedDevicePhones.size}
          isLoading={isLoading}
          onRefresh={handleRefresh}
        />
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 pt-2">
            {alerts.length === 0 ? (
              <AlertEmptyState />
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    onCall={handleCallUser}
                    onViewLocation={handleViewLocation}
                    onMarkAsResolved={handleMarkAsResolved}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default AlertList;
