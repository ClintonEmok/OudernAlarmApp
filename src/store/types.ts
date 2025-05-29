
import { Alert, Contact, Device, User } from '../types';

export interface DeviceInfo {
  batteryLevel: number;
  connectionType: '5G' | '4G' | 'WiFi';
  signalStrength: number;
  lastUpdate: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface LocationState {
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  deviceInfo: DeviceInfo;
}

export interface DeviceState {
  devices: Device[];
  ownDevices: Device[];
  caregivingDevices: Device[];
  selectedDevice: Device | null;
}

export interface ContactState {
  caregivers: Contact[];
  patients: Contact[];
  pendingInvites: any[];
}

export interface AlertState {
  alerts: Alert[];
  authorizedDevicePhones: Set<string>;
}

export interface LoadingState {
  isLoading: boolean;
}
