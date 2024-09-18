import * as SecureStore from 'expo-secure-store';
import uuid from 'react-native-uuid';
import { generateKeyPair } from './Keypair';


const initApp = async () => {
    try {
        // Check if Device Installation ID exists
        let deviceInstallationId = await SecureStore.getItemAsync('deviceInstallationId');
        if (!deviceInstallationId) {
            deviceInstallationId = String(uuid.v4()); // Generate a new UUID
            await SecureStore.setItemAsync('deviceInstallationId', deviceInstallationId);
        }
        // Generate Device Public/Private Key Pair
        let devicePublicKey = await SecureStore.getItemAsync('devicePublicKey');
        if (!devicePublicKey) {
            const { publicKey, privateKey } = generateKeyPair();
            // Store keys securely
            await SecureStore.setItemAsync('devicePublicKey', publicKey);
            await SecureStore.setItemAsync('deviceSecretKey', privateKey);
        }
        
    } catch (error) {
        console.error('Error during app initialization:', error);
        throw error;
    }
}

export { initApp };
