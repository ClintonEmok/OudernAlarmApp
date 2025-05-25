const BASE_URL = 'https://api.ouderen-alarmering.nl/api';

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface DeviceConflictError extends ApiError {
  device_owner?: string;
  device_id?: number;
  suggestions?: string[];
}

class ApiService {
  private async getCsrfToken(): Promise<void> {
    try {
      await fetch('https://api.ouderen-alarmering.nl/sanctum/csrf-cookie', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
    }
  }

  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };

    if (includeAuth) {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      if (response.status === 401) {
        // Unauthenticated - redirect to login
        localStorage.removeItem('access_token');
        window.location.href = '/login';
        throw new Error('Unauthenticated');
      }
      
      if (response.status === 419) {
        // CSRF token mismatch - retry with new token
        await this.getCsrfToken();
        throw new Error('CSRF token mismatch. Probeer opnieuw in te loggen.');
      }
      
      if (response.status === 409) {
        // Device conflict - already assigned to another account
        try {
          const error: DeviceConflictError = await response.json();
          const conflictError = new Error(error.message || 'Dit apparaat is al gekoppeld aan een ander account');
          (conflictError as any).isDeviceConflict = true;
          (conflictError as any).deviceOwner = error.device_owner;
          (conflictError as any).deviceId = error.device_id;
          (conflictError as any).suggestions = error.suggestions || [
            'Vraag de huidige eigenaar om u uit te nodigen als zorgverlener',
            'Controleer of u het juiste telefoonnummer heeft ingevoerd',
            'Neem contact op met de beheerder voor toegang'
          ];
          throw conflictError;
        } catch (parseError) {
          const conflictError = new Error('Dit apparaat is al gekoppeld aan een ander account');
          (conflictError as any).isDeviceConflict = true;
          throw conflictError;
        }
      }
      
      try {
        const error: ApiError = await response.json();
        throw new Error(error.message || 'API request failed');
      } catch {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    }
    return response.json();
  }

  // Authentication
  async register(data: { 
    name: string; 
    email: string; 
    password: string; 
    password_confirmation: string;
  }) {
    await this.getCsrfToken();
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: this.getHeaders(false),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async login(email: string, password: string) {
    await this.getCsrfToken();
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: this.getHeaders(false),
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    return this.handleResponse(response);
  }

  async logout() {
    const response = await fetch(`${BASE_URL}/logout`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  // User Management
  async getUser() {
    const response = await fetch(`${BASE_URL}/user`, {
      headers: this.getHeaders(),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  async updateUser(data: Partial<{ name: string; email: string; phone_number: string }>) {
    const response = await fetch(`${BASE_URL}/user`, {
      method: 'PUT',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async updatePassword(data: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }) {
    const response = await fetch(`${BASE_URL}/user/password`, {
      method: 'PUT',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async deleteUser(password: string) {
    const response = await fetch(`${BASE_URL}/user`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ password }),
    });
    return this.handleResponse(response);
  }

  async getCaregivers() {
    const response = await fetch(`${BASE_URL}/user/caregivers`, {
      headers: this.getHeaders(),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  async getPatients() {
    const response = await fetch(`${BASE_URL}/user/patients`, {
      headers: this.getHeaders(),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  async updateCaregiverPriorities(caregivers: Array<{ user_id: number; priority: number }>) {
    const response = await fetch(`${BASE_URL}/user/caregivers/update`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ caregivers }),
    });
    return this.handleResponse(response);
  }

  // Caregiver Flows
  async validateInvite(token: string) {
    const response = await fetch(`${BASE_URL}/invites/validate?token=${token}`, {
      headers: this.getHeaders(false),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  async inviteCaregiver(email: string) {
    const response = await fetch(`${BASE_URL}/caregivers/invite`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ email }),
    });
    return this.handleResponse(response);
  }

  async acceptCaregiverInvite(data: {
    token: string;
    name: string;
    password: string;
    password_confirmation: string;
  }) {
    const response = await fetch(`${BASE_URL}/caregivers/accept`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async removeCaregiver(user_id: number) {
    const response = await fetch(`${BASE_URL}/caregivers/remove`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ user_id }),
    });
    return this.handleResponse(response);
  }

  async getPendingInvites() {
    const response = await fetch(`${BASE_URL}/caregivers/invites/pending`, {
      headers: this.getHeaders(),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  // Devices
  async getMyDevices() {
    const response = await fetch(`${BASE_URL}/my-devices`, {
      headers: this.getHeaders(),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  async getOwnDevices() {
    const response = await fetch(`${BASE_URL}/my-devices/own`, {
      headers: this.getHeaders(),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  async getCaregivingDevices() {
    const response = await fetch(`${BASE_URL}/my-devices/caregiving`, {
      headers: this.getHeaders(),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  async assignDevice(phone_number: string, nickname?: string) {
    const response = await fetch(`${BASE_URL}/devices/assign`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ phone_number, nickname }),
    });
    return this.handleResponse(response);
  }

  async getDevice(id: number) {
    const response = await fetch(`${BASE_URL}/devices/${id}`, {
      headers: this.getHeaders(),
      credentials: 'include',
    });
    return this.handleResponse<any>(response);
  }

  async unassignDevice(id: number) {
    const response = await fetch(`${BASE_URL}/devices/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  // Device Alarms
  async getDeviceAlarms() {
    const response = await fetch(`${BASE_URL}/device-alarms`, {
      headers: this.getHeaders(),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  async getDeviceAlarm(id: number) {
    const response = await fetch(`${BASE_URL}/device-alarms/${id}`, {
      headers: this.getHeaders(),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  async requestDeviceAccess(phone_number: string, message?: string) {
    const response = await fetch(`${BASE_URL}/devices/request-access`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ phone_number, message }),
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();
