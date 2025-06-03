
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import { Alert } from '../../../types';
import { logger } from '../../../utils/logger';

export const useAlertHandlers = () => {
  const navigate = useNavigate();
  const { setSelectedDevice, devices } = useStore();

  const handleCallUser = (phoneNumber: string) => {
    if (phoneNumber) {
      logger.info('Initiating call to:', phoneNumber);
      window.location.href = `tel:${phoneNumber}`;
    } else {
      logger.warn('No phone number available for call');
    }
  };

  const handleViewLocation = (alert: Alert) => {
    logger.info('Viewing location for alert:', alert.id);
    
    // Find the device associated with this alert
    const device = devices.find(d => d.phone_number === alert.device_phone);
    
    if (device) {
      // Set the device as selected so the map shows its location
      setSelectedDevice(device);
      logger.debug('Device set for map view:', device.id);
    }
    
    // If the alert has location data, we could potentially override the device location
    if (alert.location) {
      logger.debug('Alert has location data:', alert.location);
      // Could store this in a separate state for showing alarm-specific location
    }
    
    // Navigate to map view
    navigate('/device'); // Map view is on the device page
  };

  const handleMarkAsResolved = (alertId: string) => {
    // This would require a new API endpoint to mark alarms as resolved
    logger.info('Marking alert as resolved:', alertId);
    // TODO: Implement when API endpoint is available
  };

  return {
    handleCallUser,
    handleViewLocation,
    handleMarkAsResolved
  };
};
