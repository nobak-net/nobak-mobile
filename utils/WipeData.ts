import * as SecureStore from 'expo-secure-store';

const WipeData = async () => {
    try {
        await SecureStore.deleteItemAsync('devicePublicKey');
        await SecureStore.deleteItemAsync('deviceSecretKey');
        await SecureStore.deleteItemAsync('appPublicKey');

    } catch (error) {
        console.error('Error during wipe data:', error);
        throw error;
    }
}

export { WipeData };
