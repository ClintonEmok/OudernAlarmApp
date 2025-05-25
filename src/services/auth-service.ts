
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
    return httpClient.post('/login', { email, password }, false);
  }

  async logout() {
    return httpClient.post('/logout');
  }

  async validateInvite(token: string) {
    return httpClient.get(`/invites/validate?token=${token}`, false);
  }
}

export const authService = new AuthService();
