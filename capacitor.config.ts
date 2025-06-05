import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.clintonemok.ouderenalarm",
  appName: "Ouderen Alarm",
  webDir: "dist",
  // Remove server configuration for production builds
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#3B82F6",
      showSpinner: false,
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      splashFullScreen: true,
      splashImmersive: true,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
      iconColor: "#3B82F6",
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#3B82F6",
      sound: "beep.wav",
    },
    Geolocation: {
      permissions: ["location"],
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#3B82F6",
    },
    App: {
      launchAutoHide: false,
    },
  },
  ios: {
    scheme: "OuderenAlarm",
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      releaseType: "AAB",
    },
  },
};

export default config;
