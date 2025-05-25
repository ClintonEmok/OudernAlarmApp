
import { create } from 'zustand';
import { Alert, Contact, Device, User } from '../types';

interface AppState {
  // User authentication
  user: User | null;
  accessToken: string | null;
  
  // Current location (from device)
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  
  // Alerts (only SOS and Fall from API)
  alerts: Alert[];
  
  // Contacts (caregivers and patients)
  caregivers: Contact[];
  patients: Contact[];
  
  // Devices
  devices: Device[];
  selectedDevice: Device | null;
  
  // Device info for display
  deviceInfo: {
    batteryLevel: number;
    signalStrength: number;
    connectionType: '5G' | '4G' | 'WiFi';
    lastUpdate: Date;
    deviceId: string;
    firmwareVersion: string;
  };
  
  // Actions
  setUser: (user: User) => void;
  setAccessToken: (token: string) => void;
  addAlert: (alert: Omit<Alert, 'id'>) => void;
  markAlertAsResolved: (id: string) => void;
  toggleFalseAlarm: (id: string) => void;
  setCaregivers: (caregivers: Contact[]) => void;
  setPatients: (patients: Contact[]) => void;
  setDevices: (devices: Device[]) => void;
  setSelectedDevice: (device: Device | null) => void;
  updateDeviceInfo: (info: Partial<AppState['deviceInfo']>) => void;
  logout: () => void;
}

// Mock data that would come from API
const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'SOS',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    responder: 'Jan Pieterse',
    isFalseAlarm: false,
    status: 'Responding',
    location: 'Thuis'
  },
  {
    id: '2',
    type: 'Fall',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    responder: 'Marie de Vries',
    isFalseAlarm: true,
    status: 'Resolved',
    location: 'Tuin'
  }
];

const mockCaregivers: Contact[] = [
  {
    id: '1',
    name: 'Jan Pieterse',
    email: 'jan@example.com',
    phone_number: '+31 6 12345678',
    priority: 1,
    relationship: 'Zoon'
  },
  {
    id: '2',
    name: 'Marie de Vries',
    email: 'marie@example.com', 
    phone_number: '+31 6 87654321',
    priority: 2,
    relationship: 'Dochter'
  }
];

export const useStore = create<AppState>((set) => ({
  user: null,
  accessToken: null,
  
  currentLocation: {
    latitude: 52.3676,
    longitude: 4.9041
  },
  
  alerts: mockAlerts,
  caregivers: mockCaregivers,
  patients: [],
  devices: [],
  selectedDevice: null,
  
  deviceInfo: {
    batteryLevel: 56,
    signalStrength: 4,
    connectionType: '5G',
    lastUpdate: new Date(),
    deviceId: 'OA-2024-001',
    firmwareVersion: '2.1.3'
  },
  
  setUser: (user) => set({ user }),
  setAccessToken: (token) => set({ accessToken: token }),
  
  addAlert: (alert) => set((state) => ({
    alerts: [{ ...alert, id: Date.now().toString() }, ...state.alerts]
  })),
  
  markAlertAsResolved: (id) => set((state) => ({
    alerts: state.alerts.map(alert => 
      alert.id === id ? { ...alert, status: 'Resolved' as const } : alert
    )
  })),
  
  toggleFalseAlarm: (id) => set((state) => ({
    alerts: state.alerts.map(alert => 
      alert.id === id ? { ...alert, isFalseAlarm: !alert.isFalseAlarm } : alert
    )
  })),
  
  setCaregivers: (caregivers) => set({ caregivers }),
  setPatients: (patients) => set({ patients }),
  setDevices: (devices) => set({ devices }),
  setSelectedDevice: (device) => set({ selectedDevice: device }),
  
  updateDeviceInfo: (info) => set((state) => ({
    deviceInfo: { ...state.deviceInfo, ...info }
  })),
  
  logout: () => set({ 
    user: null, 
    accessToken: null,
    caregivers: [],
    patients: [],
    devices: [],
    selectedDevice: null
  })
}));
