import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AccountHome from '@/src/app/(app)/index'; // Replace with your actual component
import AccountDetails from '@/src/app/(app)/account/[publicKey]'; // Replace with your actual component
import AddAccount from '@/src/app/(app)/account/add';
import ImportAccount from '@/src/app/(app)/account/import';
import NewAccount from '@/src/app/(app)/account/new';

const Stack = createStackNavigator();

const AccountStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="AccountHome"
      screenOptions={{
        headerShown: false, // Hide headers if desired
      }}
    >
      <Stack.Screen name="AccountHome" component={AccountHome} />
      <Stack.Screen name="AccountDetails" component={AccountDetails} />
      <Stack.Screen name="AddAccount" component={AddAccount} />
      <Stack.Screen name="ImportAccount" component={ImportAccount} />
      <Stack.Screen name="NewAccount" component={NewAccount} />
      {/* Add other nested account screens here */}
    </Stack.Navigator>
  );
};

export { AccountStack };