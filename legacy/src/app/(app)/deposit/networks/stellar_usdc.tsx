import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { Button, Layout, colors, texts } from 'nobak-native-design-system';
import { router } from 'expo-router'

function StellarUSDC() {

  return (
    <Layout style={{ backgroundColor: colors.primary[2400], gap: 12 }}>
      <View>
        <Text style={{ color: colors.primary[200], ...texts.H4Bold }}>Stellar USDC:</Text>
        {/* <Button buttonStyle={{ variant: 'secondary', size: 'large', full: true }} size="small" text="USDC" onPress={() => router.push('/(app)/deposit/networks/stellar_usdc')} /> */}
        {/* <QRCode /> */}
      </View>
    </Layout>
  );
}


export default StellarUSDC;