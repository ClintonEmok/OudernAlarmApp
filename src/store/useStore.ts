
import { create } from 'zustand';
import { Alert, Contact, DeviceInfo, Geofence, Reminder } from '../types';

interface AppState {
  // Current location
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  
  // Alerts
  alerts: Alert[];
  
  // Contacts
  contacts: Contact[];
  
  // Device info
  deviceInfo: DeviceInfo;
  
  // Geofences
  geofences: Geofence[];
  
  // Reminders
  reminders: Reminder[];
  
  // Lockbox code
  lockboxCode: string;
  
  // Actions
  addAlert: (alert: Omit<Alert, 'id'>) => void;
  markAlertAsResolved: (id: string) => void;
  toggleFalseAlarm: (id: string) => void;
  updateDeviceInfo: (info: Partial<DeviceInfo>) => void;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'SOS',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
    responder: 'Jan Pieterse',
    isFalseAlarm: false,
    status: 'Responding',
    location: 'Thuis'
  },
  {
    id: '2',
    type: 'Battery',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isFalseAlarm: false,
    status: 'Resolved',
    location: 'Thuis'
  },
  {
    id: '3',
    type: 'Fall',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    responder: 'Marie de Vries',
    isFalseAlarm: true,
    status: 'Resolved',
    location: 'Tuin'
  }
];

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Jan Pieterse',
    relationship: 'Zoon',
    phone: '+31 6 12345678',
    priority: 1,
    isEmergencyContact: true
  },
  {
    id: '2',
    name: 'Marie de Vries',
    relationship: 'Dochter',
    phone: '+31 6 87654321',
    priority: 2,
    isEmergencyContact: true
  },
  {
    id: '3',
    name: 'Dr. van Dam',
    relationship: 'Huisarts',
    phone: '+31 20 1234567',
    priority: 3,
    isEmergencyContact: false
  }
];

const mockReminders: Reminder[] = [
  {
    id: '1',
    title: 'Medicatie innemen',
    description: 'Bloeddrukmedicatie',
    time: '08:00',
    frequency: 'Daily',
    isActive: true,
    type: 'Medication'
  },
  {
    id: '2',
    title: 'Controle afspraak',
    description: 'Cardioloog bezoek',
    time: '14:30',
    frequency: 'Monthly',
    isActive: true,
    type: 'Appointment'
  }
];

export const useStore = create<AppState>((set) => ({
  currentLocation: {
    latitude: 52.3676,
    longitude: 4.9041 // Amsterdam
  },
  
  alerts: mockAlerts,
  contacts: mockContacts,
  
  deviceInfo: {
    batteryLevel: 56,
    signalStrength: 4,
    connectionType: '5G',
    lastUpdate: new Date(),
    deviceId: 'OA-2024-001',
    firmwareVersion: '2.1.3'
  },
  
  geofences: [
    {
      id: '1',
      name: 'Thuis',
      latitude: 52.3676,
      longitude: 4.9041,
      radius: 100,
      isActive: true
    }
  ],
  
  reminders: mockReminders,
  lockboxCode: '1234',
  
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
  
  updateDeviceInfo: (info) => set((state) => ({
    deviceInfo: { ...state.deviceInfo, ...info }
  }))
}));
