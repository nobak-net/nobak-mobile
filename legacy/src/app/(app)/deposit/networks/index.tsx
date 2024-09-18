import React from 'react';
import { Text, View } from 'react-native';
import { Button, Layout, colors, texts } from 'nobak-native-design-system';
// import { Camera } from 'expo-camera';
import { router } from 'expo-router'
// import { useWallet } from '../../context/WalletContext';
// import * as WebBrowser from 'expo-web-browser';

function Index() {
  // const navigation = useNavigation();

  return (
    <Layout style={{ backgroundColor: colors.primary[2400], gap: 12 }}>
      <View>
        <Text style={{ color: colors.primary[200], ...texts.H4Bold }}>Crypto:</Text>
        <Button buttonStyle={{ variant: 'secondary', size: 'large', full: true }} size="small" text="USDC" onPress={() => router.push('/(app)/deposit/networks/stellar_usdc')} />
      </View>
    </Layout>
  );
}


export default Index;