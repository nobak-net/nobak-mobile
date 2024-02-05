import Constants from 'expo-constants';
import { router } from 'expo-router';
import * as React from 'react';
import AppConfig from '../utils/AppConfig';
import SDK from '../utils/SDK';
import Device from '../utils/Device';
import APIService from '../utils/APIService';
import * as Localization from 'expo-localization';

interface AuthProviderProps extends React.PropsWithChildren<{}> {
}

const AuthContext = React.createContext<{ setEmail: (email: string) => void, signIn: (code: string) => void; signOut: () => void; email: string } | null>(null);

// This hook can be used to access the user info.
export function useSession() {
  const { APP_ENV } = Constants.expoConfig?.extra || {};

  const value = React.useContext(AuthContext);
  if (APP_ENV !== 'PRODUCTION') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }
  return value;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // const [[isLoading, session], setSession] = useStorageState('session');
  const { useLocales } = Localization;
  const [email, setEmail] = React.useState('')
  const [localization, setLocalization] = React.useState(useLocales())

  const signIn = async (code: string) => {
    const response = await SDK.signIn(code, email);
    if (response.status === 200) {
      router.push('/(app)')
    }
  }

  React.useEffect(() => {
    (async () => {
      const settings = await AppConfig.initialize();
      console.log('settings', settings)
      const { data } = await APIService.health()
      if (data.status === 'ONLINE') {
        const { currencyCode, languageCode, regionCode } = localization[0];
        await Device.init({ currencyCode, languageCode, regionCode })
      } else if (data.status === 'OFFLINE') {
        router.push('/offline')
      }
      if (!settings.tour) {
        router.push('/onboard/greetings')
      }
      if (settings.token) {
        router.push('/(app)')
      }
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut: () => {
          router.push('/sign_in')
        },
        setEmail,
        email
      }}>
      {children}
    </AuthContext.Provider>
  );
}

