
import { create } from 'zustand';
import { Alert, Contact, Device, User } from '../types';
import { apiService } from '../services/api';

interface DeviceInfo {
  batteryLevel: number;
  connectionType: '5G' | '4G' | 'WiFi';
  signalStrength: number;
  lastUpdate: Date;
}

interface AppState {
  // User authentication
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  
  // Current location (from device)
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  
  // Device info for MapView
  deviceInfo: DeviceInfo;
  
  // Alerts (from API)
  alerts: Alert[];
  
  // Contacts (caregivers and patients)
  caregivers: Contact[];
  patients: Contact[];
  
  // Devices
  devices: Device[];
  selectedDevice: Device | null;
  
  // Loading states
  isLoading: boolean;
  
  // Actions
  setUser: (user: User) => void;
  setAccessToken: (token: string) => void;
  setCaregivers: (caregivers: Contact[]) => void;
  setPatients: (patients: Contact[]) => void;
  setDevices: (devices: Device[]) => void;
  setSelectedDevice: (device: Device | null) => void;
  setAlerts: (alerts: Alert[]) => void;
  setLoading: (loading: boolean) => void;
  updateDeviceInfo: () => void;
  
  // API Actions
  fetchUserData: () => Promise<void>;
  fetchCaregivers: () => Promise<void>;
  fetchPatients: () => Promise<void>;
  fetchDevices: () => Promise<void>;
  fetchAlerts: () => Promise<void>;
  inviteCaregiver: (email: string) => Promise<void>;
  removeCaregiver: (userId: number) => Promise<void>;
  
  logout: () => void;
  checkAuth: () => void;
}

// Type guard to check if response is a valid User object
const isValidUser = (userData: any): userData is User => {
  return userData && 
         typeof userData.id === 'number' &&
         typeof userData.name === 'string' &&
         typeof userData.email === 'string' &&
         typeof userData.created_at === 'string' &&
         typeof userData.updated_at === 'string';
};

export const useStore = create<AppState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  
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
  
  alerts: [],
  caregivers: [],
  patients: [],
  devices: [],
  selectedDevice: null,
  isLoading: false,
  
  setUser: (user) => set({ user, isAuthenticated: true }),
  setAccessToken: (token) => set({ accessToken: token }),
  setCaregivers: (caregivers) => set({ caregivers }),
  setPatients: (patients) => set({ patients }),
  setDevices: (devices) => set({ devices }),
  setSelectedDevice: (device) => set({ selectedDevice: device }),
  setAlerts: (alerts) => set({ alerts }),
  setLoading: (loading) => set({ isLoading: loading }),
  
  updateDeviceInfo: () => {
    const { selectedDevice } = get();
    if (selectedDevice) {
      set({
        deviceInfo: {
          batteryLevel: selectedDevice.batteryLevel,
          connectionType: selectedDevice.connectionType,
          signalStrength: selectedDevice.signalStrength,
          lastUpdate: selectedDevice.lastUpdate
        }
      });
    }
  },
  
  fetchUserData: async () => {
    try {
      set({ isLoading: true });
      const userData = await apiService.getUser();
      if (isValidUser(userData)) {
        set({ user: userData });
      } else {
        console.warn('Invalid user data received from API:', userData);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  fetchCaregivers: async () => {
    try {
      const caregivers = await apiService.getCaregivers();
      set({ caregivers: Array.isArray(caregivers) ? caregivers : [] });
    } catch (error) {
      console.error('Failed to fetch caregivers:', error);
      set({ caregivers: [] });
    }
  },
  
  fetchPatients: async () => {
    try {
      const patients = await apiService.getPatients();
      set({ patients: Array.isArray(patients) ? patients : [] });
    } catch (error) {
      console.error('Failed to fetch patients:', error);
      set({ patients: [] });
    }
  },
  
  fetchDevices: async () => {
    try {
      const devicesResponse = await apiService.getMyDevices() as any;
      // API returns { own: [...], caregiving: [...] } or just an array
      const devices = devicesResponse?.own || devicesResponse || [];
      set({ devices: Array.isArray(devices) ? devices : [] });
      
      // Update device info if we have devices
      if (devices.length > 0) {
        const { selectedDevice, setSelectedDevice } = get();
        if (!selectedDevice) {
          setSelectedDevice(devices[0]);
        }
        get().updateDeviceInfo();
      }
    } catch (error) {
      console.error('Failed to fetch devices:', error);
      set({ devices: [] });
    }
  },
  
  fetchAlerts: async () => {
    try {
      const alerts = await apiService.getDeviceAlarms();
      set({ alerts: Array.isArray(alerts) ? alerts : [] });
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
      set({ alerts: [] });
    }
  },
  
  inviteCaregiver: async (email: string) => {
    try {
      await apiService.inviteCaregiver(email);
      // Refresh caregivers list
      await get().fetchCaregivers();
    } catch (error) {
      console.error('Failed to invite caregiver:', error);
      throw error;
    }
  },
  
  removeCaregiver: async (userId: number) => {
    try {
      await apiService.removeCaregiver(userId);
      // Refresh caregivers list
      await get().fetchCaregivers();
    } catch (error) {
      console.error('Failed to remove caregiver:', error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('access_token');
    set({ 
      user: null, 
      accessToken: null,
      isAuthenticated: false,
      caregivers: [],
      patients: [],
      devices: [],
      alerts: [],
      selectedDevice: null
    });
  },
  
  checkAuth: () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      set({ accessToken: token, isAuthenticated: true });
    }
  }
}));
