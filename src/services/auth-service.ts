
import { httpClient } from './http-client';
import { tokenManager } from './token-manager';

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
      // First attempt with normal CSRF handling
      const response = await httpClient.post('/login', { email, password }, false) as LoginResponse;
      
      // Store tokens if login is successful
      if (response && response.access_token) {
        tokenManager.setTokens({
          access_token: response.access_token,
          expires_at: response.expires_at,
          refresh_token: response.refresh_token
        });
        console.log('Login successful, tokens stored');
      }
      
      return response;
    } catch (error) {
      // If CSRF error, try once more with a fresh token
      if (error instanceof Error && error.message.includes('CSRF')) {
        console.log('CSRF error detected, retrying login...');
        // Wait a moment and try again
        await new Promise(resolve => setTimeout(resolve, 500));
        const retryResponse = await httpClient.post('/login', { email, password }, false) as LoginResponse;
        
        // Store tokens on retry success
        if (retryResponse && retryResponse.access_token) {
          tokenManager.setTokens({
            access_token: retryResponse.access_token,
            expires_at: retryResponse.expires_at,
            refresh_token: retryResponse.refresh_token
          });
          console.log('Login successful on retry, tokens stored');
        }
        
        return retryResponse;
      }
      throw error;
    }
  }

  async logout() {
    try {
      const response = await httpClient.post('/logout');
      // Clear tokens on successful logout
      tokenManager.clearTokens();
      console.log('Logout successful, tokens cleared');
      return response;
    } catch (error) {
      // If logout fails due to CSRF, still clear local state
      console.warn('Logout request failed, but clearing local state:', error);
      tokenManager.clearTokens();
      console.log('Tokens cleared after failed logout');
      return null;
    }
  }

  async validateInvite(token: string) {
    return httpClient.get(`/invites/validate?token=${token}`, false);
  }

  // Helper method to check if user has valid token
  hasValidToken(): boolean {
    return tokenManager.hasValidToken();
  }

  // Helper method to get valid token (with automatic refresh)
  async getValidToken(): Promise<string | null> {
    return tokenManager.getValidToken();
  }

  // Helper method to clear token (for manual logout or token expiry)
  clearToken(): void {
    tokenManager.clearTokens();
    console.log('Tokens manually cleared');
  }
}

export const authService = new AuthService();
