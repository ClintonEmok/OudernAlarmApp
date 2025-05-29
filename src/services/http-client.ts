
import { env, securityUtils } from '../utils/env';
import { tokenManager } from './token-manager';

interface RequestOptions {
  method: string;
  headers: Record<string, string>;
  body?: string;
  credentials: RequestCredentials;
}

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export class DeviceConflictError extends ApiError {
  constructor(message: string) {
    super(message, 409);
    this.name = 'DeviceConflictError';
  }
}

class HttpClient {
  private baseURL: string;

  constructor() {
    this.baseURL = env.API_BASE_URL;
  }

  private async buildRequest(endpoint: string, options: Partial<RequestOptions> = {}, requireAuth = true): Promise<RequestOptions> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...options.headers
    };

    // Add auth token if required and available
    if (requireAuth) {
      const token = await tokenManager.getValidToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return {
      method: options.method || 'GET',
      headers,
      credentials: 'include',
      ...(options.body && { body: options.body })
    };
  }

  private async handleResponse(response: Response) {
    securityUtils.log(`Response status: ${response.status}`);
    
    if (response.status === 401) {
      tokenManager.clearTokens();
      throw new ApiError('Authentication required', 401);
    }

    if (response.status === 419) {
      throw new ApiError('CSRF token mismatch', 419);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = data.message || data.error || `HTTP ${response.status}`;
        securityUtils.error('API Error:', errorMessage);
        
        if (response.status === 409) {
          throw new DeviceConflictError(errorMessage);
        }
        
        throw new ApiError(errorMessage, response.status);
      }

      securityUtils.log('Response data received');
      return data;
    }

    if (!response.ok) {
      throw new ApiError(`HTTP ${response.status}: ${response.statusText}`, response.status);
    }

    return response.text();
  }

  async get(endpoint: string, requireAuth = true) {
    const requestOptions = await this.buildRequest(endpoint, { method: 'GET' }, requireAuth);
    const response = await fetch(`${this.baseURL}${endpoint}`, requestOptions);
    return this.handleResponse(response);
  }

  async post(endpoint: string, data?: any, requireAuth = true) {
    const requestOptions = await this.buildRequest(
      endpoint, 
      { 
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined
      }, 
      requireAuth
    );
    
    securityUtils.log(`POST ${endpoint}`);
    const response = await fetch(`${this.baseURL}${endpoint}`, requestOptions);
    return this.handleResponse(response);
  }

  async put(endpoint: string, data?: any, requireAuth = true) {
    const requestOptions = await this.buildRequest(
      endpoint, 
      { 
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined
      }, 
      requireAuth
    );
    
    const response = await fetch(`${this.baseURL}${endpoint}`, requestOptions);
    return this.handleResponse(response);
  }

  async delete(endpoint: string, data?: any, requireAuth = true) {
    const requestOptions = await this.buildRequest(
      endpoint, 
      { 
        method: 'DELETE',
        body: data ? JSON.stringify(data) : undefined
      }, 
      requireAuth
    );
    
    const response = await fetch(`${this.baseURL}${endpoint}`, requestOptions);
    return this.handleResponse(response);
  }
}

export const httpClient = new HttpClient();
