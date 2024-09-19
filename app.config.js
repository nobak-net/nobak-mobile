import 'dotenv/config';

export default {
  expo: {
    name: "nobak",
    slug: "nobak",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "nobak",
    userInterfaceStyle: "automatic",
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#080909',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.anonymous.nobak"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#080909"
      },
      package: "com.anonymous.nobak"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      "expo-localization"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      eas: {
        projectId: "c1d6df0d-a4ae-4ac9-9f09-57dc804f6165"
      },
      APP_ENV: process.env.APP_ENV,
      DEBUG: process.env.DEBUG,
      WC_ENV_PROJECT_ID: process.env.WC_ENV_PROJECT_ID,
      API_URL: process.env.API_URL,
      STELLAR_NETWORK: process.env.STELLAR_NETWORK,
      NETWORK_PASSPHRASE: process.env.NETWORK_PASSPHRASE,
      HORIZON_URL: process.env.HORIZON_URL,
      EXPO_ROUTER_APP_ROOT: process.env.EXPO_ROUTER_APP_ROOT || 'app'
    }
  }
};