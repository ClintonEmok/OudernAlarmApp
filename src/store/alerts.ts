
import { StateCreator } from 'zustand';
import { AlertState } from './types';
import { Alert } from '../types';
import { apiService } from '../services/api';

export interface AlertActions {
  setAlerts: (alerts: Alert[]) => void;
  fetchAlerts: () => Promise<void>;
}

export type AlertSlice = AlertState & AlertActions;

export const createAlertSlice: StateCreator<
  AlertSlice,
  [],
  [],
  AlertSlice
> = (set) => ({
  alerts: [],
  
  setAlerts: (alerts) => set({ alerts }),
  
  fetchAlerts: async () => {
    try {
      const alerts = await apiService.getDeviceAlarms();
      set({ alerts: Array.isArray(alerts) ? alerts : [] });
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
      set({ alerts: [] });
    }
  }
});
