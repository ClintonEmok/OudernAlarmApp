
import { httpClient } from './http-client';

class CaregiverService {
  async getCaregivers() {
    return httpClient.get('/user/caregivers');
  }

  async getPatients() {
    return httpClient.get('/user/patients');
  }

  async updateCaregiverPriorities(caregivers: Array<{ user_id: number; priority: number }>) {
    return httpClient.post('/user/caregivers/update', { caregivers });
  }

  async reorderCaregivers(caregiver_ids: number[]) {
    return httpClient.patch('/caregivers/reorder', { caregiver_ids });
  }

  async inviteCaregiver(email: string) {
    return httpClient.post('/caregivers/invite', { email });
  }

  async acceptCaregiverInvite(data: {
    token: string;
    name: string;
    password: string;
    password_confirmation: string;
  }) {
    return httpClient.post('/caregivers/accept', data);
  }

  async removeCaregiver(user_id: number) {
    return httpClient.post('/caregivers/remove', { user_id });
  }

  async getPendingInvites() {
    return httpClient.get('/caregivers/invites/pending');
  }

  async validateInvite(token: string) {
    return httpClient.get(`/invites/validate?token=${token}`, false);
  }
}

export const caregiverService = new CaregiverService();
