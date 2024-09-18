// Device.ts
import APIService from './APIService';
import { type ApiResponse } from './APIService';
import { generateKeyPair } from './Keypair';
import * as SecureStore from 'expo-secure-store';
import uuid from 'react-native-uuid'; // Make sure to install the uuid library

interface DeviceInfo {
  installationId: string;
  devicePublicKey: string;
  currencyCode: string;
  languageCode: string;
  regionCode: string;
}

interface DeviceRegistrationResponse {
  data: any
}

class Device {
  private deviceInfo: DeviceInfo;

  constructor() {
    this.deviceInfo = {
      installationId: '',
      devicePublicKey: '',
      currencyCode: '',
      languageCode: '',
      regionCode: '',
    };
  }

  async init({ currencyCode, languageCode, regionCode }: any): Promise<DeviceInfo> {
    let deviceInstallationId = await SecureStore.getItemAsync('deviceInstallationId');

    // If deviceInstallationId is null, generate a new UUID
    if (deviceInstallationId === null) {
      // Force uuid.v4() to be treated as a string
      deviceInstallationId = String(uuid.v4());
      await SecureStore.setItemAsync('deviceInstallationId', deviceInstallationId);
    }
    this.deviceInfo.installationId = deviceInstallationId;

    let devicePublicKey = await SecureStore.getItemAsync('devicePublicKey');
    this.deviceInfo.devicePublicKey = String(devicePublicKey);

    this.deviceInfo.currencyCode = currencyCode;
    this.deviceInfo.languageCode = languageCode;
    this.deviceInfo.regionCode = regionCode;


    // this.deviceInfo.status = 'ONLINE'
    const isRegistered = await this.check()
    // console.log('isRegistered', isRegistered)
    if (isRegistered?.error?.status === 400) {
      await this.register()
      // console.log('registering')
    }

    return this.deviceInfo;
  }

  async check(): Promise<ApiResponse<any>> {
    return await APIService.checkInstallation(this.deviceInfo.installationId);
  }

  async register() {
    const response = await APIService.registerApp(this.deviceInfo);
    if (response.data.app_public_key) {
      await SecureStore.setItemAsync('appPublicKey', response.data.app_public_key);
    }
  }
}

export default new Device();
