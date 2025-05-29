import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { apiService } from '../services/api';
import { Device, DeviceInfo, Alert, Contact, User } from '../types';
import { notificationMonitorService } from '../services/notification-monitor-service';

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
      ...createAuthSlice(set, get, api),
      
      // Device slice
      ...createDeviceSlice(set, get, api),
      
      // Contact slice
      ...createContactSlice(set, get, api),
      
      // Alert slice
      ...createAlertSlice(set, get, api),
      
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
          set({ isLoading: true, error: null });
          const data = await apiService.getMyDevices();
          
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
            error: error.message || 'Failed to fetch devices',
            isLoading: false 
          });
        }
      }
    }),
    { name: 'ouderen-alarm-store' }
  )
);
