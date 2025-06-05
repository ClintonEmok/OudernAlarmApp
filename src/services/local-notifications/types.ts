
export interface NotificationPayload {
  title: string;
  body: string;
  data?: any;
}

export interface LocalNotificationPermissionStatus {
  display: 'granted' | 'denied' | 'prompt';
}

// Helper function to normalize permission states
export const normalizePermissionState = (state: string): 'granted' | 'denied' | 'prompt' => {
  if (state === 'granted') return 'granted';
  if (state === 'denied') return 'denied';
  return 'prompt';
};
