
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.20e6451330784d2184e7e778b8320a52',
  appName: 'ouderen-alarm',
  webDir: 'dist',
  server: {
    url: 'https://20e64513-3078-4d21-84e7-e778b8320a52.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#3B82F6',
      showSpinner: false
    }
  }
};

export default config;
