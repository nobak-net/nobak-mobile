import { StyleSheet, Text, View } from "react-native";
import  * as React from 'react';
import { Link } from 'expo-router';
import { useSession } from '../../context/AuthContext';
import { Layout, colors, texts } from 'nobak-native-design-system';
import * as SecureStore from 'expo-secure-store';

export default function Index() {
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

        <Layout>
            <Text style={{ color: colors.primary[2400], ...texts.CaptionBold }}>Browsing with:</Text>
            <Text selectable={true} style={{ color: colors.primary[2400], ...texts.P1Light }}>{stellarAddress}</Text>
        </Layout>

    );
}