
import { Device } from '../../types';

export interface DeviceActions {
  setDevices: (devices: Device[]) => void;
  setSelectedDevice: (device: Device | null) => void;
  updateDeviceInfo: () => void;
  fetchDevices: () => Promise<void>;
  fetchOwnDevices: () => Promise<void>;
  fetchCaregivingDevices: () => Promise<void>;
  assignDevice: (phone_number: string, nickname?: string) => Promise<void>;
  unassignDevice: (id: number) => Promise<void>;
  getDevice: (id: number) => Promise<Device>;
  requestDeviceAccess: (phone_number: string, message?: string) => Promise<void>;
}
