// import React from 'react';
// import { PasswordAuthentication, BiometricAuthentication } from '../strategies/AuthStrategy';
// import { AuthStrategy } from '../strategies/AuthStrategy';
// import * as SecureStore from 'expo-secure-store';
// import { View, Text } from 'react-native';

// type AuthenticationContextType = {
//   hasAccount: boolean;
// };

// export const AuthenticationContext = React.createContext<AuthenticationContextType>(
//   {} as AuthenticationContextType
// );

// export const AuthenticationProvider = ({ children }: any) => {
//   const [authStrategy, setAuthStrategy] = React.useState(new PasswordAuthentication());
//   // const switchStrategy = (strategy: string) => {
//   //   setAuthStrategy(strategy === 'biometric' ? new BiometricAuthentication() : new PasswordAuthentication());
//   // };
//   const hasAccount = true;
//   React.useEffect(() => {
//     if (!hasAccount) {
//       navigation.navigate('root', {
//         screen: 'settings',
//         params: {
//           screen: 'media',
//         },
//       });
//     }
//     // (async () => {
//     //   const storedMethod = await SecureStore.getItemAsync('authenticationMethod');
//     //   if (storedMethod === 'biometric') {
//     //     setAuthStrategy(new BiometricAuthentication());
//     //   } else {
//     //     setAuthStrategy(new PasswordAuthentication());
//     //   }
//     // })();
//   }, []);

//   return (
//     <AuthenticationContext.Provider value={{ hasAccount }}>
//       {hasAccount ? children : <></> }
//     </AuthenticationContext.Provider>
//   );
// };

import Constants from 'expo-constants';
import { initApp } from '../utils';
import { runFetch } from '../utils/runFetch';
import { encrypt } from '../utils/crypto';
import { router } from 'expo-router'
import * as React from 'react';
import { useStorageState } from './useStorageState';
import AppConfig from '../utils/AppConfig';

const AuthContext = React.createContext<{ signIn: (code: string) => void; signOut: () => void; session?: string | null, isLoading: boolean } | null>(null);

// This hook can be used to access the user info.
export function useSession() {
  const { NODE_ENV } = Constants.expoConfig?.extra || {};

  const value = React.useContext(AuthContext);
  if (NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }
  return value;
}

const emailChallenge = async (email: string) => {

}

const signIn = async (code: string) => {
  const payload = encrypt({ code, email: 'hola@julianclatro.com' }, 'ThisIs32BytesLongSecretForAES!!!')
  const response = await runFetch('http://192.168.1.103:8782/auth/verify', 'POST', JSON.stringify({ payload, type: 'OBJECT' }));
  if (response.status === 200) {
    router.push('/(app)')
  }
}

export function AuthProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  React.useEffect(() => {
    (async () => {
      await initApp();
      await AppConfig.loadSettings();
      console.info('App Initialization:', { deviceInstallationId: AppConfig.deviceInstallationId });
      if (!AppConfig.tour) {
        router.push('/onboard/greetings')
      }
    })();
  }, []);

  React.useEffect(() => {

    if (session === null) {
      router.push('/sign_in')
    }
  }, [session])

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut: () => {
          setSession(null);
          router.push('/onboard/greetings')
        },
        session,
        isLoading,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
}

