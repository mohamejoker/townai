
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.163ef0d3f358425980543fe45d481a0d',
  appName: 'town-smart-reach',
  webDir: 'dist',
  server: {
    url: 'https://163ef0d3-f358-4259-8054-3fe45d481a0d.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
