import { StyleSheet, Text, View } from "react-native";
import * as React from 'react';
import { Link } from 'expo-router';
import { useSession } from '../../context/AuthContext';
import { Layout, colors, texts, AccountActions } from 'nobak-native-design-system';
import { getAccountBalance } from '../../utils/StellarAccount';
import * as SecureStore from 'expo-secure-store';

export default function Index() {
    const { signOut } = useSession();
    const [stellarAddress, setStellarAddress] = React.useState('');
    const [addressBalance, setAddressBalance] = React.useState('')

    const generateKeypair = async () => {
        // const newKeypair = Keypair.random();
        // await SecureStore.setItemAsync('stellarAddress', newKeypair.publicKey())
        // await SecureStore.setItemAsync('stellarSecretKey', newKeypair.secret())
    };

    React.useEffect(() => {
        (async () => {
            const storedAddress = await SecureStore.getItemAsync('stellarAddress');
            const balance = await getAccountBalance(String(storedAddress))
            if (storedAddress) {
                setAddressBalance(String(balance * 0.11))
                setStellarAddress(storedAddress);
            }
        })();
    }, []);

    return (
        <Layout style={{ backgroundColor: colors.primary[2400], gap: 12 }}>
            <Text style={{ color: colors.primary[100], ...texts.H3Bold }}>Balance</Text>
            <AccountActions balance={addressBalance} />
            <View>
                <Text style={{ color: colors.primary[100], ...texts.CaptionBold }}>Browsing with:</Text>
                <Text selectable={true} style={{ color: colors.primary[100], ...texts.P1Light }}>{stellarAddress}</Text>
            </View>
        </Layout>
    );
}