
import { StateCreator } from 'zustand';
import { AuthState } from './types';
import { User } from '../types';
import { apiService } from '../services/api';
import { authService } from '../services/auth-service';
import { logger } from '../utils/logger';

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
    // Clear the access token
    authService.clearToken();
    
    set({ 
      user: null, 
      isAuthenticated: false
    });
    
    // Redirect to login after logout
    window.location.href = '/login';
  },
  
  fetchUserData: async () => {
    try {
      // Check if we have a valid token before making the request
      if (!authService.hasValidToken()) {
        logger.info('No valid token found, user not authenticated');
        set({ isAuthenticated: false, user: null });
        return;
      }

      get().setLoading(true);
      const userData = await apiService.getUser();
      if (isValidUser(userData)) {
        set({ user: userData, isAuthenticated: true });
        logger.debug('User data fetched successfully');
      } else {
        logger.warn('Invalid user data received from API', userData);
        set({ isAuthenticated: false, user: null });
      }
    } catch (error) {
      logger.error('Failed to fetch user data', error);
      
      // If we get 401 Unauthorized, clear the token and redirect to login
      if (error instanceof Error && (error.message.includes('401') || error.message.includes('Unauthenticated'))) {
        logger.security('Token appears to be invalid, clearing and redirecting to login');
        authService.clearToken();
        set({ isAuthenticated: false, user: null });
        window.location.href = '/login';
      } else {
        set({ isAuthenticated: false, user: null });
      }
    } finally {
      get().setLoading(false);
    }
  },
  
  updateUser: async (data) => {
    try {
      await apiService.updateUser(data);
      await get().fetchUserData();
      logger.info('User data updated successfully');
    } catch (error) {
      logger.error('Failed to update user', error);
      throw error;
    }
  },
  
  updatePassword: async (data) => {
    try {
      await apiService.updatePassword(data);
      logger.info('Password updated successfully');
    } catch (error) {
      logger.error('Failed to update password', error);
      throw error;
    }
  },
  
  deleteUser: async (password) => {
    try {
      await apiService.deleteUser(password);
      logger.info('User account deleted successfully');
      get().logout();
    } catch (error) {
      logger.error('Failed to delete user', error);
      throw error;
    }
  },
  
  validateInvite: async (token: string) => {
    try {
      const result = await apiService.validateInvite(token);
      logger.debug('Invite validation completed');
      return result;
    } catch (error) {
      logger.error('Failed to validate invite', error);
      throw error;
    }
  }
});
