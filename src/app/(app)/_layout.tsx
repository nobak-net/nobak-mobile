// import { router, Stack } from 'expo-router';
import { View, TouchableOpacity } from 'react-native'
import { Tabs } from 'expo-router/tabs';
import { Symbol } from 'nobak-native-design-system';
import { WalletProvider } from '../../context';
import { router } from 'expo-router'
import { colors, TabButton } from 'nobak-native-design-system';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

export default function AppLayout() {
  const insets = useSafeAreaInsets();

  // This layout can be deferred because it's not the root layout.
  return <>
    <WalletProvider>
      <Tabs
        screenOptions={{
          tabBarAllowFontScaling: false,
          tabBarStyle: {
            height: 100,
            paddingBottom: insets.bottom,
          },

        }}

      >
        <Tabs.Screen
          name="index"
          options={
            {
              headerShown: false,
              tabBarStyle: {
                borderTopWidth: 0,
                backgroundColor: colors.primary[100],

              },
              tabBarButton: (props) => {
                return <TabButton
                  {...props}
                  text="Account"
                  symbol="Star"
                  active={props.accessibilityState?.selected}

                />
              }

            }
          }
        />
        <Tabs.Screen
          name="apps"
          options={
            {
              headerShown: false,
              tabBarStyle: {
                borderTopWidth: 0,
                backgroundColor: colors.primary[100],

              },
              tabBarButton: (props) => {
                return <TabButton
                  {...props}
                  text="Discover"
                  symbol="World"
                  active={props.accessibilityState?.selected}

                />
              }
            }} />
        <Tabs.Screen
          name="settings"
          options={
            {
              headerShown: false,
              tabBarStyle: {
                borderTopWidth: 0,
                backgroundColor: colors.primary[100],

              },
              tabBarButton: (props) => {
                return <TabButton
                  {...props}
                  text="Settings"
                  symbol="Chip"
                  active={props.accessibilityState?.selected}

                />
              }
            }} />
        <Tabs.Screen
          name="result"
          options={{
            headerShown: false,
            href: null,
            tabBarStyle: {
              borderTopWidth: 0,
              backgroundColor: colors.primary[100],

            },
          }} />
        <Tabs.Screen
          name="scanner"
          options={{
            headerShown: false,
            href: null,
            tabBarStyle: {
              borderTopWidth: 0,
              backgroundColor: colors.primary[100],

            },
          }} />
        <Tabs.Screen
          name="deposit/index"
          options={{
            headerShown: false,
            href: null,
            tabBarStyle: {
              borderTopWidth: 0,
              backgroundColor: colors.primary[100],

            },
          }} />
        <Tabs.Screen
          name="deposit/networks/index"
          options={{
            headerShown: false,
            href: null,
            tabBarStyle: {
              borderTopWidth: 0,
              backgroundColor: colors.primary[100],

            },
          }} />
        <Tabs.Screen
          name="deposit/networks/stellar_usdc"
          options={{
            headerShown: false,
            href: null,
            tabBarStyle: {
              borderTopWidth: 0,
              backgroundColor: colors.primary[100],

            },
          }} />
          <Tabs.Screen
          name="account/[publicKey]"
          options={{
            headerShown: false,
            href: null,
            tabBarStyle: {
              borderTopWidth: 0,
              backgroundColor: colors.primary[100],

            },
          }} />
           <Tabs.Screen
          name="account/new"
          options={{
            headerShown: false,
            href: null,
            tabBarStyle: {
              borderTopWidth: 0,
              backgroundColor: colors.primary[100],

            },
          }} />
      </ Tabs>
    </WalletProvider>
  </>
}
