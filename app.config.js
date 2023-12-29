import 'dotenv/config';

export default {
  expo: {
    name: 'nobak',
    slug: 'nobak',
    scheme: 'nobak',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    extra: {
      APP_ENV: process.env.APP_ENV,
      DEBUG: process.env.DEBUG,
      WC_ENV_PROJECT_ID: process.env.WC_ENV_PROJECT_ID,
      API_URL: process.env.API_URL,
      STELLAR_NETWORK: process.env.STELLAR_NETWORK,
      NETWORK_PASSPHRASE: process.env.NETWORK_PASSPHRASE,
      HORIZON_URL: process.env.HORIZON_URL
    },
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#080909',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.anonymous.mobilesigner',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#080909',
      },
      package: 'com.anonymous.mobilesigner',
    },
    web: {
      favicon: './assets/favicon.png',
    },
  },
};