
import { env, securityUtils } from '../utils/env';
import { tokenManager } from './token-manager';
import { csrfManager } from './csrf-manager';

interface RequestOptions {
  method: string;
  headers: Record<string, string>;
  body?: string;
  credentials: RequestCredentials;
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

    // Add CSRF token for state-changing operations
    if (options.method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method.toUpperCase())) {
      const csrfToken = await csrfManager.getToken();
      if (csrfToken) {
        headers['X-XSRF-TOKEN'] = csrfToken;
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
      // Clear invalid tokens
      tokenManager.clearTokens();
      throw new Error('Authentication required');
    }

    if (response.status === 419) {
      // CSRF token mismatch
      csrfManager.clearToken();
      throw new Error('CSRF token mismatch');
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = data.message || data.error || `HTTP ${response.status}`;
        securityUtils.error('API Error:', errorMessage);
        throw new Error(errorMessage);
      }

      securityUtils.log('Response data received:', securityUtils.sanitizeForLogging(data));
      return data;
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
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
    
    securityUtils.log(`POST ${endpoint}`, securityUtils.sanitizeForLogging(data));
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

  async delete(endpoint: string, requireAuth = true) {
    const requestOptions = await this.buildRequest(endpoint, { method: 'DELETE' }, requireAuth);
    const response = await fetch(`${this.baseURL}${endpoint}`, requestOptions);
    return this.handleResponse(response);
  }
}

export const httpClient = new HttpClient();
