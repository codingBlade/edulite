import React, { createContext, useEffect, useState } from 'react';
import eng from './languages/eng';
import sep from './languages/sep';
import tso from './languages/tso';
import ven from './languages/ven';

// Language mapping
const LANGUAGE_MAP = {
  eng: eng,
  sep: sep,
  tso: tso,
  ven: ven,
};

// Get initial language from storage or default to English
const getInitialLanguage = async () => {
  // You can add AsyncStorage here later to remember user's choice
  return 'eng';
};

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('eng');
  const [translations, setTranslations] = useState(eng);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeLanguage();
  }, []);

  const initializeLanguage = async () => {
    try {
      const savedLanguage = await getInitialLanguage();
      setLanguage(savedLanguage);
      setTranslations(LANGUAGE_MAP[savedLanguage]);
    } catch (error) {
      console.error('Error initializing language:', error);
      setTranslations(eng); // Fallback to English
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = (lang) => {
    const selectedTranslations = LANGUAGE_MAP[lang] || eng;
    setLanguage(lang);
    setTranslations(selectedTranslations);

    // Save to AsyncStorage if you want persistence
    // AsyncStorage.setItem('userLanguage', lang);
  };

  // Translation function for dynamic keys
  const t = (key) => {
    return translations[key] || key; // Return key if translation not found
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        translations,
        t, // Add translation function
      }}
    >
      {!isLoading && children}
    </LanguageContext.Provider>
  );
};
