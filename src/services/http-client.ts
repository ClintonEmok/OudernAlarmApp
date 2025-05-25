
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
    const maxRetries = 2;
    const needsCsrf = ['POST', 'PUT', 'DELETE'].includes(method.toUpperCase());

    // Get CSRF token if needed and not already available
    if (needsCsrf && (!this.csrfManager.getToken() || retryCount > 0)) {
      console.log('Getting fresh CSRF token...');
      await this.csrfManager.getCsrfToken();
      
      if (!this.csrfManager.getToken()) {
        console.warn('Could not obtain CSRF token, proceeding without it');
      }
    }

    try {
      const requestOptions = this.requestBuilder.buildRequest(
        method,
        data,
        includeAuth,
        needsCsrf,
        this.csrfManager.getToken()
      );

      console.log(`Making ${method} request to ${endpoint}`, {
        hasCsrfToken: !!this.csrfManager.getToken(),
        retryCount,
        headers: requestOptions.headers
      });

      const response = await fetch(`${BASE_URL}${endpoint}`, requestOptions);
      return this.responseHandler.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error && error.message.includes('CSRF token mismatch') && retryCount < maxRetries) {
        console.log(`Retrying request after CSRF error (attempt ${retryCount + 1})`);
        // Clear token and retry with fresh one
        this.csrfManager.clearToken();
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
