// app/account/add.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, colors, texts, SymbolButton } from 'nobak-native-design-system'; // Replace with your actual Button component
import navigation from '@/src/utils/Navigation';
import { Routes } from '@/src/utils/Routes'; // Import Routes enum
// import { Ionicons } from '@expo/vector-icons'; // For icons (ensure you have expo-vector-icons installed)

const AddAccount: React.FC = () => {
  const handleNewAccount = () => {
    navigation.go(Routes.NewAccount);
  };

  const handleImportAccount = () => {
    navigation.go(Routes.ImportAccount);
  };

  return (
    <View style={styles.container}>
      <SymbolButton type="Back" onPress={() => navigation.back()} />

      <Text style={styles.header}>Add Account</Text>
      <View style={{ flex: 1, flexDirection: 'column', gap: 16 }}>
        <Button
          text="New"
          onPress={handleNewAccount}
          theme='dark'
          type="caption"
          icon="Stellar"
          description="Create a new stellar account"
          buttonStyle={{ variant: 'primary', size: 'medium', full: true }}
        />
        <Button
          text="Import"
          onPress={handleImportAccount}
          theme='dark'
          type="caption"
          icon="Add"
          description="Add an existing stellar account"
          buttonStyle={{ variant: 'primary', size: 'medium', full: true }}
        />
      </View>
    </View>
  );
};

export default AddAccount;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary[2400],
    height: "100%",
    padding: 24,
    flex: 1
  },
  header: {
    ...texts.H4Bold,
    color: colors.primary[100],
    marginBottom: 32,
    fontWeight: 'bold',
  },
  button: {
    width: '80%',
    marginVertical: 10,
  },
});