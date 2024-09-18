import * as SecureStore from 'expo-secure-store';
import { Transaction, Keypair } from '@stellar/stellar-base';
import { runFetch } from './runFetch';
import { encrypt } from './crypto';
import Constants from 'expo-constants';
import { computeSharedSecret } from './Keypair';
import * as CryptoJS from 'crypto-js';

const { API_URL } = Constants.expoConfig?.extra || {};
const horizonUrl = 'https://horizon-testnet.stellar.org'; // Use 'https://horizon.stellar.org' for the main network


class StellarAccount {
    public publicKey: string;
    private encryptedSecretKey: string; // Store encrypted secret key
    public publicKeySigner: string;
    public name: string;

    constructor(publicKey: string, encryptedSecretKey: string, publicKeySigner: string) {
        this.publicKey = publicKey;
        this.encryptedSecretKey = encryptedSecretKey;
        this.publicKeySigner = publicKeySigner;
        this.name = 'Default Account'; // Default name, can be set later
    }

    // Encrypt the secret key with a user-provided password
    private encryptSecretKey(secretKey: string, password: string): string {
        return CryptoJS.AES.encrypt(secretKey, password).toString();
    }

    // Decrypt the secret key with a user-provided password
    private decryptSecretKey(password: string): string {
        const bytes = CryptoJS.AES.decrypt(this.encryptedSecretKey, password);
        const decryptedKey = bytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedKey) {
            throw new Error('Invalid password or corrupted secret key');
        }

        return decryptedKey;
    }

    static generateKeypair(): { publicKey: string; secretKey: string } {
        const keypair = Keypair.random();
        return {
            publicKey: keypair.publicKey(),
            secretKey: keypair.secret(),
        };
    }

    // Store sensitive data under a key derived from publicKey
    async storeSensitiveData(password: string): Promise<void> {
        const accountData = {
            encryptedSecretKey: this.encryptSecretKey(this.encryptedSecretKey, password),
            publicKeySigner: this.publicKeySigner,
            // Any other sensitive data
        };
        await SecureStore.setItemAsync(`account_${this.publicKey}`, JSON.stringify(accountData));
    }

    // Load sensitive data when needed
    async loadSensitiveData(password: string): Promise<void> {
        const accountDataString = await SecureStore.getItemAsync(`account_${this.publicKey}`);
        if (accountDataString) {
            const accountData = JSON.parse(accountDataString);
            this.encryptedSecretKey = accountData.encryptedSecretKey;
            this.publicKeySigner = accountData.publicKeySigner;
            // Load other sensitive data if any
        } else {
            throw new Error('Account data not found');
        }
    }

    signTransaction(transactionXDR: string, password: string): string {
        // Decrypt the secret key

        let secretKey = this.decryptSecretKey(password);

        try {
            console.log('transactionXDR to SIGN', transactionXDR )
            // Create the transaction object
            const networkPassphrase = "Test SDF Network ; September 2015"; // or "Public Global Stellar Network ; September 2015"
            const transaction = new Transaction(transactionXDR, networkPassphrase);

            // Create keypair from secret key
            const keypair = Keypair.fromSecret(secretKey);
            // transaction.addSignature(keypair)
            // Sign the transaction
            transaction.sign(keypair);

            // Clear the secret key from memory
            // console.log('.toEnvelope().toXDR(base64)', transaction.toEnvelope().toXDR('base64'))

            secretKey = '';
            return transaction.toEnvelope().toXDR('base64')
        } catch (error) {
            throw new Error('Failed to sign transaction: ');
        } finally {
            // Ensure secret key is cleared even if an error occurs
            secretKey = '';
        }
    }



    async getBalance(): Promise<string> {
        // Simulate balance fetching
        return '0';
    }

    canSign(): boolean {
        return !!this.encryptedSecretKey;
    }

    isBackedUp(apiStoredAccounts: string[]): boolean {
        return apiStoredAccounts.includes(this.publicKey);
    }

}

const getPublicKey = async () => {
    return await SecureStore.getItemAsync('stellarAddress');
}

const getSecretKey = async () => {
    return await SecureStore.getItemAsync('stellarSecretKey');
}

const signTransaction = async (xdr: string) => {
    const secret = await getSecretKey();
    const publicKey = await getPublicKey()

    if (typeof secret === 'string') {
        const tx = new Transaction(xdr, "Test SDF Network ; September 2015");
        const keypair = Keypair.fromSecret(secret)
        tx.sign(keypair);
        const signature = tx.getKeypairSignature(keypair);
        const deviceSecretKey = await SecureStore.getItemAsync('deviceSecretKey');
        const installation_id = await SecureStore.getItemAsync('deviceInstallationId');
        const appPublicKey = await SecureStore.getItemAsync('appPublicKey');
        const key = computeSharedSecret(String(deviceSecretKey), String(appPublicKey))
        const payload = encrypt({ xdr: xdr, signature, publicKey }, key)
        const { data, message, status } = await runFetch({ url: `${API_URL}/tx/get_xdr`, method: 'POST', body: JSON.stringify({ payload, type: 'OBJECT', installation_id }) })

        if (status === 200) {
            return data.xdr;
        } else {
            return null
        }
    }
}

