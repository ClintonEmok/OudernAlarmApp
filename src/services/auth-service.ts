
import { httpClient } from './http-client';
import { tokenManager } from './token-manager';
import { securityUtils } from '../utils/env';

interface LoginResponse {
  access_token: string;
  user?: any;
  message?: string;
  expires_at?: number;
  refresh_token?: string;
}

class AuthService {
  async register(data: { 
    name: string; 
    email: string; 
    password: string; 
    password_confirmation: string;
  }) {
    return httpClient.post('/register', data, false);
  }

  async login(email: string, password: string) {
    try {
      const response = await httpClient.post('/login', { email, password }, false) as LoginResponse;
      
      if (response && response.access_token) {
        tokenManager.setTokens({
          access_token: response.access_token,
          expires_at: response.expires_at,
          refresh_token: response.refresh_token
        });
        securityUtils.log('Login successful, tokens stored');
      }
      
      return response;
    } catch (error) {
      if (error instanceof Error && error.message.includes('CSRF')) {
        securityUtils.log('CSRF error detected, retrying login...');
        await new Promise(resolve => setTimeout(resolve, 500));
        const retryResponse = await httpClient.post('/login', { email, password }, false) as LoginResponse;
        
        if (retryResponse && retryResponse.access_token) {
          tokenManager.setTokens({
            access_token: retryResponse.access_token,
            expires_at: retryResponse.expires_at,
            refresh_token: retryResponse.refresh_token
          });
          securityUtils.log('Login successful on retry, tokens stored');
        }
        
        return retryResponse;
      }
      throw error;
    }
  }

  async logout() {
    try {
      const response = await httpClient.post('/logout');
      tokenManager.clearTokens();
      securityUtils.log('Logout successful, tokens cleared');
      return response;
    } catch (error) {
      securityUtils.error('Logout request failed, but clearing local state:', error);
      tokenManager.clearTokens();
      securityUtils.log('Tokens cleared after failed logout');
      return null;
    }
  }

  async validateInvite(token: string) {
    return httpClient.get(`/invites/validate?token=${encodeURIComponent(token)}`, false);
  }

  hasValidToken(): boolean {
    return tokenManager.hasValidToken();
  }

  async getValidToken(): Promise<string | null> {
    return tokenManager.getValidToken();
  }

  clearToken(): void {
    tokenManager.clearTokens();
    securityUtils.log('Tokens manually cleared');
  }
}

export const authService = new AuthService();
