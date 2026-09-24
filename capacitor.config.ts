import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'mp-stgo',
  webDir: 'dist',
  android: {
    // Keep JS bridge usable while minimized (background location ticks)
    useLegacyBridge: true,
  },
};

export default config;
