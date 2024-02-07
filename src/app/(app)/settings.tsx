import React from 'react';
import { View, Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '../../context/AuthContext';
import { Keypair } from 'stellar-base';
import { signTransaction } from '../../utils/StellarAccount';
import { Layout, colors, texts, Button } from 'nobak-native-design-system'
const Settings = () => {
    const { signOut, session } = useAuth();

    return (
        <Layout style={{ backgroundColor: colors.primary[100] }}>
            <View>
                {session &&
                    <>
                        <Text>Settings</Text>
                        <Text>Email</Text>
                        <Text>{session.email}</Text>
                        <Text>Account ID</Text>
                        <Text>{session.accountId}</Text>

                        <Text>Stellar Address:</Text>
                        <Text selectable={true}>{session.ledger_account.address}</Text>
                    </>
                }
            </View>
            <View>
                <Button text='Sign Out' onPress={() => {
                    // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
                    signOut();
                }} />

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