// app/account/new/index.tsx

import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { StellarAccountManager } from '../../../utils/StellarAccountManager';
import navigation from '../../../utils/Navigation';
import { usePasswordPrompt } from '../../../hooks/usePasswordPrompt';
import { Button } from 'nobak-native-design-system';
import { Routes } from '../../../utils/Routes';

const NewAccount: React.FC = () => {
  const { session } = useAuth();
  const { promptPassword } = usePasswordPrompt();

  const handleBack = () => {
    navigation.back();
  };

  const handleCreateAccount = async () => {
    try {
      if (session) {
        // Prompt the user for a password
        const password = await promptPassword();

        // Create an instance of StellarAccountManager
        const accountManager = StellarAccountManager.createInstance(session);

        // Prompt the user for the account name (optional)
        const accountName = 'Account #1'; // You can implement a prompt for the account name as well

        // Create the account using the provided password and account name
        await accountManager.createAccount(password, accountName);

        // Retrieve all accounts (if needed)
        const mergedAccounts = await accountManager.getAllAccounts();

        // Provide feedback to the user
        Alert.alert('Success', 'Account created successfully!');
        // navigation.go(Routes.AccountDetails, { publicKey: }); // Navigate to the account list or appropriate screen
      } else {
        Alert.alert('Error', 'User session not found.');
      }
    } catch (error: any) {
      console.error('Error creating account:', error);
      Alert.alert('Error', error.message || 'An error occurred while creating the account.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>New Account </Text>
      <Button text="Create Account" onPress={handleCreateAccount} />
      {/* Include the PasswordPromptModalComponent if using a custom modal */}
    </View>
  );
};

export default NewAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center',     // Center horizontally
  },
  text: {
    fontSize: 18,
  },
});