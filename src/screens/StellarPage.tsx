import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Keypair } from 'stellar-base';
import * as SecureStore from 'expo-secure-store';

export const StellarPage = () => {
  const [keypair, setKeypair] = useState(null);


  const generateKeypair = async () => {
    const newKeypair = Keypair.random();
    
    setKeypair(newKeypair);
    await SecureStore.setItemAsync('stellarAddress', newKeypair.publicKey())
  };

  return (
    <View style={styles.container}>
      <Button title="Generate Keypair" onPress={generateKeypair} />

      {keypair && (
        <View style={styles.info}>
          <Text>Account Address:</Text>
          <Text style={styles.address}>{keypair.publicKey()}</Text>
          {/* You might also want to display or securely store the secret, but NEVER expose it openly in production apps! */}
          {/* <Text>Secret: {keypair.secret()}</Text> */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    marginTop: 20,
    alignItems: 'center',
  },
  address: {
    marginTop: 10,
    fontWeight: 'bold',
  },
});
