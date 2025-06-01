
import { StateCreator } from 'zustand';

export interface SettingsState {
  showUserLocationOnMap: boolean;
  notificationsEnabled: boolean;
  alarmNotificationsEnabled: boolean;
  batteryNotificationsEnabled: boolean;
  locationNotificationsEnabled: boolean;
}

export interface SettingsSlice extends SettingsState {
  setShowUserLocationOnMap: (show: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setAlarmNotificationsEnabled: (enabled: boolean) => void;
  setBatteryNotificationsEnabled: (enabled: boolean) => void;
  setLocationNotificationsEnabled: (enabled: boolean) => void;
  loadSettingsFromStorage: () => void;
  saveSettingsToStorage: () => void;
}

export const createSettingsSlice: StateCreator<
  SettingsSlice,
  [],
  [],
  SettingsSlice
> = (set, get) => ({
  // Initial state
  showUserLocationOnMap: false,
  notificationsEnabled: true,
  alarmNotificationsEnabled: true,
  batteryNotificationsEnabled: true,
  locationNotificationsEnabled: false,

  // Actions
  setShowUserLocationOnMap: (show) => {
    set({ showUserLocationOnMap: show });
    get().saveSettingsToStorage();
  },

  setNotificationsEnabled: (enabled) => {
    set({ 
      notificationsEnabled: enabled,
      // If notifications are disabled, disable all sub-notifications
      alarmNotificationsEnabled: enabled ? get().alarmNotificationsEnabled : false,
      batteryNotificationsEnabled: enabled ? get().batteryNotificationsEnabled : false,
      locationNotificationsEnabled: enabled ? get().locationNotificationsEnabled : false,
    });
    get().saveSettingsToStorage();
  },

  setAlarmNotificationsEnabled: (enabled) => {
    set({ alarmNotificationsEnabled: enabled });
    get().saveSettingsToStorage();
  },

  setBatteryNotificationsEnabled: (enabled) => {
    set({ batteryNotificationsEnabled: enabled });
    get().saveSettingsToStorage();
  },

  setLocationNotificationsEnabled: (enabled) => {
    set({ locationNotificationsEnabled: enabled });
    get().saveSettingsToStorage();
  },

  loadSettingsFromStorage: () => {
    try {
      const savedSettings = localStorage.getItem('app-settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        set({
          showUserLocationOnMap: settings.showUserLocationOnMap ?? false,
          notificationsEnabled: settings.notificationsEnabled ?? true,
          alarmNotificationsEnabled: settings.alarmNotificationsEnabled ?? true,
          batteryNotificationsEnabled: settings.batteryNotificationsEnabled ?? true,
          locationNotificationsEnabled: settings.locationNotificationsEnabled ?? false,
        });
      }
    } catch (error) {
      console.error('Failed to load settings from storage:', error);
    }
  },

  saveSettingsToStorage: () => {
    try {
      const state = get();
      const settingsToSave = {
        showUserLocationOnMap: state.showUserLocationOnMap,
        notificationsEnabled: state.notificationsEnabled,
        alarmNotificationsEnabled: state.alarmNotificationsEnabled,
        batteryNotificationsEnabled: state.batteryNotificationsEnabled,
        locationNotificationsEnabled: state.locationNotificationsEnabled,
      };
      localStorage.setItem('app-settings', JSON.stringify(settingsToSave));
    } catch (error) {
      console.error('Failed to save settings to storage:', error);
    }
  },
});
