import React from 'react';
import { View, Text } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

interface DetailsParams {
  [key: string]: string | string[];
}

export default function Stellar() {
  const router = useRouter();
  const params = useLocalSearchParams<DetailsParams>();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Stack.Screen
        options={{
          title: typeof params.name === 'string' ? params.name : 'Stellar',
        }}
      />
      <Text
        onPress={() => {
          router.setParams({ name: 'Updated' });
        }}>
        Update the title
      </Text>
    </View>
  );
}
