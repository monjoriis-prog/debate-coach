
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fortesocial.app',
  appName: 'FORTE',
  webDir: 'out',
  server: {
    url: 'https://debate-coach-seven.vercel.app',
    cleartext: true,
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#f8faf8',
    preferredContentMode: 'mobile',
  },
};

export default config;