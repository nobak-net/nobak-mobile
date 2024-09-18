// utils/Recovery.ts
import SDK from './SDK'; // Import the SDK instance
import * as SecureStore from 'expo-secure-store';

class Recovery {
  private sdk: typeof SDK;

  constructor() {
    this.sdk = SDK;
  }


  async register(public_key: string): Promise<{ xdr: string }> {
    try {
      const response = await this.sdk.initRecovery(public_key);
      console.log('response.data.XDR', !response.data.XDR);
      console.log('response', !response || !response.data.XDR, response);
  
      if (!response || !response.data || !response.data.XDR) {
        throw new Error('Failed to initiate recovery process');
      }
      console.log('response', response);
  
      // Extract XDR and return it in the expected format
      return { xdr: response.data.XDR };
    } catch (error: any) {
      console.error('Recovery.register Error:', error);
      throw error;
    }
  }

  async verify(public_key: string, signedXDR: string) {
    try {
        const response = await this.sdk.submitSignedXDR(public_key, signedXDR);
        
        if (!response || response.status !== 200) {
            throw new Error('Failed to submit signed XDR');
        }

        // Store the token securely
        if (response.data.token) {
            await SecureStore.setItemAsync('recovery-token', response.data.token);
        }

        console.log("Token stored successfully");
    } catch (error: any) {
        console.error('Recovery.verify Error:', error);
        throw error;
    }
}

  async profile(): Promise<any> {
    try {
      const response = await this.sdk.getRecoveryProfile();
      if (!response || response.status !== 200) {
        throw new Error('Failed to fetch profile');
      }
      return response.data;
    } catch (error: any) {
      console.error('Recovery.profile Error:', error);
      throw error;
    }
  }

}

export default new Recovery()