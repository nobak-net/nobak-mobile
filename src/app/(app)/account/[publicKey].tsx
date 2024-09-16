import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Alert, ScrollView } from "react-native";
import { Button, SymbolButton } from 'nobak-native-design-system';
import { formatPublicKey } from '../../../utils/StellarUtils';
import navigation from "../../../utils/Navigation";
import recovery from "../../../utils/Recovery";
import { StellarAccount } from '../../../utils/StellarAccount';
import { useRequiredParams } from "../../../hooks/useRequiredParams";
import { usePasswordPrompt } from "../../../hooks/usePasswordPrompt";
import * as Clipboard from 'expo-clipboard';
import { colors } from 'nobak-native-design-system';
import { Profile, Method } from '../../../types/Profile';
import { Routes } from '../../../utils/Routes';

export default function AccountDetailsScreen() {
    const { publicKey } = useRequiredParams<{ publicKey: string }>(['publicKey']) as { publicKey: string };
    const { promptPassword } = usePasswordPrompt();
    console.log('publicKey', publicKey)

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
    const handleUpdateProfile = () => {
        // Implement profile update logic here
        Alert.alert('Update', 'Profile update functionality not implemented yet.');
    };

    // Helper functions to check for missing methods
    const isMethodMissing = (type: Method['type']) => {
        if (!profile) return false;
        return !profile.methods.some(method => method.type === type && method.status === 'VERIFIED');
    };

    return (
        <ScrollView contentContainerStyle={{ backgroundColor: colors.primary[2400], flexGrow: 1, padding: 20 }}>
            <SymbolButton type="Back" onPress={() => navigation.back()} />

            <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 10, color: colors.primary[200] }}>
                Public Key:
            </Text>
            <Text selectable style={{ marginBottom: 10, color: colors.primary[200] }}>
                {formatPublicKey(publicKey as string)}
            </Text>
            <Button 
                text="Copy" 
                type="icon" 
                icon="Bookmark" 
                buttonStyle={{ size: 'small', variant: 'secondary' }}
                onPress={handleCopyPublicKey} 
            />

            <Button 
                text="Connect & Fetch Profile" 
                onPress={handleGetXDR} 
                buttonStyle={{ size: 'small', variant: 'secondary' }}
                style={{ marginTop: 20 }}
            />

            {profile && (
                <View style={{ marginTop: 30 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: colors.primary[200] }}>
                        Profile Details:
                    </Text>
                    
                    {/* Account Information */}
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontWeight: '600', color: colors.primary[200] }}>Account:</Text>
                        <Text style={{ color: colors.primary[200] }}>ID: {profile.account}</Text>
                    </View>

                    {/* Methods */}
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontWeight: '600', color: colors.primary[200] }}>Methods:</Text>
                        {profile.methods.map((method, index) => (
                            <View key={method.id} style={{ marginLeft: 10, marginBottom: 10 }}>
                                <Text style={{ color: colors.primary[200] }}>Method {index + 1}:</Text>
                                <Text style={{ color: colors.primary[200] }}>ID: {method.id}</Text>
                                <Text style={{ color: colors.primary[200] }}>Type: {method.type}</Text>
                                <Text style={{ color: colors.primary[200] }}>Value: {method.value}</Text>
                                <Text style={{ color: colors.primary[200] }}>Status: {method.status}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Servers */}
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontWeight: '600', color: colors.primary[200] }}>Servers:</Text>
                        {profile.servers.length > 0 ? (
                            profile.servers.map((server, index) => (
                                <Text key={index} style={{ marginLeft: 10, color: colors.primary[200] }}>
                                    - {server}
                                </Text>
                            ))
                        ) : (
                            <Text style={{ marginLeft: 10, color: colors.primary[200] }}>No servers available.</Text>
                        )}
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
                        text="Update Profile" 
                        onPress={handleUpdateProfile} 
                        type="secondary"
                    />
                </View>
            )}
        </ScrollView>
    );
}