import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button, Layout, colors, texts } from 'nobak-native-design-system';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router'
import { useWallet } from '@/src/context/WalletContext';

function Apps() {
  // const navigation = useNavigation();
  const [scanned, setScanned] = useState(false);
  const { updateUri, appMetadata, successfulSession, disconnect } = useWallet()
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }


  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }: any) => {
    setScanned(true);
    updateUri(data);
    // router.push('/(app)/result');
  };


  const handleDisconnect = () => {
    disconnect()
    setScanned(false)
  }

  return (
    <View style={styles.container}>
      {!scanned &&
        <CameraView
          style={styles.camera}
          facing={'back'}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          <View style={styles.layerTop} />
          <View style={styles.focused} />
          <View style={styles.layerBottom} />
        </CameraView>
      }
      {scanned && appMetadata && successfulSession && <Layout style={{ backgroundColor: colors.primary[2000] }}>
        <Text style={{ color: colors.primary[400], ...texts.CaptionBold }}>Connected to:</Text>
        <Text style={{ color: colors.primary[100], ...texts.P1Medium }}>{appMetadata.name}</Text>
        <Text style={{ color: colors.primary[300], ...texts.P3Light }}>{appMetadata.description}</Text>
        <View>
          <Button text="Disconnect" onPress={() => handleDisconnect()} />
        </View>
      </Layout>}
      {scanned && <Button text={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  layerTop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  focused: {
    flex: 2,
    flexDirection: 'row'
  },
  layerBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
});

export default Apps;