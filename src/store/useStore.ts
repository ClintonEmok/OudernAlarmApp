
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { apiService } from '../services/api';
import { Device, Alert, Contact, User } from '../types';
import { notificationMonitorService } from '../services/notification-monitor-service';
import { authService } from '../services/auth-service';

// Import slice creators
import { createAuthSlice, AuthSlice } from './auth';
import { createDeviceSlice, DeviceSlice } from './devices';
import { createContactSlice, ContactSlice } from './contacts';
import { createAlertSlice, AlertSlice } from './alerts';
import { AuthState, DeviceState, ContactState, AlertState, LoadingState, LocationState, DeviceInfo } from './types';

interface StoreState extends 
  AuthSlice, 
  DeviceSlice, 
  ContactSlice, 
  AlertSlice, 
  LocationState, 
  LoadingState {
  // Loading actions
  setLoading: (loading: boolean) => void;
  // Device info actions
  setDeviceInfo: (info: DeviceInfo) => void;
}

export const useStore = create<StoreState>()(
  devtools(
    (set, get) => ({
      // Location state
      currentLocation: {
        latitude: 52.3676,
        longitude: 4.9041
      },
      
      deviceInfo: {
        batteryLevel: 85,
        connectionType: '4G',
        signalStrength: 4,
        lastUpdate: new Date()
      },
      
      // Loading state
      isLoading: false,
      
      // Loading actions
      setLoading: (loading) => set({ isLoading: loading }),
      
      // Device info actions
      setDeviceInfo: (info) => set({ deviceInfo: info }),
      
      // Auth slice
      ...createAuthSlice(set, get, apiService),
      
      // Device slice
      ...createDeviceSlice(set, get, apiService),
      
      // Contact slice
      ...createContactSlice(set, get, apiService),
      
      // Alert slice
      ...createAlertSlice(set, get, apiService),
      
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
      },
      
      fetchDevices: async () => {
        try {
          set({ isLoading: true });
          const data: Device[] = await apiService.getMyDevices();
          
          // Monitor devices for notifications
          data.forEach(device => {
            notificationMonitorService.monitorDevice(device);
          });
          
          set({ 
            devices: data,
            isLoading: false 
          });
        } catch (error: any) {
          console.error('Failed to fetch devices:', error);
          set({ 
            devices: [],
            isLoading: false 
          });
        }
      }
    }),
    { name: 'ouderen-alarm-store' }
  )
);
