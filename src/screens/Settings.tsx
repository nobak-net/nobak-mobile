import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export const Settings = () => {
  const [stellarAddress, setStellarAddress] = useState('');

  useEffect(() => {
    (async () => {
      const storedAddress = await SecureStore.getItemAsync('stellarAddress');
      if (storedAddress) {
        setStellarAddress(storedAddress);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.label}>Stellar Address:</Text>
      <Text style={styles.value}>{stellarAddress}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    marginTop: 5,
  },
});
