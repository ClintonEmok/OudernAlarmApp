
import { create } from 'zustand';
import { Alert, Contact, Device, User } from '../types';
import { apiService } from '../services/api';

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

export const useStore = create<AppState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  
  currentLocation: {
    latitude: 52.3676,
    longitude: 4.9041
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
  
  fetchUserData: async () => {
    try {
      set({ isLoading: true });
      const userData = await apiService.getUser();
      set({ user: userData });
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  fetchCaregivers: async () => {
    try {
      const caregivers = await apiService.getCaregivers();
      set({ caregivers });
    } catch (error) {
      console.error('Failed to fetch caregivers:', error);
    }
  },
  
  fetchPatients: async () => {
    try {
      const patients = await apiService.getPatients();
      set({ patients });
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    }
  },
  
  fetchDevices: async () => {
    try {
      const devicesData = await apiService.getMyDevices();
      set({ devices: devicesData.own || [] });
    } catch (error) {
      console.error('Failed to fetch devices:', error);
    }
  },
  
  fetchAlerts: async () => {
    try {
      const alerts = await apiService.getDeviceAlarms();
      set({ alerts });
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
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
