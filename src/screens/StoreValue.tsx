import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';

export function StoreValue() {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [retrievedValue, setRetrievedValue] = useState(null);

  const storeValue = async () => {
    try {
      await SecureStore.setItemAsync(key, value);
      Alert.alert('Stored successfully');
    } catch (error) {
      Alert.alert('Error storing the data');
    }
  };

  const retrieveValue = async () => {
    try {
      const result = await SecureStore.getItemAsync(key);
      if (result) {
        setRetriewvedValue(result);
      } else {
        Alert.alert('No value found for this key.');
      }
    } catch (error) {
      Alert.alert('Error retrieving the data');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter Key"
        value={key}
        onChangeText={setKey}
        style={styles.input}
      />
      <TextInput
        placeholder="Enter Value"
        value={value}
        onChangeText={setValue}
        style={styles.input}
      />
      <Button title="Store Value" onPress={storeValue} />
      <Button title="Retrieve Value" onPress={retrieveValue} />

      {retrievedValue && <Text>Retrieved Value: {retrievedValue}</Text>}
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
  },
});