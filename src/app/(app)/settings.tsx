import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useSession } from '../../context/AuthContext';
// import { Keypair } from 'stellar-base';
import { signTransaction } from '../../utils/StellarAccount';
const Settings = () => {
    const { signOut } = useSession();

    const [stellarAddress, setStellarAddress] = React.useState('');

    const generateKeypair = async () => {
        // const newKeypair = Keypair.random();
        
        // await SecureStore.setItemAsync('stellarAddress', newKeypair.publicKey())
        // await SecureStore.setItemAsync('stellarSecretKey', newKeypair.secret())
      };

    React.useEffect(() => {
        (async () => {
            const storedAddress = await SecureStore.getItemAsync('stellarAddress');
            if (storedAddress) {
                setStellarAddress(storedAddress);
            }
        })();
    }, []);

    return (
        <>
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>
            <Button title="Generate Keypair" onPress={() => generateKeypair} />

            <Text style={styles.label}>Stellar Address:</Text>
            <Text selectable={true} style={styles.value}>{stellarAddress}</Text>

            <Button title="Sign XDR" onPress={() => signTransaction('xdr')} />

        </View>
        <View style={styles.container}>
            <Text
                onPress={() => {
                    // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
                    signOut();
                }}>
                Sign Out
            </Text>
        </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    value: {
        fontSize: 16,
        marginTop: 5,
    },
});

export default Settings;