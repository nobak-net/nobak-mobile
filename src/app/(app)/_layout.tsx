// import { router, Stack } from 'expo-router';
import { View, TouchableOpacity } from 'react-native'
import { useSession } from '../../context/AuthContext';
import { Tabs } from 'expo-router/tabs';
import { Symbol } from 'nobak-native-design-system';
import { WalletProvider } from '../../context/WalletContext';
import { router } from 'expo-router'
import { colors, TabButton } from 'nobak-native-design-system';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

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
          options={
            {
              headerShown: false,
              tabBarButton: (props) => (
                <TabButton
                  {...props}
                  text="Account"
                  symbol="Star"

                />
              ),
            }
          }
        />
        <Tabs.Screen
          name="apps"
          options={
            {
              headerShown: false,
              tabBarButton: (props) => (
                <TabButton
                  {...props}
                  text="Discover"
                  symbol="World"
                />
              ),
            }} />
        <Tabs.Screen
          name="settings"
          options={
            {
              headerShown: false,
              tabBarButton: (props) => (
                <TabButton
                  {...props}
                  text="Settings"
                  symbol="Chip"
                />
              ),
            }} />
        <Tabs.Screen
          name="result"
          options={{
            headerShown: false,
            href: null,
          }} />
      </ Tabs>
    </WalletProvider>
  </>
}
