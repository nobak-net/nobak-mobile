import * as SecureStore from 'expo-secure-store';
import { computeSharedSecret } from './Keypair';
import { decodeJWT } from './jwt';

const loadSession = async () => {
    try {
        const deviceSecretKey = await SecureStore.getItemAsync('deviceSecretKey');
        const appPublicKey = await SecureStore.getItemAsync('appPublicKey');
        const key = computeSharedSecret(String(deviceSecretKey), String(appPublicKey))

        const token = await SecureStore.getItemAsync('token');
        if (token) {
            const tokenDecoded = await decodeJWT(token, key)
            return tokenDecoded
        }

    } catch (error) {
        console.error('Error during load session:', error);
        throw error;
    }
}

const endSession = async () => {
    try {
        await SecureStore.setItemAsync('token', '');
    } catch (error) {
        console.error('Error during end session:', error);
        throw error;
    }
}


export { loadSession, endSession };
