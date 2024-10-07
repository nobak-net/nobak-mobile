
import Constants from 'expo-constants';
import { router } from 'expo-router';
import * as React from 'react';
import SDK from '@/src/utils/SDK';
import { loadSession, endSession } from '@/src/utils';

interface AuthProviderProps extends React.PropsWithChildren<{}> {}

interface AuthContextType {
  setEmail: (email: string) => void;
  signIn: (code: string) => void;
  signOut: () => void;
  email: string;
  session: any | null;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export function useAuth() {
  const { APP_ENV } = Constants.expoConfig?.extra || {};
  const value = React.useContext(AuthContext);

  if (!value && APP_ENV !== 'PRODUCTION') {
    throw new Error('useAuth must be wrapped in a <AuthProvider />');
  }

  return (
    value ?? {
      setEmail: () => {},
      signIn: () => {},
      signOut: () => {},
      email: '',
      session: null, // Ensure session defaults to null
    }
  );
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [email, setEmail] = React.useState('');
  const [session, setSession] = React.useState<any | null>(null);

  const signIn = async (code: string) => {
    const response = await SDK.signIn(code, email);
    if (response.status === 200) {
      setSession(await loadSession());
      router.push('/(app)');
    }
  };

  const signOut = async () => {
    await endSession();
    setSession(null);
    router.push('/');
  };

  // Automatically handle session-based navigation
  React.useEffect(() => {
    if (session) {
      router.push('/(app)');
    }
  }, [session]);

  // Load session on app start
  React.useEffect(() => {
    (async () => {
      const loadedSession = await loadSession();
      setSession(loadedSession || null); // Handle undefined sessions
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ signIn, signOut, session, setEmail, email }}>
      {children}
    </AuthContext.Provider>
  );
}