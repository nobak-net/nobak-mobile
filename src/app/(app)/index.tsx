import { StyleSheet, Text, View } from "react-native";
import * as React from 'react';
import { Link } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Layout, colors, texts, AccountActions } from 'nobak-native-design-system';
import { getAccountBalance } from '../../utils/StellarAccount';

export default function Index() {
    const { session } = useAuth();
    const [balance, setAddressBalance] = React.useState('');

    React.useEffect(() => {
        (async () => {
            if (session){
                setAddressBalance(String(Number(await getAccountBalance(session.ledger_account.address)) * 0.11 ) )
            }
        })();
    }, []);

    return (
        <Layout style={{ backgroundColor: colors.primary[2400], gap: 12 }}>
            <Text style={{ color: colors.primary[100], ...texts.H3Bold }}>Balance</Text>
            <AccountActions balance={balance} />
            <View>
                <Text style={{ color: colors.primary[100], ...texts.CaptionBold }}>Browsing with:</Text>
                <Text selectable={true} style={{ color: colors.primary[100], ...texts.P1Light }}>{balance}</Text>
            </View>
        </Layout>
    );
}