import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';


interface DevModeProviderProps extends React.PropsWithChildren<{}> {
}

interface DevModeContextProps {
  isDevMode: boolean;
  toggleDevMode: () => void;
}

const DevModeContext = createContext<DevModeContextProps | undefined>(undefined);

export const DevModeProvider = ({ children }: DevModeProviderProps) => {
  const [isDevMode, setIsDevMode] = useState<boolean>(false);

  useEffect(() => {
    // Load isDevMode from AsyncStorage on mount
    const loadDevMode = async () => {
      const storedValue = await SecureStore.getItemAsync('isDevMode');
      if (storedValue !== null) {
        setIsDevMode(storedValue === 'true');
      }
    };
    loadDevMode();
  }, []);

  const toggleDevMode = async () => {
    const newValue = !isDevMode;
    setIsDevMode(newValue);
    await SecureStore.setItemAsync('isDevMode', newValue.toString());
  };

  return (
    <DevModeContext.Provider value={{ isDevMode, toggleDevMode }}>
      {children}
    </DevModeContext.Provider>
  );
};

export const useDevMode = () => {
  const context = useContext(DevModeContext);
  if (!context) {
    throw new Error('useDevMode must be used within a DevModeProvider');
  }
  return context;
};
