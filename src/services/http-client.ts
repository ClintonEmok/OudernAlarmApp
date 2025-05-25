
import { CsrfManager } from './csrf-manager';
import { ResponseHandler } from './response-handler';
import { RequestBuilder } from './request-builder';

// Re-export types for backward compatibility
export type { ApiError, DeviceConflictError } from './response-handler';

const BASE_URL = 'https://api.ouderen-alarmering.nl/api';

class HttpClient {
  private csrfManager = new CsrfManager();
  private responseHandler = new ResponseHandler();
  private requestBuilder = new RequestBuilder();

  private async makeRequest<T>(
    method: string, 
    endpoint: string, 
    data?: any, 
    includeAuth = true, 
    retryCount = 0
  ): Promise<T> {
    const maxRetries = 1; // Reduced retries to avoid loops
    const needsCsrf = ['POST', 'PUT', 'DELETE'].includes(method.toUpperCase());

    // Only attempt CSRF for cross-origin if we have support
    const shouldUseCsrf = needsCsrf && this.csrfManager.hasCsrfSupport();

    // Get CSRF token if needed and supported
    if (shouldUseCsrf && (!this.csrfManager.getToken() || retryCount > 0)) {
      console.log('Getting CSRF token...');
      await this.csrfManager.getCsrfToken();
    }

    try {
      const requestOptions = this.requestBuilder.buildRequest(
        method,
        data,
        includeAuth,
        shouldUseCsrf,
        this.csrfManager.getToken()
      );

      console.log(`Making ${method} request to ${endpoint}`, {
        hasCsrfToken: !!this.csrfManager.getToken(),
        shouldUseCsrf,
        retryCount,
        crossOrigin: !this.csrfManager.hasCsrfSupport()
      });

      const response = await fetch(`${BASE_URL}${endpoint}`, requestOptions);
      return this.responseHandler.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error && error.message.includes('CSRF token mismatch') && retryCount < maxRetries && shouldUseCsrf) {
        console.log(`Retrying request after CSRF error (attempt ${retryCount + 1})`);
        // Clear token and retry with fresh one
        this.csrfManager.clearToken();
        return this.makeRequest<T>(method, endpoint, data, includeAuth, retryCount + 1);
      }
      
      // If it's a CSRF error and we've exhausted retries, provide helpful message
      if (error instanceof Error && error.message.includes('CSRF')) {
        throw new Error('Beveiligingsfout: De verbinding met de server kon niet worden beveiligd. Probeer de pagina te verversen.');
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
