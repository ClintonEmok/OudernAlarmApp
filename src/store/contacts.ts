
import { StateCreator } from 'zustand';
import { ContactState } from './types';
import { Contact } from '../types';
import { apiService } from '../services/api';

export interface ContactActions {
  setCaregivers: (caregivers: Contact[]) => void;
  setPatients: (patients: Contact[]) => void;
  fetchCaregivers: () => Promise<void>;
  fetchPatients: () => Promise<void>;
  fetchPendingInvites: () => Promise<void>;
  inviteCaregiver: (email: string) => Promise<void>;
  removeCaregiver: (userId: number) => Promise<void>;
  acceptCaregiverInvite: (data: { token: string; name: string; password: string; password_confirmation: string }) => Promise<void>;
  updateCaregiverPriorities: (caregivers: Array<{ user_id: number; priority: number }>) => Promise<void>;
}

export type ContactSlice = ContactState & ContactActions;

export const createContactSlice: StateCreator<
  ContactSlice,
  [],
  [],
  ContactSlice
> = (set, get) => ({
  caregivers: [],
  patients: [],
  pendingInvites: [],
  
  setCaregivers: (caregivers) => set({ caregivers }),
  setPatients: (patients) => set({ patients }),
  
  fetchCaregivers: async () => {
    try {
      const caregivers = await apiService.getCaregivers();
      set({ caregivers: Array.isArray(caregivers) ? caregivers : [] });
    } catch (error) {
      console.error('Failed to fetch caregivers:', error);
      set({ caregivers: [] });
    }
  },
  
  fetchPatients: async () => {
    try {
      const patients = await apiService.getPatients();
      set({ patients: Array.isArray(patients) ? patients : [] });
    } catch (error) {
      console.error('Failed to fetch patients:', error);
      set({ patients: [] });
    }
  },
  
  fetchPendingInvites: async () => {
    try {
      const invites = await apiService.getPendingInvites();
      set({ pendingInvites: Array.isArray(invites) ? invites : [] });
    } catch (error) {
      console.error('Failed to fetch pending invites:', error);
      set({ pendingInvites: [] });
    }
  },
  
  inviteCaregiver: async (email: string) => {
    try {
      await apiService.inviteCaregiver(email);
      await get().fetchCaregivers();
      await get().fetchPendingInvites();
    } catch (error) {
      console.error('Failed to invite caregiver:', error);
      throw error;
    }
  },
  
  removeCaregiver: async (userId: number) => {
    try {
      await apiService.removeCaregiver(userId);
      await get().fetchCaregivers();
    } catch (error) {
      console.error('Failed to remove caregiver:', error);
      throw error;
    }
  },
  
  acceptCaregiverInvite: async (data) => {
    try {
      await apiService.acceptCaregiverInvite(data);
    } catch (error) {
      console.error('Failed to accept caregiver invite:', error);
      throw error;
    }
  },
  
  updateCaregiverPriorities: async (caregivers) => {
    try {
      await apiService.updateCaregiverPriorities(caregivers);
      await get().fetchCaregivers();
    } catch (error) {
      console.error('Failed to update caregiver priorities:', error);
      throw error;
    }
  }
});
