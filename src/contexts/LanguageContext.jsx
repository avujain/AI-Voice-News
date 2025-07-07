import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [readingLanguage, setReadingLanguage] = useState('en');
  const [speakingLanguage, setSpeakingLanguage] = useState('en-US');

  useEffect(() => {
    const savedReadingLang = localStorage.getItem('readingLanguage');
    const savedSpeakingLang = localStorage.getItem('speakingLanguage');
    
    if (savedReadingLang) setReadingLanguage(savedReadingLang);
    if (savedSpeakingLang) setSpeakingLanguage(savedSpeakingLang);
  }, []);

  const handleSetReadingLanguage = (lang) => {
    setReadingLanguage(lang);
    localStorage.setItem('readingLanguage', lang);
  };

  const handleSetSpeakingLanguage = (lang) => {
    setSpeakingLanguage(lang);
    localStorage.setItem('speakingLanguage', lang);
  };

  return (
    <LanguageContext.Provider value={{
      readingLanguage,
      speakingLanguage,
      setReadingLanguage: handleSetReadingLanguage,
      setSpeakingLanguage: handleSetSpeakingLanguage,
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
