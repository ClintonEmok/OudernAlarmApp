
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface DeviceConflictError extends ApiError {
  device_owner?: string;
  device_id?: number;
  suggestions?: string[];
}

export class ResponseHandler {
  async handleResponse<T>(response: Response): Promise<T> {
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
}
