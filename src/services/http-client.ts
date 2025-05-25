
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
  private csrfToken: string | null = null;

  private getCsrfTokenFromCookie(): string | null {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'XSRF-TOKEN') {
        return decodeURIComponent(value);
      }
    }
    return null;
  }

  private async getCsrfToken(): Promise<void> {
    try {
      console.log('Fetching CSRF token...');
      await fetch('https://api.ouderen-alarmering.nl/sanctum/csrf-cookie', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      // Extract token from cookie after fetching
      this.csrfToken = this.getCsrfTokenFromCookie();
      console.log('CSRF token obtained:', this.csrfToken ? 'Yes' : 'No');
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
      this.csrfToken = null;
    }
  }

  private getHeaders(includeAuth = true, includeCsrf = false): HeadersInit {
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

    if (includeCsrf && this.csrfToken) {
      headers['X-CSRF-TOKEN'] = this.csrfToken;
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
        // CSRF token mismatch - clear token for retry
        console.log('CSRF token mismatch detected');
        this.csrfToken = null;
        throw new Error('CSRF token mismatch');
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

  private async makeRequest<T>(
    method: string, 
    endpoint: string, 
    data?: any, 
    includeAuth = true, 
    retryCount = 0
  ): Promise<T> {
    const maxRetries = 1;
    const needsCsrf = ['POST', 'PUT', 'DELETE'].includes(method.toUpperCase());

    // Get CSRF token if needed and not already available
    if (needsCsrf && !this.csrfToken) {
      await this.getCsrfToken();
    }

    try {
      const requestOptions: RequestInit = {
        method,
        headers: this.getHeaders(includeAuth, needsCsrf),
        credentials: 'include',
      };

      if (data) {
        requestOptions.body = JSON.stringify(data);
      }

      console.log(`Making ${method} request to ${endpoint}`, {
        hasCsrfToken: !!this.csrfToken,
        headers: requestOptions.headers
      });

      const response = await fetch(`${BASE_URL}${endpoint}`, requestOptions);
      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error && error.message.includes('CSRF token mismatch') && retryCount < maxRetries) {
        console.log(`Retrying request after CSRF error (attempt ${retryCount + 1})`);
        // Get fresh CSRF token and retry
        await this.getCsrfToken();
        return this.makeRequest<T>(method, endpoint, data, includeAuth, retryCount + 1);
      }
      throw error;
    }
  }

  async get<T>(endpoint: string, includeAuth = true): Promise<T> {
    return this.makeRequest<T>('GET', endpoint, undefined, includeAuth);
  }

  async post<T>(endpoint: string, data?: any, includeAuth = true): Promise<T> {
    return this.makeRequest<T>('POST', endpoint, data, includeAuth);
  }

  async put<T>(endpoint: string, data: any, includeAuth = true): Promise<T> {
    return this.makeRequest<T>('PUT', endpoint, data, includeAuth);
  }

  async delete<T>(endpoint: string, data?: any, includeAuth = true): Promise<T> {
    return this.makeRequest<T>('DELETE', endpoint, data, includeAuth);
  }
}

export const httpClient = new HttpClient();
