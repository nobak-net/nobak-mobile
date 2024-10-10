import React, { useCallback, useState } from 'react';
import { Text, View, Alert, ScrollView } from 'react-native';
import {
  Button,
  SymbolButton,
  MethodCard,
  ServerCard,
} from 'nobak-native-design-system';
import { formatPublicKey } from '@/src/utils/StellarUtils';
import navigation from '@/src/utils/Navigation';
import recovery from '@/src/utils/Recovery';
import { useFocusEffect } from 'expo-router';
import { StellarAccount } from '@/src/utils/StellarAccount';
import { useRequiredParams } from '@/src/hooks/useRequiredParams';
import { usePasswordPrompt } from '@/src/hooks/usePasswordPrompt';
import * as Clipboard from 'expo-clipboard';
import { colors, texts } from 'nobak-native-design-system';
import { Profile, Method } from '@/src/types/Profile';
import { Routes } from '@/src/utils/Routes';
import { useDevMode } from '@/src/context'
export default function AccountDetailsScreen() {
  const { publicKey } = useRequiredParams<{ publicKey: string }>(['publicKey']);
  const { promptPassword } = usePasswordPrompt();
  const { isDevMode } = useDevMode();
  if (typeof publicKey !== 'string') return
  // State to hold the profile object
  const [profile, setProfile] = useState<Profile | null>(null);
  const [accountData, setAccountData] = useState<any | null>(null);

  useFocusEffect(
    useCallback(() => {
      setProfile(null); // Reset the profile when the screen gains focus
      return () => {};
    }, [])
  );

  React.useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const stellarAccount = await StellarAccount.createInstance({
          publicKey,
          network:isDevMode ? 'testnet': 'mainnet', // Specify network if needed
        });
        const data = await stellarAccount.getAccountData();
        setAccountData(data);
      } catch (error) {
        console.error('Failed to fetch account data:', error);
      }
    };
    fetchAccountData();
  }, [publicKey]);

  const signTransaction = async (transactionXDR: string): Promise<string> => {
    try {
      const password = await promptPassword();
      const stellarAccount = await StellarAccount.createInstance({
        publicKey,
        network:isDevMode ? 'testnet': 'mainnet', // Specify network if needed
      });
      await stellarAccount.loadSensitiveData(password);
      const signedXDR = stellarAccount.signTransaction(transactionXDR, password);
      return signedXDR;
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to sign transaction');
      throw error;
    }
  };

  const signAndSubmitTransaction = async (
    transactionXDR: string
  ): Promise<any> => {
    try {
      const password = await promptPassword();
      const stellarAccount = await StellarAccount.createInstance({
        publicKey,
        network: isDevMode ? 'testnet': 'mainnet', // Specify network if needed
      });
      await stellarAccount.loadSensitiveData(password);
      const result = await stellarAccount.signAndSubmitTransaction(
        transactionXDR,
        password
      );
      return result;
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'Failed to sign and submit transaction'
      );
      throw error;
    }
  };

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
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to handle recovery XDR');
    }
  };

  // Helper function to check for missing methods
  const isMethodMissing = (type: Method['type']) => {
    if (!profile) return false;
    return !profile.methods.some(
      (method) =>
        method.type === type &&
        (method.status === 'VERIFIED' || method.status === 'PENDING')
    );
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
    navigation.go(Routes.AccountRecoveryChallenge, { methodType: type });
  };

  // Function to handle completing methods
  const handleCompleteMethod = (value: string, type: Method['type']) => {
    navigation.go(Routes.AccountRecoveryChallenge, { methodType: type });
  };

  // Function to copy the public key to clipboard
  const handleCopyPublicKey = async () => {
    try {
      await Clipboard.setStringAsync(publicKey);
      Alert.alert('Copied', 'Public key copied to clipboard.');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy public key.');
    }
  };

  const challengeServer = async (name: string) => {
    try {
      const xdr = await recovery.authServer(name);
      if (xdr) {
        const signedXDR = await signTransaction(xdr);
        await recovery.verifyServer(name, signedXDR);
      }
    } catch (error) {
      console.error('Error challenging server:', error);
      Alert.alert('Error', 'Failed to challenge server.');
    }
  };

  const addServerSigners = async (servers: { name: string; status: string }[]) => {
    try {
      const servers_id = servers.map((server) => server.name);
      const response = await recovery.addServers(servers_id);
      if (response.XDR) {
        const result = await signAndSubmitTransaction(response.XDR);
        console.log('Transaction result:', result);
      }
    } catch (error) {
      console.error('Error adding server signers:', error);
      Alert.alert('Error', 'Failed to add server signers.');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        backgroundColor: colors.primary[2400],
        flexGrow: 1,
        padding: 20,
      }}
    >
      <SymbolButton type="Back" onPress={() => navigation.back()} />
      <Text
        style={{
          ...texts.H4Bold,
          marginVertical: 10,
          color: colors.primary[200],
        }}
      >
        Address
      </Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text
            selectable
            style={{
              ...texts.P1Medium,
              marginBottom: 10,
              color: colors.primary[200],
            }}
          >
            {formatPublicKey(publicKey)}
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
          {accountData && (
            <View
              style={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <Text
                  style={{ ...texts.P1Bold, color: colors.primary[400] }}
                >
                  Signers
                </Text>
                <Text
                  style={{ ...texts.CaptionBold, color: colors.primary[100] }}
                >
                  {accountData?.thresholds?.low_threshold} /{' '}
                  {accountData?.thresholds?.med_threshold} /{' '}
                  {accountData?.thresholds?.high_threshold}
                </Text>
              </View>
              {accountData?.signers?.map((signer, index) => (
                <View
                  key={index}
                  style={{
                    padding: 10,
                    marginBottom: 10,
                    borderColor: '#ddd',
                    borderWidth: 1,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.primary[400],
                    }}
                  >
                    {formatPublicKey(signer.key)} ({signer.weight})
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
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
            <Text
              style={{ ...texts.H4ExtraBold, color: colors.primary[400] }}
            >
              Methods
            </Text>
            <Text
              style={{
                ...texts.P3Medium,
                color: colors.primary[200],
                marginBottom: 8,
              }}
            >
              These are ways in which you can recover your account in case it is
              lost.
            </Text>
            {profile.methods.map((method, index) => (
              <MethodCard
                key={index}
                type={method.type}
                value={method.value}
                status={method.status}
                onComplete={() =>
                  handleCompleteMethod(method.value, method.type)
                }
              />
            ))}
            {/* Render missing method buttons */}
            {renderMissingMethodButtons()}
          </View>
          {/* Servers */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{ ...texts.H4ExtraBold, color: colors.primary[400] }}
            >
              Servers
            </Text>
            <Text
              style={{
                ...texts.P3Medium,
                color: colors.primary[200],
                marginBottom: 8,
              }}
            >
              Available recovery servers to store your account
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              {profile.servers && profile.servers.length > 0 ? (
                profile.servers.map((server, index) => (
                  <ServerCard
                    key={index}
                    server={server}
                    theme="dark"
                    onCheck={() => console.log('checked')}
                    onPress={() => challengeServer(server?.name)}
                  />
                ))
              ) : (
                <Text
                  style={{
                    marginLeft: 10,
                    color: colors.primary[200],
                  }}
                >
                  No servers available.
                </Text>
              )}
              {profile.servers && profile.servers.length > 1 && (
                <Button
                  text="Sync"
                  onPress={() => addServerSigners(profile.servers)}
                />
              )}
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}