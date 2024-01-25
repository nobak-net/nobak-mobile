import Constants from 'expo-constants';
import { router } from 'expo-router';
import * as React from 'react';
import { useStorageState } from './useStorageState';
import AppConfig from '../utils/AppConfig';
import SDK from '../utils/SDK';
import Device from '../utils/Device';
import APIService from '../utils/APIService';

interface AuthProviderProps extends React.PropsWithChildren<{}> {
}

const AuthContext = React.createContext<{ signIn: (code: string) => void; signOut: () => void; session?: string | null, isLoading: boolean } | null>(null);

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
  const [[isLoading, session], setSession] = useStorageState('session');
  const [ email, setEmail ] = React.useState('')

  const signIn = async (code: string) => {
    const response = await SDK.signIn(code, email);
    if (response.status === 200) {
      router.push('/(app)')
    }
  }

  React.useEffect(() => {
    (async () => {
      const settings = await AppConfig.initialize();
      const { data } = await APIService.health()
      if (data.status === 'ONLINE') {
        await Device.init()
      } else if (data.status === 'OFFLINE') {
        router.push('/offline')
      }
      if (!settings.tour) {
        router.push('/onboard/greetings')
      }
    })();
  }, []);

  React.useEffect(() => {
    if (session === null) {
      router.push('/')
    }
  }, [session])

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut: () => {
          setSession(null);
          router.push('/sign_in')
        },
        session,
        isLoading,
      }}>
        {children}
    </AuthContext.Provider>
  );
}

