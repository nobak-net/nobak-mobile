// import { router, Stack } from 'expo-router';
import { Text } from 'react-native'
import { useSession } from '../../context/AuthContext';
import { Tabs } from 'expo-router/tabs';
import { Icon } from 'nobak-native-design-system';
import { WalletProvider } from '../../context/WalletContext';
export default function AppLayout() {
  const { session, isLoading } = useSession();

  // This layout can be deferred because it's not the root layout.
  return <>
    <WalletProvider>
      <Tabs>
        <Tabs.Screen
          name="index"
          options={{
            title: "Account",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Icon name="Analytics" />
            ),
          }} />
        <Tabs.Screen
          name="apps"
          options={{
            title: "Apps",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Icon name="WalletConnect" />
            ),
          }} />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Icon name="Clockwork" />
            ),
          }} />
      </ Tabs>
    </WalletProvider>
  </>
}



{/* <Tabs
screenOptions={{
tabBarActiveTintColor: Colors.orange.default,
tabBarStyle: {
height: 70,
borderWidth: 1,
borderRadius: 50,
borderColor: Colors.orange.default,
borderTopColor: Colors.orange.default,
backgroundColor: Colors.white.default,
},
tabBarLabelStyle: {
fontSize: 12,
fontWeight: "bold",
marginBottom: 10,
},
}}
>
<Tabs.Screen
name="(HomeNav)"
options={{
title: "Home",
headerShown: false,
tabBarIcon: ({color, size}) => (
<Ionicons name="ios-home" size={size} color={color}/>
),
}}
/>

</Tabs> */}