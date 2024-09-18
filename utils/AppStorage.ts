import * as SecureStore from 'expo-secure-store';

export interface AppStorageTypes {
  token: string;
  refresh_token: string;
}

class AppStorage {
  private session: AppStorageTypes;
  private static instance: AppStorage;

  constructor() {
    this.session = {
      token: '',
      refresh_token: '',
    };
  }

  public static async initialize(): Promise<AppStorage> {
    if (!AppStorage.instance) {
      AppStorage.instance = new AppStorage();
      await AppStorage.instance.loadSession();
    }
    return AppStorage.instance;
  }

  private async loadSession(): Promise<void> {
    try {
      const keys = Object.keys(this.session) as Array<keyof AppStorageTypes>;
      for (const key of keys) {
        const value = await SecureStore.getItemAsync(key);
        if (value !== null) {
          (this.session as any)[key] = value
        } else {
          // If no value is found in SecureStore, keep the default or set an empty string
          (this.session as any)[key] = this.session[key] || '';
        }
      }
    } catch (error) {
      console.error('Error loading app session:', error);
    }
  }

  // Getters and setters for token
  get token(): string {
    return this.session.token;
  }

  set token(value: string) {
    this.session.token = value;
    SecureStore.setItemAsync('token', value);
  }

  // Getters and setters for refresh_token
  get refresh_token(): string {
    return this.session.refresh_token;
  }

  set refresh_token(value: string) {
    this.session.refresh_token = value;
    SecureStore.setItemAsync('refresh_token', value);
  }
}


export default AppStorage;
