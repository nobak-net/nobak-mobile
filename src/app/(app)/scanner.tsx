import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button, Layout, colors, texts } from 'nobak-native-design-system';
import { Camera } from 'expo-camera';
import { router } from 'expo-router'
import { useWallet } from '@/src/context/WalletContext';

function Apps() {
  // const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const { updateUri, appMetadata, successfulSession, disconnect } = useWallet()

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }: any) => {
    setScanned(true);
    updateUri(data);
    // router.push('/(app)/result');
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const handleDisconnect = () => {
    disconnect()
    setScanned(false)
  }

  return (
    <View style={styles.container}>
      {!scanned &&
        <Camera
          style={styles.camera}
          type={Camera.Constants.Type.back}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          <View style={styles.layerTop} />
          <View style={styles.focused} />
          <View style={styles.layerBottom} />
        </Camera>
      }
      {scanned && appMetadata && successfulSession && <Layout>
        <Text style={{ color: colors.primary[2000], ...texts.CaptionBold }}>Connected to:</Text>
        <Text style={{ color: colors.primary[2400], ...texts.P1Medium }}>{appMetadata.name}</Text>
        <Text style={{ color: colors.primary[1700], ...texts.P3Light }}>{appMetadata.description}</Text>
        <View>
          <Button text="Disconnect" onPress={() => handleDisconnect()}/>
        </View>
      </Layout>}
      {/* {scanned && <Button text={'Tap to Scan Again'} onPress={() => setScanned(false)} />} */}
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