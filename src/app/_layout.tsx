import { Stack } from 'expo-router/stack';
import { Tabs } from 'expo-router/tabs';
import * as React from 'react';
import { Slot } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import * as SplashScreen from 'expo-splash-screen';
import AppConfig from '../utils/AppConfig';
import { initApp } from '../utils';
import { router } from 'expo-router'
import { Layout, Logo } from 'nobak-native-design-system';

export const unstable_settings = {
  initialRouteName: 'sign_in',
};


export default function Root() {
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    const initializeApp = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await initApp();  // Assuming initApp is defined elsewhere
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
    return null; // Or a custom loading component
  }

  return (
    <AuthProvider>
        <Slot />
    </AuthProvider>
  );
}
