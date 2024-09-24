import React, { useState } from 'react';
import { Text, View, Alert, ScrollView } from "react-native";
import { Button, SymbolButton, MethodCard, ServerCard } from 'nobak-native-design-system';
import { formatPublicKey } from '@/src/utils/StellarUtils';
import navigation from "@/src/utils/Navigation";
import recovery from "@/src/utils/Recovery";
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
    console.log('publicKey', publicKey)
    const [servers, setServers] = useState<null | any>(null)
    // State to hold the profile object
    const [profile, setProfile] = useState(null);

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
    }

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

            // Update the profile state with the fetched profile
            setProfile(fetchedProfile);

            Alert.alert('Success', 'Profile fetched successfully!');
        } catch (error: any) {
            console.error(error);
            Alert.alert('Error', error.message);
        }
    };

    // Function to copy the public key to clipboard
    const handleCopyPublicKey = async () => {
        try {
            await Clipboard.setStringAsync(publicKey)
            Alert.alert('Copied', 'Public key copied to clipboard.');
        } catch (error) {
            console.error('Error copying public key:', error);
            Alert.alert('Error', 'Failed to copy public key.');
        }
    };

    // Function to handle profile updates (example)
    const getAvailableServers = async () => {
        // Implement profile update logic here

        const servers = await recovery.availableServers()
        console.log('servers', servers)
        if (servers.unpairedServers) {
            setServers(servers.unpairedServers)
        } else {
            setServers(servers.pairedServers)
        }


    };

    // Helper functions to check for missing methods
    const isMethodMissing = (type: Method['type']) => {
        if (!profile) return false;
        return !profile.methods.some(method => method.type === type && method.status === 'VERIFIED');
    };

    const challengeServer = async (name: string) => {
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

            <Text style={{ ...texts.H4Bold, marginVertical: 10, color: colors.primary[200] }}>
                Address
            </Text>
            <View style={{ display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: 'center', justifyContent: 'space-between' }}>
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
                    {/* <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: colors.primary[200] }}>
                        Profile Details:
                    </Text> */}

                    {/* Account Information */}
                    {/* <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontWeight: '600', color: colors.primary[200] }}>Account:</Text>
                        <Text style={{ color: colors.primary[200] }}>ID: {profile.account}</Text>
                    </View> */}

                    {/* Methods */}
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ ...texts.H4ExtraBold, color: colors.primary[400] }}>Methods</Text>
                        <Text style={{ ...texts.P3Medium, color: colors.primary[200] }}>Are ways in which you can recover your account in case a lost</Text>
                        {profile.methods.map((method, index) => (
                            <MethodCard type={method.type} value={method.value} status={method.status} />
                        ))}
                    </View>

                    {/* Servers */}
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontWeight: '600', color: colors.primary[200] }}>Servers:</Text>
                        {profile.servers.length > 0 ? (
                            profile.servers.map((server, index) => (
                                <Text key={index} style={{ marginLeft: 10, color: colors.primary[200] }}>
                                    - {server.name} - {server.status}
                                </Text>
                            ))
                        ) : (
                            <Text style={{ marginLeft: 10, color: colors.primary[200] }}>No servers available.</Text>
                        )}
                        {profile.servers.length > 1 && <Button text="Sync" onPress={() => addServerSigners(profile.servers)} />}
                    </View>
                    {/* Buttons to Add Missing Methods */}
                    <View style={{ marginBottom: 20 }}>
                        {isMethodMissing('phone_number') && (
                            <Button
                                text="Add Phone Number"
                                onPress={() => navigation.go(Routes.AccountRecoveryChallenge, { methodType: 'phone_number' })}
                                type="secondary"
                                style={{ marginBottom: 10 }}
                            />
                        )}
                        {isMethodMissing('email') && (
                            <Button
                                text="Add Email"
                                onPress={() => navigation.go(Routes.AccountRecoveryChallenge, { methodType: 'email' })}
                                type="secondary"
                            />
                        )}
                    </View>

                    {/* Example Button to Update Profile */}
                    <Button
                        text="get Servers"
                        onPress={getAvailableServers}
                        type="secondary"
                    />
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontWeight: '600', color: colors.primary[200] }}>Servers:</Text>
                        <View style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {servers && servers.length > 0 ? (
                                servers.map((server, index) => (
                                    <ServerCard name={server.name} onPress={() => challengeServer(server.name)} />
                                    // <Button key={index} text={server.name} onPress={() => challengeServer(server.name)} />
                                ))
                            ) : (
                                <Text style={{ marginLeft: 10, color: colors.primary[200] }}>No servers available.</Text>
                            )}
                        </View>
                    </View>
                </View>
            )}
        </ScrollView>
    );
}