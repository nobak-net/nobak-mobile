import React, { useCallback, useState } from 'react';
import { Text, View, Alert, ScrollView } from "react-native";
import { Button, SymbolButton, MethodCard, ServerCard } from 'nobak-native-design-system';
import { formatPublicKey } from '@/src/utils/StellarUtils';
import navigation from "@/src/utils/Navigation";
import recovery from "@/src/utils/Recovery";
import { useFocusEffect } from 'expo-router';
import { StellarAccount } from '@/src/utils/StellarAccount';
import { useRequiredParams } from "@/src/hooks/useRequiredParams";
import { usePasswordPrompt } from "@/src/hooks/usePasswordPrompt";
import * as Clipboard from 'expo-clipboard';
import { colors, texts } from 'nobak-native-design-system';
import { Profile, Method } from '@/src/types/Profile';
import { Routes } from '@/src/utils/Routes';

export default function AccountDetailsScreen() {
  const { publicKey } = useRequiredParams<{ publicKey: string }>(['publicKey']) as { publicKey: string };
  const { promptPassword } = usePasswordPrompt();

  // State to hold the profile object
  const [profile, setProfile] = useState<Profile | null>(null);

  useFocusEffect(
    useCallback(() => {
      setProfile(null); // Reset the profile when the screen gains focus
      return () => { };
    }, [])
  );

  const signTransaction = async (transactionXDR: string): Promise<string> => {
    try {
      if (!publicKey) {
        throw new Error('Public key not found');
      }
      const password = await promptPassword();
      const stellarAccount = new StellarAccount(publicKey, '', '');
      await stellarAccount.loadSensitiveData(password);
      const signedXDR = stellarAccount.signTransaction(transactionXDR, password);
      return signedXDR;
    } catch (error: any) {
      console.error('Error signing transaction:', error);
      Alert.alert('Error', error.message);
      throw error;
    }
  };

  const signAndSubmitTransaction = async (transactionXDR: string): Promise<string> => {
    try {
      if (!publicKey) {
        throw new Error('Public key not found');
      }

      const password = await promptPassword();
      const stellarAccount = new StellarAccount(publicKey, '', '');
      await stellarAccount.loadSensitiveData(password);
      const signedXDR = stellarAccount.signAndSubmitTransaction(transactionXDR, password);
      return signedXDR;
    } catch (error: any) {
      console.error('Error signing transaction:', error);
      Alert.alert('Error', error.message);
      throw error;
    }
  }


  const handleGetXDR = async () => {
    try {
      const initResponse = await recovery.register(publicKey);
      if (!initResponse || !initResponse.xdr) {
        throw new Error('Failed to initiate recovery process');
      }
      const xdr = initResponse.xdr;
      const signedXDR = await signTransaction(xdr);
      await recovery.verify(publicKey, signedXDR);
      const fetchedProfile = await recovery.profile();
      setProfile(fetchedProfile);
      // navigate.go(Routes.RecoveryProfile, { profile: fetchedProfile })
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.message);
    }
  };

  // Helper function to check for missing methods
  const isMethodMissing = (type: Method['type']) => {
    if (!profile) return false;
    return !profile.methods.some(method => method.type === type && method.status === 'VERIFIED' || method.status === 'PENDING');
  };

  // Function to render missing method buttons
  const renderMissingMethodButtons = () => {
    const missingMethods: Array<Method['type']> = [];

    if (isMethodMissing('stellar_address')) missingMethods.push('stellar_address');
    if (isMethodMissing('phone_number')) missingMethods.push('phone_number');
    if (isMethodMissing('email')) missingMethods.push('email');

    return missingMethods.map((type, index) => (
      <MethodCard key={index} type={type} onAdd={() => handleAddMethod(type)} />
    ));
  };

  // Function to handle adding methods
  const handleAddMethod = (type: Method['type']) => {
    console.log('type', type)
    navigation.go(Routes.AccountRecoveryChallenge, { methodType: type })
    // Implement your logic to add the method (stellar_address, phone_number, email)
  };

  const handleCompleteMethod = (value: string, type: Method['type']) => {
    console.log('type', type)
    navigation.go(Routes.AccountRecoveryChallenge, { methodType: type })
    // Implement your logic to add the method (stellar_address, phone_number, email)
  };

  // Function to copy the public key to clipboard
  const handleCopyPublicKey = async () => {
    try {
      await Clipboard.setStringAsync(publicKey);
      Alert.alert('Copied', 'Public key copied to clipboard.');
    } catch (error) {
      console.error('Error copying public key:', error);
      Alert.alert('Error', 'Failed to copy public key.');
    }
  };

  const challengeServer = async (name: string) => {
    console.log('name', name)
    const xdr = await recovery.authServer(name)
    console.log('response', xdr)
    console.log('challenge server', name)
    if (xdr) {
      const signedXDR = await signTransaction(xdr);
      await recovery.verifyServer(name, signedXDR);
    }
  }

  const addServerSigners = async (servers: { name: string, status: string }[]) => {
    const servers_id = servers.map(server => server.name)
    const response = await recovery.addServers(servers_id)
    console.log('response', response)
    if (response.XDR) {
      const transaction = await signAndSubmitTransaction(response.XDR);
      console.log(transaction)
    }
  }

  return (
    <ScrollView contentContainerStyle={{ backgroundColor: colors.primary[2400], flexGrow: 1, padding: 20 }}>
      <SymbolButton type="Back" onPress={() => navigation.back()} />
      <Text style={{ ...texts.H4Bold, marginVertical: 10, color: colors.primary[200] }}>Address</Text>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text selectable style={{ ...texts.P1Medium, marginBottom: 10, color: colors.primary[200] }}>
          {formatPublicKey(publicKey as string)}
        </Text>
        <Button
          text="Copy"
          icon="Bookmark"
          type="icon"
          theme="dark"
          buttonStyle={{ size: 'tiny', variant: 'primary' }}
          onPress={handleCopyPublicKey}
        />
      </View>
      <View>
        <Button
          text="Security"
          icon="Shield"
          type="iconText"
          theme="dark"
          onPress={handleGetXDR}
          buttonStyle={{ size: 'tiny', variant: 'primary' }}
          style={{ marginTop: 20 }}
        />
      </View>

      {profile && (
        <View style={{ marginTop: 30 }}>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ ...texts.H4ExtraBold, color: colors.primary[400] }}>Methods</Text>
            <Text style={{ ...texts.P3Medium, color: colors.primary[200] }}>
              These are ways in which you can recover your account in case it is lost.
            </Text>
            {profile.methods.map((method, index) => (
              <MethodCard key={index} type={method.type} value={method.value} status={method.status} onComplete={() => handleCompleteMethod(method.value, method.type)} />
            ))}

            {/* Render missing method buttons */}
            {renderMissingMethodButtons()}
          </View>

          {/* Servers */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ ...texts.H4ExtraBold, color: colors.primary[400] }}>Servers</Text>
            <View style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {profile.servers && profile.servers.length > 0 ? (
                profile.servers.map((server, index) => (
                  <ServerCard
                    key={index}
                    server={server}
                    theme="dark"
                    onPress={() => challengeServer(server.name  )}
                  />
                ))
              ) : (
                <Text style={{ marginLeft: 10, color: colors.primary[200] }}>No servers available.</Text>
              )}
              {/* {profile.servers.length > 1 && (
                <Button text="Sync" onPress={() => addServerSigners()} />
              )} */}
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}