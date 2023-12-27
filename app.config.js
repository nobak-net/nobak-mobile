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
      WC_ENV_PROJECT_ID: process.env.WC_ENV_PROJECT_ID,
      NODE_ENV: process.env.NODE_ENV,
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