export { StellarAccount, getPublicKey, signTransaction }


// class StellarAccount {
//     public publicKey: string;
//     private secretKey: string;
//     public publicKeySigner: string;
//     public name: string;

//     constructor(publicKey: string, secretKey: string, publicKeySigner: string) {
//         this.publicKey = publicKey;
//         this.secretKey = secretKey;
//         this.publicKeySigner = publicKeySigner;
//         this.name = 'Default Account'; // Default name, can be set later
//     }

//     // Encrypt the secret key with a user-provided password
//     private encryptSecretKey(password: string): string {
//         return CryptoJS.AES.encrypt(this.secretKey, password).toString();
//     }

//     // Decrypt the secret key with a user-provided password
//     private decryptSecretKey(encryptedSecretKey: string, password: string): string {
//         const bytes = CryptoJS.AES.decrypt(encryptedSecretKey, password);
//         return bytes.toString(CryptoJS.enc.Utf8);
//     }

//     static generateKeypair(): { publicKey: string; secretKey: string } {
//         const keypair = Keypair.random();
//         return {
//             publicKey: keypair.publicKey(),
//             secretKey: keypair.secret(),
//         };
//     }

//     // Store sensitive data under a key derived from publicKey
//     async storeSensitiveData(password: string): Promise<void> {
//         const accountData = {
//             encryptedSecretKey: this.encryptSecretKey(password),
//             publicKeySigner: this.publicKeySigner,
//             // Any other sensitive data
//         };
//         await SecureStore.setItemAsync(`secret_${this.publicKey}`, JSON.stringify(accountData));
//     }

//     // Load sensitive data when needed
//     async loadSensitiveData(password: string): Promise<void> {
//         const accountDataString = await SecureStore.getItemAsync(`secret_${this.publicKey}`);
//         if (accountDataString) {
//             const accountData = JSON.parse(accountDataString);
//             this.secretKey = this.decryptSecretKey(accountData.encryptedSecretKey, password);
//             this.publicKeySigner = accountData.publicKeySigner;
//             // Load other sensitive data if any
//         }
//     }


//     async getBalance(): Promise<string> {
//         // Simulate balance fetching
//         return '0';
//     }

//     canSign(): boolean {
//         return !!this.secretKey;
//     }

//     isBackedUp(apiStoredAccounts: string[]): boolean {
//         return apiStoredAccounts.includes(this.publicKey);
//     }

//     signTransaction(transactionXDR: string, password: string): string {
//         // Decrypt the secret key
//         let secretKey = this.decryptSecretKey(password);

//         try {
//             // Create the transaction object
//             const networkPassphrase = "Test SDF Network ; September 2015"; // or "Public Global Stellar Network ; September 2015"
//             const transaction = new Transaction(transactionXDR, networkPassphrase);

//             // Create keypair from secret key
//             const keypair = Keypair.fromSecret(secretKey);

//             // Sign the transaction
//             transaction.sign(keypair);

//             // Clear the secret key from memory
//             secretKey = '';
//             return transaction.toXDR();
//         } catch (error) {
//             throw new Error('Failed to sign transaction: ' + error.message);
//         } finally {
//             // Ensure secret key is cleared even if an error occurs
//             secretKey = '';
//         }
//     }
// }

// const getPublicKey = async () => {
//     return await SecureStore.getItemAsync('stellarAddress');
// }

// const getSecretKey = async () => {
//     return await SecureStore.getItemAsync('stellarSecretKey');
// }

// const signTransaction = async (xdr: string) => {
//     const secret = await getSecretKey();
//     const publicKey = await getPublicKey()

//     if (typeof secret === 'string') {
//         const tx = new Transaction(xdr, "Test SDF Network ; September 2015");
//         const keypair = Keypair.fromSecret(secret)
//         tx.sign(keypair);
//         const signature = tx.getKeypairSignature(keypair);
//         const deviceSecretKey = await SecureStore.getItemAsync('deviceSecretKey');
//         const installation_id = await SecureStore.getItemAsync('deviceInstallationId');
//         const appPublicKey = await SecureStore.getItemAsync('appPublicKey');
//         const key = computeSharedSecret(String(deviceSecretKey), String(appPublicKey))
//         const payload = encrypt({ xdr: xdr, signature, publicKey }, key)
//         const { data, message, status } = await runFetch({ url: `${API_URL}/tx/get_xdr`, method: 'POST', body: JSON.stringify({ payload, type: 'OBJECT', installation_id }) })

//         if (status === 200) {
//             return data.xdr;
//         } else {
//             return null
//         }
//     }
// }

// export { StellarAccount, getPublicKey, getSecretKey, signTransaction }