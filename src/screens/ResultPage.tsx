import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function ResultPage({ route }) {
  // Extract the QR data from the route parameters
  const { qrData } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Scanned QR Code:</Text>
      <Text style={styles.data}>{qrData}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 20,
  },
  data: {
    fontSize: 16,
    textAlign: 'center',
  },
});

