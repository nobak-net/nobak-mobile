// app/account/add.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'nobak-native-design-system'; // Replace with your actual Button component
import navigation from '../../../utils/Navigation';
import { Routes } from '../../../utils/Routes'; // Import Routes enum
// import { Ionicons } from '@expo/vector-icons'; // For icons (ensure you have expo-vector-icons installed)

const AddAccountScreen: React.FC = () => {
  const handleNewAccount = () => {
    navigation.go(Routes.NewAccount);
  };

  const handleImportAccount = () => {
    navigation.go(Routes.ImportAccount);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Account</Text>
      <Button
        text="New Account"
        onPress={handleNewAccount}
        buttonStyle={{ variant: 'primary', size: 'medium', full: true }}
      />
      <Button
        text="Import Account"
        onPress={handleImportAccount}
        buttonStyle={{ variant: 'primary', size: 'medium', full: true }}
      />
    </View>
  );
};

export default AddAccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center',     // Center horizontally
    padding: 16,
  },
  header: {
    fontSize: 24,
    marginBottom: 32,
    fontWeight: 'bold',
  },
  button: {
    width: '80%',
    marginVertical: 10,
  },
});