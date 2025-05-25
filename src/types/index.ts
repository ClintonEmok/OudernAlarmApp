
export interface Alert {
  id: string;
  type: 'SOS' | 'Fall' | 'Medical' | 'Geofence' | 'Battery';
  timestamp: Date;
  responder?: string;
  isFalseAlarm: boolean;
  status: 'Active' | 'Responding' | 'Resolved';
  location?: string;
}

export interface Contact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  priority: number;
  isEmergencyContact: boolean;
}

export interface DeviceInfo {
  batteryLevel: number;
  signalStrength: number;
  connectionType: '5G' | '4G' | 'WiFi';
  lastUpdate: Date;
  deviceId: string;
  firmwareVersion: string;
}

export interface Geofence {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  isActive: boolean;
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  time: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  isActive: boolean;
  type: 'Medication' | 'Appointment' | 'Activity';
}
