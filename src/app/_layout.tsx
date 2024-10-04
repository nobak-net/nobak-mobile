// import { Stack } from 'expo-router/stack';
// import { Tabs } from 'expo-router/tabs';
import * as React from 'react';
import { Slot } from 'expo-router';
import { AuthProvider, AppProvider } from '@/src/context';

import * as SplashScreen from 'expo-splash-screen';
// import AppConfig from '../utils/AppConfig';
import { initApp } from '@/src/utils';
// import { router } from 'expo-router'
// import { Layout, Logo } from 'nobak-native-design-system';
import { router } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'sign_in',
};

import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {};
const Layout = () => {
  
  React.useEffect(() => {
  router.push('/(app)')
  }, [])

  return (
    <Slot />
  )
}

export default function Root() {
  const [isReady, setIsReady] = React.useState(false);
  React.useEffect(() => {
    const initializeApp = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await initApp();
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setIsReady(true);
        
        SplashScreen.hideAsync();
      }
    };

    initializeApp();
    
  }, []);

  if (!isReady) {
    // router.push('/offline')
    return null; // Or a custom loading component
  }

  return (
    <AppProvider>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </AppProvider>
  );
}
