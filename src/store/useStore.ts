
import { create } from 'zustand';
import { createAuthSlice, AuthSlice } from './auth';
import { createDeviceSlice, DeviceSlice } from './devices';
import { createContactSlice, ContactSlice } from './contacts';
import { createAlertSlice, AlertSlice } from './alerts';
import { createSettingsSlice, SettingsSlice } from './settings';
import { LocationState, LoadingState, DeviceInfo } from './types';
import { authService } from '../services/auth-service';

interface AppState extends 
  AuthSlice, 
  DeviceSlice, 
  ContactSlice, 
  AlertSlice,
  SettingsSlice,
  LocationState, 
  LoadingState {
  // Loading actions
  setLoading: (loading: boolean) => void;
  // Device info actions
  setDeviceInfo: (info: DeviceInfo) => void;
  // Central refresh function
  refreshAll: () => Promise<void>;
  // Initialize app
  initializeApp: () => void;
}

export const useStore = create<AppState>((set, get, api) => ({
  // Location state
  currentLocation: {
    latitude: 52.3676,
    longitude: 4.9041
  },
  
  deviceInfo: {
    batteryLevel: 85,
    lastUpdate: new Date()
  },
  
  // Loading state
  isLoading: false,
  
  // Loading actions
  setLoading: (loading) => set({ isLoading: loading }),
  
  // Device info actions
  setDeviceInfo: (info) => set({ deviceInfo: info }),
  
  // Central refresh function that updates both devices and alerts
  refreshAll: async () => {
    console.log('🔄 Starting central refresh for devices and alerts...');
    set({ isLoading: true });
    
    try {
      // Fetch devices and alerts in parallel
      await Promise.all([
        get().fetchDevices(),
        get().fetchAlerts()
      ]);
      console.log('✅ Central refresh completed successfully');
    } catch (error) {
      console.error('❌ Central refresh failed:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Initialize app - load settings from storage
  initializeApp: () => {
    get().loadSettingsFromStorage();
  },
  
  // Auth slice
  ...createAuthSlice(set, get, api),
  
  // Device slice
  ...createDeviceSlice(set, get, api),
  
  // Contact slice
  ...createContactSlice(set, get, api),
  
  // Alert slice
  ...createAlertSlice(set, get, api),

  // Settings slice
  ...createSettingsSlice(set, get, api),
  
  // Override logout to clear all state and token
  logout: () => {
    // Clear the access token
    authService.clearToken();
    
    set({ 
      user: null, 
      isAuthenticated: false,
      caregivers: [],
      patients: [],
      devices: [],
      ownDevices: [],
      caregivingDevices: [],
      alerts: [],
      selectedDevice: null,
      pendingInvites: []
    });
    
    // Redirect to login
    window.location.href = '/login';
  }
}));
