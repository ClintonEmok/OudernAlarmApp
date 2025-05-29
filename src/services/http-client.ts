
import { CsrfManager } from './csrf-manager';
import { ResponseHandler } from './response-handler';
import { RequestBuilder } from './request-builder';
import { env, securityUtils } from '../utils/env';

// Re-export types for backward compatibility
export type { ApiError, DeviceConflictError } from './response-handler';

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
    const maxRetries = 1;
    const needsCsrf = ['POST', 'PUT', 'DELETE'].includes(method.toUpperCase());
    const shouldUseCsrf = needsCsrf && this.csrfManager.hasCsrfSupport();

    if (shouldUseCsrf && (!this.csrfManager.getToken() || retryCount > 0)) {
      securityUtils.log('Getting CSRF token...');
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

      // Secure logging - only in development
      if (env.IS_DEVELOPMENT) {
        securityUtils.log(`=== HTTP REQUEST START ===`);
        securityUtils.log(`Making ${method} request to ${endpoint}`, {
          fullUrl: `${env.API_BASE_URL}${endpoint}`,
          hasCsrfToken: !!this.csrfManager.getToken(),
          shouldUseCsrf,
          retryCount,
          crossOrigin: !this.csrfManager.hasCsrfSupport(),
          includeAuth,
          hasAuthToken: includeAuth ? !!localStorage.getItem('access_token') : 'not checked'
        });
        securityUtils.log('Request headers:', securityUtils.sanitizeForLogging(requestOptions.headers));
        securityUtils.log('Request body:', securityUtils.sanitizeForLogging(requestOptions.body));
      }

      const response = await fetch(`${env.API_BASE_URL}${endpoint}`, requestOptions);
      
      // Secure response logging
      if (env.IS_DEVELOPMENT) {
        securityUtils.log(`=== HTTP RESPONSE ===`);
        securityUtils.log('Response status:', response.status, response.statusText);
        securityUtils.log('Response ok:', response.ok);
        
        // Only log response body in development and sanitize it
        const responseClone = response.clone();
        try {
          const responseText = await responseClone.text();
          if (responseText) {
            try {
              const parsedResponse = JSON.parse(responseText);
              securityUtils.log('Response body (parsed):', securityUtils.sanitizeForLogging(parsedResponse));
            } catch (parseError) {
              securityUtils.log('Response is not valid JSON');
            }
          }
        } catch (readError) {
          securityUtils.log('Could not read response body for logging');
        }
      }
      
      const result = this.responseHandler.handleResponse<T>(response);
      securityUtils.log(`=== HTTP REQUEST END ===`);
      return result;
    } catch (error) {
      securityUtils.error(`HTTP Request failed for ${method} ${endpoint}`, error);
      
      if (error instanceof Error && error.message.includes('CSRF token mismatch') && retryCount < maxRetries && shouldUseCsrf) {
        securityUtils.log(`Retrying request after CSRF error (attempt ${retryCount + 1})`);
        this.csrfManager.clearToken();
        return this.makeRequest<T>(method, endpoint, data, includeAuth, retryCount + 1);
      }
      
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
