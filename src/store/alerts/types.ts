
import { Alert } from '../../types';

export interface AlertActions {
  setAlerts: (alerts: Alert[]) => void;
  fetchAlerts: () => Promise<void>;
  authorizedDevicePhones: Set<string>;
  setAuthorizedDevices: (devicePhones: string[]) => void;
}

export interface AlertState {
  alerts: Alert[];
  authorizedDevicePhones: Set<string>;
}

export type AlertSlice = AlertState & AlertActions;

// Define the API response structure
export interface ApiAlertResponse {
  data?: any[];
  [key: string]: any;
}
