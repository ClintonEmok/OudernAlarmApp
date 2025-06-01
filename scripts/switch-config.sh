
#!/bin/bash

if [ "$1" = "dev" ]; then
    echo "🔄 Switching to development configuration..."
    cp capacitor.config.dev.ts capacitor.config.ts
    echo "✅ Development configuration active"
    echo "   - Hot reload enabled"
    echo "   - Connected to Lovable sandbox"
elif [ "$1" = "prod" ]; then
    echo "🔄 Switching to production configuration..."
    cp capacitor.config.ts capacitor.config.prod.ts 2>/dev/null || true
    cat > capacitor.config.ts << 'EOF'
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.20e6451330784d2184e7e778b8320a52',
  appName: 'Ouderen Alarm',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#3B82F6',
      showSpinner: false,
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
      iconColor: "#3B82F6"
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#3B82F6",
      sound: "beep.wav"
    },
    Geolocation: {
      permissions: ["location"]
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#3B82F6"
    },
    App: {
      launchAutoHide: false
    }
  },
  ios: {
    scheme: 'OuderenAlarm'
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      releaseType: 'AAB'
    }
  }
};

export default config;
EOF
    echo "✅ Production configuration active"
    echo "   - Standalone app mode"
    echo "   - Ready for store deployment"
else
    echo "Usage: ./scripts/switch-config.sh [dev|prod]"
    echo ""
    echo "dev  - Switch to development configuration (hot reload)"
    echo "prod - Switch to production configuration (standalone)"
fi
