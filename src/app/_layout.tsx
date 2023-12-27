import { Stack } from 'expo-router/stack';
import { Tabs } from 'expo-router/tabs';
import React from 'react';
import { Slot } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';

export const unstable_settings = {
  initialRouteName: 'sign_in',
};



export default function Root() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
