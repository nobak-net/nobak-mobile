// import { router, Stack } from 'expo-router';
import { View } from 'react-native'
import { useSession } from '../../context/AuthContext';
import { Tabs } from 'expo-router/tabs';
import { Symbol } from 'nobak-native-design-system';
import { WalletProvider } from '../../context/WalletContext';
import { colors } from 'nobak-native-design-system';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AppLayout() {
  const { session, isLoading } = useSession();
  const insets = useSafeAreaInsets();

  // This layout can be deferred because it's not the root layout.
  return <>
    <WalletProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary[100],
          tabBarActiveBackgroundColor: colors.primary[2400],

          tabBarAllowFontScaling: false,
          tabBarStyle: {
            height: 100,
            paddingBottom: insets.bottom,
            backgroundColor: colors.primary[2400],
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "bold",
            marginBottom: 0,
            textTransform: 'uppercase',
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Account",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Symbol type="Star" color={color} />
            ),
          }} />
        <Tabs.Screen
          name="apps"
          options={{
            title: "Discover",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Symbol type="World" color={color} />
            ),
          }} />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Symbol type="Chip" color={color} />
            ),
          }} />
        <Tabs.Screen
          name="result"
          options={{
            href: null,
          }} />
      </ Tabs>
    </WalletProvider>
  </>
}
