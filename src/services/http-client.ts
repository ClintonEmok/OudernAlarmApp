
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

class HttpClient {
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

  async get<T>(endpoint: string, includeAuth = true): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: this.getHeaders(includeAuth),
      credentials: 'include',
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: any, includeAuth = true): Promise<T> {
    await this.getCsrfToken();
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(includeAuth),
      credentials: 'include',
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data: any, includeAuth = true): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(includeAuth),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string, data?: any, includeAuth = true): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(includeAuth),
      credentials: 'include',
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }
}

export const httpClient = new HttpClient();
