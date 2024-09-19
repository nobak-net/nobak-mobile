import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button, Layout, colors, texts } from 'nobak-native-design-system';
import { Camera } from 'expo-camera';
import { router } from 'expo-router'
import { useWallet } from '@/src/context/WalletContext';
import * as WebBrowser from 'expo-web-browser';

function Apps() {
  // const navigation = useNavigation();
  const handlePressButtonAsync = async () => {
    let result = await WebBrowser.openBrowserAsync('https://funskill.cc');
    console.log(result);
  };

  return (
    <Layout style={{ backgroundColor: colors.primary[2400], gap: 12 }}>
      <View>
        <Text style={{ color: colors.primary[200], ...texts.H4Bold }}>Discover:</Text>
        <Button buttonStyle={{ variant: 'primary', size: 'tiny' }} size="small" text="Open Web Browser" onPress={handlePressButtonAsync} />
      </View>
    </Layout>
  );
}


export default Apps;