import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useSession } from '../../context/AuthContext';
import { Keypair } from 'stellar-base';
import { signTransaction } from '../../utils/StellarAccount';
import { Layout, colors, texts } from 'nobak-native-design-system'
const Settings = () => {
    const { signOut } = useSession();

    const [stellarAddress, setStellarAddress] = React.useState('');

    const generateKeypair = async () => {
        const newKeypair = Keypair.random();

        await SecureStore.setItemAsync('stellarAddress', newKeypair.publicKey())
        await SecureStore.setItemAsync('stellarSecretKey', newKeypair.secret())
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
        <Layout style={{ backgroundColor: colors.primary[100] }}>
            <View>
                <Text>Settings</Text>
                <Button title="Generate Keypair" onPress={() => generateKeypair} />

                <Text>Stellar Address:</Text>
                <Text selectable={true}>{stellarAddress}</Text>

                <Button title="Sign XDR" onPress={() => signTransaction('xdr')} />

            </View>
            <View>
                <Text
                    onPress={() => {
                        // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
                        signOut();
                    }}>
                    Sign Out
                </Text>
            </View>
        </Layout>
    );
};

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     title: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         marginBottom: 20,
//     },
//     label: {
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     value: {
//         fontSize: 16,
//         marginTop: 5,
//     },
// });

export default Settings;