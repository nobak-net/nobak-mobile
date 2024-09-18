import * as SecureStore from 'expo-secure-store';
export type ThemeType = 'light' | 'dark';
export type LanguageType = 'en' | 'es' | 'fr'; // Add more as needed

export interface AppConfigTypes {
  tour: boolean;
  terms: boolean;
  privacy: boolean;
  theme: ThemeType;
  language: LanguageType;
  region: string;
  country: string;
  defaultCurrency: string;
}

class AppConfig {
  private settings: AppConfigTypes;
  private static instance: AppConfig;

  constructor() {
    this.settings = {
      tour: false,
      terms: false,
      privacy: false,
      theme: 'light', // Default value
      language: 'en', // Default value
      region: '',
      country: '',
      defaultCurrency: '',
    };
  }

  public static async initialize(): Promise<AppConfig> {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
      await AppConfig.instance.loadSettings();
    }
    return AppConfig.instance;
  }


  private async loadSettings(): Promise<void> {
    try {
      const keys = Object.keys(this.settings) as Array<keyof AppConfigTypes>;
      for (const key of keys) {
        const value = await SecureStore.getItemAsync(key);
        if (value !== null) {
          (this.settings as any)[key] = castToSettingType(key, value);
        } else {
          // If no value is found in SecureStore, keep the default or set an empty string
          (this.settings as any)[key] = this.settings[key] || '';
        }
      }
    } catch (error) {
      console.error('Error loading app settings:', error);
    }
  }

  public get tour(): boolean {
    return this.settings.tour;
  }

  public set tour(completed: boolean) {
    this.settings.tour = completed;
    SecureStore.setItemAsync('tour', JSON.stringify(completed));
  }

  // Getters and setters for theme
  get theme(): ThemeType {
    return this.settings.theme;
  }

  set theme(value: ThemeType) {
    this.settings.theme = value;
    // Optionally store in SecureStore if necessary
  }

  // Getters and setters for language
  get language(): LanguageType {
    return this.settings.language;
  }

  set language(value: LanguageType) {
    this.settings.language = value;
    // Optionally store in SecureStore if necessary
  }

  // Getters and setters for region
  get region(): string {
    return this.settings.region;
  }

  set region(value: string) {
    this.settings.region = value;
    SecureStore.setItemAsync('region', value);
  }

  // Getters and setters for country
  get country(): string {
    return this.settings.country;
  }

  set country(value: string) {
    this.settings.country = value;
    SecureStore.setItemAsync('country', value);
  }

  // Getters and setters for defaultCurrency
  get defaultCurrency(): string {
    return this.settings.defaultCurrency;
  }

  set defaultCurrency(value: string) {
    this.settings.defaultCurrency = value;
    SecureStore.setItemAsync('defaultCurrency', value);
  }
}


function castToSettingType(key: keyof AppConfigTypes, value: string): AppConfigTypes[keyof AppConfigTypes] {
  switch (key) {
    case 'theme':
    case 'language':
      // These are non-string types in AppConfigTypes, handle casting here
      return value as unknown as AppConfigTypes[keyof AppConfigTypes];
    default:
      // Assuming all other types are strings
      return value;
  }
}

export default AppConfig;
