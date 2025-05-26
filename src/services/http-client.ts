
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

      console.log(`=== HTTP REQUEST START ===`);
      console.log(`Making ${method} request to ${endpoint}`, {
        fullUrl: `${BASE_URL}${endpoint}`,
        hasCsrfToken: !!this.csrfManager.getToken(),
        shouldUseCsrf,
        retryCount,
        crossOrigin: !this.csrfManager.hasCsrfSupport(),
        includeAuth,
        hasAuthToken: includeAuth ? !!localStorage.getItem('access_token') : 'not checked'
      });
      console.log('Request headers:', requestOptions.headers);
      console.log('Request body:', requestOptions.body);

      const response = await fetch(`${BASE_URL}${endpoint}`, requestOptions);
      
      console.log(`=== HTTP RESPONSE ===`);
      console.log('Response status:', response.status, response.statusText);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      console.log('Response ok:', response.ok);
      
      // Clone response to read it twice (once for logging, once for processing)
      const responseClone = response.clone();
      let responseText = '';
      try {
        responseText = await responseClone.text();
        console.log('Response body (raw):', responseText);
        
        // Try to parse as JSON for better logging
        if (responseText) {
          try {
            const parsedResponse = JSON.parse(responseText);
            console.log('Response body (parsed):', parsedResponse);
          } catch (parseError) {
            console.log('Response is not valid JSON');
          }
        }
      } catch (readError) {
        console.log('Could not read response body for logging');
      }
      
      const result = this.responseHandler.handleResponse<T>(response);
      console.log(`=== HTTP REQUEST END ===`);
      return result;
    } catch (error) {
      console.error(`=== HTTP REQUEST ERROR ===`);
      console.error('Request failed:', error);
      console.error('Error type:', typeof error);
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
      
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
