
const BASE_URL = 'https://api.ouderen-alarmering.nl';

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

class ApiService {
  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
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
      const error: ApiError = await response.json();
      throw new Error(error.message || 'API request failed');
    }
    return response.json();
  }

  // Authentication
  async login(email: string, password: string) {
    const response = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ email, password }),
    });
    return this.handleResponse(response);
  }

  async register(data: { name: string; email: string; password: string; password_confirmation: string }) {
    const response = await fetch(`${BASE_URL}/api/register`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async logout() {
    const response = await fetch(`${BASE_URL}/api/logout`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // User
  async getUser() {
    const response = await fetch(`${BASE_URL}/api/user`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async updateUser(data: Partial<{ name: string; email: string; phone_number: string }>) {
    const response = await fetch(`${BASE_URL}/api/user`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  // Caregivers
  async getCaregivers() {
    const response = await fetch(`${BASE_URL}/api/user/caregivers`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getPatients() {
    const response = await fetch(`${BASE_URL}/api/user/patients`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async inviteCaregiver(email: string) {
    const response = await fetch(`${BASE_URL}/api/caregivers/invite`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email }),
    });
    return this.handleResponse(response);
  }

  async removeCaregiver(user_id: number) {
    const response = await fetch(`${BASE_URL}/api/caregivers/remove`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ user_id }),
    });
    return this.handleResponse(response);
  }

  // Device Alarms
  async getDeviceAlarms() {
    const response = await fetch(`${BASE_URL}/api/device-alarms`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Devices
  async getMyDevices() {
    const response = await fetch(`${BASE_URL}/api/my-devices`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async assignDevice(phone_number: string, nickname?: string) {
    const response = await fetch(`${BASE_URL}/api/devices/assign`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ phone_number, nickname }),
    });
    return this.handleResponse(response);
  }

  async unassignDevice(id: number) {
    const response = await fetch(`${BASE_URL}/api/devices/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();
