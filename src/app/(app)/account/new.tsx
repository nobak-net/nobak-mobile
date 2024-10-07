
import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useAuth } from '@/src/context/AuthContext';
import { StellarAccountManager } from '@/src/utils/StellarAccountManager';
import navigation from '@/src/utils/Navigation';
import { usePasswordPrompt } from '@/src/hooks/usePasswordPrompt';
import { Button } from 'nobak-native-design-system';
import { Routes } from '@/src/utils/Routes';
import { useDevMode } from '@/src/context';

const NewAccount: React.FC = () => {
  const { session } = useAuth();
  const { promptPassword } = usePasswordPrompt();
  const { isDevMode } = useDevMode();

  const handleBack = () => {
    navigation.back();
  };

  const handleCreateAccount = async () => {
    try {
      // Prompt the user for a password
      const password = await promptPassword();

      // Create an instance of StellarAccountManager
      const accountManager = StellarAccountManager.createInstance(session, isDevMode);

      const number = accountManager.getAccountCount()
      // If creating the account, allow for non-custodial cases where session may be null
      const accountName = `Account #${number + 1}`; // You can replace this with user input

      // Create the account using the provided password and account name
      const newAccount = await accountManager.createAccount(password, accountName);

      // Provide feedback to the user
      Alert.alert('Success', 'Account created successfully!');

      // Navigate to the account details screen
      navigation.go(Routes.AccountDetails, { publicKey: newAccount.publicKey });
    } catch (error: any) {
      console.error('Error creating account:', error);
      Alert.alert('Error', error.message || 'An error occurred while creating the account.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>New Account</Text>
      <Button text="Create Account" onPress={handleCreateAccount} />
    </View>
  );
};

export default NewAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  text: {
    fontSize: 18,
  },
});