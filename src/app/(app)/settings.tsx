import React from 'react';
import { View, Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '../../context/AuthContext';
import { Keypair } from 'stellar-base';
import { signTransaction } from '../../utils/StellarAccount';
import { Layout, colors, texts, Button } from 'nobak-native-design-system'
import SDK from '../../utils/SDK';
import { createStellarKeypair } from '../../utils/createStellarKeypair';

const Settings = () => {
    const { signOut, session } = useAuth();

    const initRecovery = async () => {
        const response = await SDK.initRecovery();
        console.log('response', response)
    }

    const createAccount = () => {
        const keys = createStellarKeypair()
        console.log("KEYS", keys)
    }
    
    return (
        <Layout style={{ backgroundColor: colors.primary[2400], gap: 12 }}>
            <View>
                {session &&
                    <>
                        <Text style={{ color: colors.primary[100], ...texts.H3Bold }}>Settings</Text>
                        <Text style={{ color: colors.primary[100], ...texts.P2Bold }}>Email</Text>
                        <Text style={{ color: colors.primary[100], ...texts.P3Medium }}>{session.email}</Text>
                        {/* <Text style={{ color: colors.primary[100], ...texts.P2Bold }}>Account ID</Text> */}
                        {/* <Text style={{ color: colors.primary[100], ...texts.P3Medium }}>{session.accountId}</Text> */}

                        <Text style={{ color: colors.primary[100], ...texts.P2Bold }}>Account:</Text>
                        {/* <Text style={{ color: colors.primary[100], ...texts.P3Medium }} selectable={true}>{session.ledger_accounts[0].address}</Text> */}
                    </>
                }
            </View>
            <View>
                <Button buttonStyle={{ variant: 'secondary', size: 'tiny' }} text='Sign Out' onPress={() => {
                    // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
                    signOut();
                }} />


                <Button buttonStyle={{ variant: 'secondary', size: 'tiny' }} text='Recovery' onPress={() => initRecovery()} />
                <Button buttonStyle={{ variant: 'secondary', size: 'tiny' }} text='createStellarKeypair' onPress={() => createAccount()} />
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