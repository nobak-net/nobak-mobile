import Constants from 'expo-constants';
import { router } from 'expo-router';
import * as React from 'react';
import SDK from '@/src/utils/SDK';
import { loadSession, endSession } from '@/src/utils';

interface AuthProviderProps extends React.PropsWithChildren<{}> {
}
// This hook can be used to access the user info.
const AuthContext = React.createContext<{
  setEmail: (email: string) => void;
  signIn: (code: string) => void;
  signOut: () => void;
  email: string;
  session: any;
} | null>(null);

// This hook can be used to access the user info.
export function useAuth() {
  const { APP_ENV } = Constants.expoConfig?.extra || {};

  const value = React.useContext(AuthContext);

  // Check if value is null and throw an error if in non-production environment
  if (!value && APP_ENV !== 'PRODUCTION') {
    throw new Error('useAuth must be wrapped in a <AuthProvider />');
  }

  // Return the value or provide a fallback to prevent accessing properties on null
  return value ?? {
    setEmail: () => {},
    signIn: () => {},
    signOut: () => {},
    email: '',
    session: null
  };
}
export function AuthProvider({ children }: AuthProviderProps) {
  const [email, setEmail] = React.useState('')
  const [session, setSession] = React.useState<any | null>(null)

  const signIn = async (code: string) => {
    const response = await SDK.signIn(code, email);
    if (response.status === 200) {
      setSession(await loadSession())
      router.push('/(app)')
    }
  }

  const signOut = async () => {
    await endSession()
    setSession(null)
    router.push('/sign_in')
  }

  React.useEffect(() => {
    (async () => {
      if (session) {
        router.push('/(app)')
      }
    })();
  }, [session]);

  React.useEffect(() => {
    (async () => {
      setSession(await loadSession())
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        session,
        setEmail,
        email
      }}>
      {children}
    </AuthContext.Provider>
  );
}

