
export interface Alert {
  id: string;
  type: 'SOS' | 'Fall';
  timestamp: Date;
  responder?: string;
  isFalseAlarm: boolean;
  status: 'Active' | 'Responding' | 'Resolved';
  location?: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  priority: number;
  relationship?: string;
}

export interface Device {
  id: number;
  phone_number: string;
  nickname?: string;
  batteryLevel: number;
  signalStrength: number;
  connectionType: '5G' | '4G' | 'WiFi';
  lastUpdate: Date;
  firmwareVersion: string;
  status?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  message: string;
  access_token: string;
  token_type: string;
  user: User;
}

export interface CaregiverInvite {
  email: string;
  token: string;
  created_at?: string;
}

export interface DeviceAssignRequest {
  phone_number: string;
  nickname?: string;
}

export interface ApiDevicesResponse {
  own: Device[];
  caregiving: Device[];
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface UpdatePasswordRequest {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface CaregiverAcceptRequest {
  token: string;
  name: string;
  password: string;
  password_confirmation: string;
}
