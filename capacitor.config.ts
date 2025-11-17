import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.konnektmycity.app',
  appName: 'Konnekt My City',
  webDir: 'public',
  server: {
    url: 'http://10.127.40.216:3000',  // 🌍 Your actual WiFi IP - phone can reach this!
    cleartext: true,  // Allow HTTP for development
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;
