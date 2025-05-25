
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
  id: string;
  phone_number: string;
  nickname?: string;
  batteryLevel: number;
  signalStrength: number;
  connectionType: '5G' | '4G' | 'WiFi';
  lastUpdate: Date;
  firmwareVersion: string;
  // Additional properties that might come from the API
  status?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
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
}

export interface DeviceAssignRequest {
  phone_number: string;
  nickname?: string;
}
