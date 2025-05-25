
import { httpClient } from './http-client';

class UserService {
  async getUser() {
    return httpClient.get('/user');
  }

  async updateUser(data: Partial<{ name: string; email: string; phone_number: string }>) {
    return httpClient.put('/user', data);
  }

  async updatePassword(data: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }) {
    return httpClient.put('/user/password', data);
  }

  async deleteUser(password: string) {
    return httpClient.delete('/user', { password });
  }
}

export const userService = new UserService();
