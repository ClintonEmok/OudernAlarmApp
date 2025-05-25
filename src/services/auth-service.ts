
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
      return await httpClient.post('/login', { email, password }, false);
    } catch (error) {
      // If CSRF error, try once more with a fresh token
      if (error instanceof Error && error.message.includes('CSRF')) {
        console.log('CSRF error detected, retrying login...');
        // Wait a moment and try again
        await new Promise(resolve => setTimeout(resolve, 500));
        return await httpClient.post('/login', { email, password }, false);
      }
      throw error;
    }
  }

  async logout() {
    try {
      return await httpClient.post('/logout');
    } catch (error) {
      // If logout fails due to CSRF, still clear local state
      console.warn('Logout request failed, but clearing local state:', error);
      return null;
    }
  }

  async validateInvite(token: string) {
    return httpClient.get(`/invites/validate?token=${token}`, false);
  }
}

export const authService = new AuthService();
