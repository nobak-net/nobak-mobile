import { encrypt } from './crypto';
import { runFetch } from './runFetch';
import { decodeJWT } from './jwt'
import { computeSharedSecret } from './Keypair';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const { API_URL } = Constants.expoConfig?.extra || {};

const getCredentials = async () => {
    const deviceSecretKey = await SecureStore.getItemAsync('deviceSecretKey');
    const installation_id = await SecureStore.getItemAsync('deviceInstallationId');
    const appPublicKey = await SecureStore.getItemAsync('appPublicKey');
    const key = computeSharedSecret(String(deviceSecretKey), String(appPublicKey))
    return { key, installation_id }
}

class SDK {
    async signIn(code: string, email: string) {
        const { key, installation_id } = await getCredentials()
        const payload = encrypt({ code, email }, key)
        const response = await runFetch({ url: `${API_URL}/auth/verify`, method: 'POST', body: JSON.stringify({ payload, type: 'OBJECT', installation_id }) });
        console.log('Response', response)
        if (response.status === 200 && response.data.token) {
            console.log('Status 200')
            console.log("response.data.token", response.data.token)
            try {
                const tokenDecoded = await decodeJWT(response.data.token, key)
                console.log('tokenDecoded', tokenDecoded)
                if (tokenDecoded) {
                    await SecureStore.setItemAsync('token', response.data.token)
                    return response;
                }
            } catch {
                return { message: 'Error' }
            }
        }
    }

    async sendEmail({ email }: any) {
        const { key, installation_id } = await getCredentials()
        console.log('key', key)
        console.log('installation_id', installation_id)
        if (email) {
            const payload = encrypt({ email: email }, key)
            const response = await runFetch({ url: `${API_URL}/auth/email`, method: 'POST', body: JSON.stringify({ payload, type: 'OBJECT', installation_id }) });
            return response;
        } else {
            // handle empty email field, maybe show an alert
            alert('Please enter an email');
        }
    }

    async initRecovery(public_key: string) {
        const { key, installation_id } = await getCredentials();

        const payload = encrypt({ public_key }, key);
        const response = await runFetch({
            url: `${API_URL}/recovery/register`,
            method: 'POST',
            body: { payload, type: 'OBJECT', installation_id },
            auth: true,
        });
        return response;
    }

    async submitSignedXDR(public_key: string, signed_xdr: string) {
        const { key, installation_id } = await getCredentials();

        const payload = encrypt({ public_key, signed_xdr }, key);
        const response = await runFetch({
            url: `${API_URL}/recovery/verify`,
            method: 'POST',
            body: { payload, type: 'OBJECT', installation_id },
            auth: true,
        });
        return response;
    }

    async getRecoveryProfile() {
        const response = await runFetch({
            url: `${API_URL}/recovery/account`,
            method: 'GET',
            auth: true,
            recovery: true
        });
        return response;
    }
}

export default new SDK();