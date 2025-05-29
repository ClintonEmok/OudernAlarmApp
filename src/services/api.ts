
import { authService } from './auth-service';
import { userService } from './user-service';
import { caregiverService } from './caregiver-service';
import { deviceService } from './device-service';

// Re-export all interfaces
export type { ApiError, DeviceConflictError } from './http-client';

class ApiService {
  // Authentication
  async register(data: { 
    name: string; 
    email: string; 
    password: string; 
    password_confirmation: string;
  }) {
    return authService.register(data);
  }

  async login(email: string, password: string) {
    return authService.login(email, password);
  }

  async logout() {
    return authService.logout();
  }

  async validateInvite(token: string) {
    return authService.validateInvite(token);
  }

  // User Management
  async getUser() {
    return userService.getUser();
  }

  async updateUser(data: Partial<{ name: string; email: string; phone_number: string }>) {
    return userService.updateUser(data);
  }

  async updatePassword(data: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }) {
    return userService.updatePassword(data);
  }

  async deleteUser(password: string) {
    return userService.deleteUser(password);
  }

  // Caregiver Management
  async getCaregivers() {
    return caregiverService.getCaregivers();
  }

  async getPatients() {
    return caregiverService.getPatients();
  }

  async updateCaregiverPriorities(caregivers: Array<{ user_id: number; priority: number }>) {
    return caregiverService.updateCaregiverPriorities(caregivers);
  }

  async inviteCaregiver(email: string) {
    return caregiverService.inviteCaregiver(email);
  }

  async acceptCaregiverInvite(data: {
    token: string;
    name: string;
    password: string;
    password_confirmation: string;
  }) {
    return caregiverService.acceptCaregiverInvite(data);
  }

  async removeCaregiver(user_id: number) {
    return caregiverService.removeCaregiver(user_id);
  }

  async getPendingInvites() {
    return caregiverService.getPendingInvites();
  }

  // Device Management
  async getMyDevices() {
    return deviceService.getMyDevices();
  }

  async getOwnDevices() {
    return deviceService.getOwnDevices();
  }

  async getCaregivingDevices() {
    return deviceService.getCaregivingDevices();
  }

  async assignDevice(phone_number: string, nickname?: string) {
    return deviceService.assignDevice(phone_number, nickname);
  }

  async getDevice(id: number) {
    return deviceService.getDevice(id);
  }

  async unassignDevice(id: number) {
    return deviceService.unassignDevice(id);
  }

  async getDeviceAlarms() {
    return deviceService.getDeviceAlarms();
  }

  async getDeviceAlarm(id: number) {
    return deviceService.getDeviceAlarm(id);
  }

  async requestDeviceAccess(phone_number: string, message?: string) {
    return deviceService.requestDeviceAccess(phone_number, message);
  }
}

export const apiService = new ApiService();
