
import { httpClient } from './http-client';

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
      const response = await httpClient.post('/login', { email, password }, false);
      
      // Store access token if login is successful
      if (response && response.access_token) {
        localStorage.setItem('access_token', response.access_token);
        console.log('Access token stored successfully');
      }
      
      return response;
    } catch (error) {
      // If CSRF error, try once more with a fresh token
      if (error instanceof Error && error.message.includes('CSRF')) {
        console.log('CSRF error detected, retrying login...');
        // Wait a moment and try again
        await new Promise(resolve => setTimeout(resolve, 500));
        const retryResponse = await httpClient.post('/login', { email, password }, false);
        
        // Store access token on retry success
        if (retryResponse && retryResponse.access_token) {
          localStorage.setItem('access_token', retryResponse.access_token);
          console.log('Access token stored successfully on retry');
        }
        
        return retryResponse;
      }
      throw error;
    }
  }

  async logout() {
    try {
      const response = await httpClient.post('/logout');
      // Clear access token on successful logout
      localStorage.removeItem('access_token');
      console.log('Access token cleared on logout');
      return response;
    } catch (error) {
      // If logout fails due to CSRF, still clear local state
      console.warn('Logout request failed, but clearing local state:', error);
      localStorage.removeItem('access_token');
      console.log('Access token cleared after failed logout');
      return null;
    }
  }

  async validateInvite(token: string) {
    return httpClient.get(`/invites/validate?token=${token}`, false);
  }

  // Helper method to check if user has valid token
  hasValidToken(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  // Helper method to clear token (for manual logout or token expiry)
  clearToken(): void {
    localStorage.removeItem('access_token');
    console.log('Access token manually cleared');
  }
}

export const authService = new AuthService();
