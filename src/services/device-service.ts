
import { httpClient } from './http-client';

class DeviceService {
  async getMyDevices() {
    // Use the correct endpoint for own devices
    return httpClient.get('/my-devices/own');
  }

  async getOwnDevices() {
    return httpClient.get('/my-devices/own');
  }

  async getCaregivingDevices() {
    return httpClient.get('/my-devices/caregiving');
  }

  async assignDevice(phone_number: string, nickname?: string) {
    return httpClient.post('/devices/assign', { phone_number, nickname });
  }

  async getDevice(id: number) {
    return httpClient.get(`/devices/${id}`);
  }

  async unassignDevice(id: number) {
    return httpClient.delete(`/devices/${id}`);
  }

  async getDeviceAlarms() {
    return httpClient.get('/device-alarms');
  }

  async getDeviceAlarm(id: number) {
    return httpClient.get(`/device-alarms/${id}`);
  }

  async requestDeviceAccess(phone_number: string, message?: string) {
    return httpClient.post('/devices/request-access', { phone_number, message });
  }
}

export const deviceService = new DeviceService();
