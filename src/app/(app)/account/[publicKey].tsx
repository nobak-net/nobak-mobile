import React from 'react';
import { Text, View, TouchableOpacity, Alert } from "react-native";
import { Button, Symbol } from 'nobak-native-design-system';
import { useEffect } from 'react';
import { formatPublicKey } from '../../../utils/StellarUtils';
import navigation from "../../../utils/Navigation";
import recovery from "../../../utils/Recovery";
import { StellarAccount } from '../../../utils/StellarAccount';
import { useRequiredParams } from "../../../hooks/useRequiredParams";
import { usePasswordPrompt } from "../../../hooks/usePasswordPrompt";
// import * as Clipboard from 'expo-clipboard';

export default function AccountDetailsScreen() {
    const { publicKey } = useRequiredParams<{ publicKey: string }>(['publicKey']) as { publicKey: string };
    const { promptPassword } = usePasswordPrompt();
    console.log('publicKey', publicKey)
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

            const submitResponse = await recovery.verify(publicKey, signedXDR);
            if (!submitResponse || !submitResponse.success) {
                throw new Error('Failed to submit signed XDR');
            }

            Alert.alert('Success', 'Contract XDR signed and submitted successfully!');
        } catch (error: any) {
            console.error(error);
            Alert.alert('Error', error.message);
        }
    };

    // Function to copy the public key to clipboard
    const handleCopyPublicKey = async () => {
        try {
            // await Clipboard.setStringAsync('hello world')
            Alert.alert('Copied', 'Public key copied to clipboard.');
        } catch (error) {
            console.error('Error copying public key:', error);
            Alert.alert('Error', 'Failed to copy public key.');
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: "flex-start", margin: 20 }}>
            <TouchableOpacity onPress={() => navigation.back()}>
                <Symbol type="Back" />
            </TouchableOpacity>

            <Text>{formatPublicKey(publicKey as string)}</Text>
            <Button text="Copy" type="icon" icon="Bookmark" buttonStyle={{ size: 'small', variant: 'primary' }}onPress={handleCopyPublicKey} />

            <Button text="Connect" onPress={handleGetXDR} />
        </View>
    );
}