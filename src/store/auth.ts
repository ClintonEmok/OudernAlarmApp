
import { StateCreator } from 'zustand';
import { AuthState } from './types';
import { User } from '../types';
import { apiService } from '../services/api';

// Type guard to check if response is a valid User object
const isValidUser = (userData: any): userData is User => {
  return userData && 
         typeof userData.id === 'number' &&
         typeof userData.name === 'string' &&
         typeof userData.email === 'string' &&
         typeof userData.created_at === 'string' &&
         typeof userData.updated_at === 'string';
};

export interface AuthActions {
  setUser: (user: User) => void;
  logout: () => void;
  fetchUserData: () => Promise<void>;
  updateUser: (data: Partial<{ name: string; email: string; phone_number: string }>) => Promise<void>;
  updatePassword: (data: { current_password: string; new_password: string; new_password_confirmation: string }) => Promise<void>;
  deleteUser: (password: string) => Promise<void>;
  validateInvite: (token: string) => Promise<any>;
}

export type AuthSlice = AuthState & AuthActions;

export const createAuthSlice: StateCreator<
  AuthSlice & { setLoading: (loading: boolean) => void },
  [],
  [],
  AuthSlice
> = (set, get) => ({
  user: null,
  isAuthenticated: false,
  
  setUser: (user) => set({ user, isAuthenticated: true }),
  
  logout: () => {
    set({ 
      user: null, 
      isAuthenticated: false
    });
    // Redirect to login after logout
    window.location.href = '/login';
  },
  
  fetchUserData: async () => {
    try {
      get().setLoading(true);
      const userData = await apiService.getUser();
      if (isValidUser(userData)) {
        set({ user: userData, isAuthenticated: true });
      } else {
        console.warn('Invalid user data received from API:', userData);
        set({ isAuthenticated: false, user: null });
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      set({ isAuthenticated: false, user: null });
    } finally {
      get().setLoading(false);
    }
  },
  
  updateUser: async (data) => {
    try {
      await apiService.updateUser(data);
      await get().fetchUserData();
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  },
  
  updatePassword: async (data) => {
    try {
      await apiService.updatePassword(data);
    } catch (error) {
      console.error('Failed to update password:', error);
      throw error;
    }
  },
  
  deleteUser: async (password) => {
    try {
      await apiService.deleteUser(password);
      get().logout();
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    }
  },
  
  validateInvite: async (token: string) => {
    try {
      return await apiService.validateInvite(token);
    } catch (error) {
      console.error('Failed to validate invite:', error);
      throw error;
    }
  }
});
