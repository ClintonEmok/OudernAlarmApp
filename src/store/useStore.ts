
import { create } from 'zustand';
import { Alert, Contact, Device, User, ApiDevicesResponse } from '../types';
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
  ownDevices: Device[];
  caregivingDevices: Device[];
  selectedDevice: Device | null;
  
  // Pending invites
  pendingInvites: any[];
  
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
  fetchOwnDevices: () => Promise<void>;
  fetchCaregivingDevices: () => Promise<void>;
  fetchAlerts: () => Promise<void>;
  fetchPendingInvites: () => Promise<void>;
  
  // User management
  updateUser: (data: Partial<{ name: string; email: string; phone_number: string }>) => Promise<void>;
  updatePassword: (data: { current_password: string; new_password: string; new_password_confirmation: string }) => Promise<void>;
  deleteUser: (password: string) => Promise<void>;
  
  // Caregiver management
  inviteCaregiver: (email: string) => Promise<void>;
  removeCaregiver: (userId: number) => Promise<void>;
  acceptCaregiverInvite: (data: { token: string; name: string; password: string; password_confirmation: string }) => Promise<void>;
  updateCaregiverPriorities: (caregivers: Array<{ user_id: number; priority: number }>) => Promise<void>;
  
  // Device management
  assignDevice: (phone_number: string, nickname?: string) => Promise<void>;
  unassignDevice: (id: number) => Promise<void>;
  getDevice: (id: number) => Promise<Device>;
  
  // Invite validation
  validateInvite: (token: string) => Promise<any>;
  
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
  ownDevices: [],
  caregivingDevices: [],
  selectedDevice: null,
  pendingInvites: [],
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
      const devicesResponse = await apiService.getMyDevices() as ApiDevicesResponse;
      const allDevices = [...(devicesResponse.own || []), ...(devicesResponse.caregiving || [])];
      set({ 
        devices: allDevices,
        ownDevices: devicesResponse.own || [],
        caregivingDevices: devicesResponse.caregiving || []
      });
      
      if (allDevices.length > 0) {
        const { selectedDevice, setSelectedDevice } = get();
        if (!selectedDevice) {
          setSelectedDevice(allDevices[0]);
        }
        get().updateDeviceInfo();
      }
    } catch (error) {
      console.error('Failed to fetch devices:', error);
      set({ devices: [], ownDevices: [], caregivingDevices: [] });
    }
  },
  
  fetchOwnDevices: async () => {
    try {
      const devices = await apiService.getOwnDevices();
      set({ ownDevices: Array.isArray(devices) ? devices : [] });
    } catch (error) {
      console.error('Failed to fetch own devices:', error);
      set({ ownDevices: [] });
    }
  },
  
  fetchCaregivingDevices: async () => {
    try {
      const devices = await apiService.getCaregivingDevices();
      set({ caregivingDevices: Array.isArray(devices) ? devices : [] });
    } catch (error) {
      console.error('Failed to fetch caregiving devices:', error);
      set({ caregivingDevices: [] });
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
  
  fetchPendingInvites: async () => {
    try {
      const invites = await apiService.getPendingInvites();
      set({ pendingInvites: Array.isArray(invites) ? invites : [] });
    } catch (error) {
      console.error('Failed to fetch pending invites:', error);
      set({ pendingInvites: [] });
    }
  },
  
  // User management
  updateUser: async (data) => {
    try {
      await apiService.updateUser(data);
      await get().fetchUserData();
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  },
  
  updatePassword: async (data) => {
    try {
      await apiService.updatePassword(data);
    } catch (error) {
      console.error('Failed to update password:', error);
      throw error;
    }
  },
  
  deleteUser: async (password) => {
    try {
      await apiService.deleteUser(password);
      get().logout();
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    }
  },
  
  // Caregiver management
  inviteCaregiver: async (email: string) => {
    try {
      await apiService.inviteCaregiver(email);
      await get().fetchCaregivers();
      await get().fetchPendingInvites();
    } catch (error) {
      console.error('Failed to invite caregiver:', error);
      throw error;
    }
  },
  
  removeCaregiver: async (userId: number) => {
    try {
      await apiService.removeCaregiver(userId);
      await get().fetchCaregivers();
    } catch (error) {
      console.error('Failed to remove caregiver:', error);
      throw error;
    }
  },
  
  acceptCaregiverInvite: async (data) => {
    try {
      await apiService.acceptCaregiverInvite(data);
    } catch (error) {
      console.error('Failed to accept caregiver invite:', error);
      throw error;
    }
  },
  
  updateCaregiverPriorities: async (caregivers) => {
    try {
      await apiService.updateCaregiverPriorities(caregivers);
      await get().fetchCaregivers();
    } catch (error) {
      console.error('Failed to update caregiver priorities:', error);
      throw error;
    }
  },
  
  // Device management
  assignDevice: async (phone_number: string, nickname?: string) => {
    try {
      await apiService.assignDevice(phone_number, nickname);
      await get().fetchDevices();
    } catch (error) {
      console.error('Failed to assign device:', error);
      throw error;
    }
  },
  
  unassignDevice: async (id: number) => {
    try {
      await apiService.unassignDevice(id);
      await get().fetchDevices();
    } catch (error) {
      console.error('Failed to unassign device:', error);
      throw error;
    }
  },
  
  getDevice: async (id: number) => {
    try {
      return await apiService.getDevice(id);
    } catch (error) {
      console.error('Failed to get device:', error);
      throw error;
    }
  },
  
  validateInvite: async (token: string) => {
    try {
      return await apiService.validateInvite(token);
    } catch (error) {
      console.error('Failed to validate invite:', error);
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
      ownDevices: [],
      caregivingDevices: [],
      alerts: [],
      selectedDevice: null,
      pendingInvites: []
    });
  },
  
  checkAuth: () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      set({ accessToken: token, isAuthenticated: true });
    }
  }
}));
