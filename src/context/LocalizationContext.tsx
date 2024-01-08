// LocalizationContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import en from '../../metadata/locales/en.json'
import es from '../../metadata/locales/es.json'

const translations = { en, es };

const LocalizationContext = createContext({
  t: en, // default language
  setLanguage: (lang: string) => {}
});

export const useLocalization = () => useContext(LocalizationContext);

export const LocalizationProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState('en');

  const value = {
    t: translations[language],
    setLanguage
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};
