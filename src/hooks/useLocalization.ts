import { useState, useEffect } from 'react';
import { UI_TEXTS, DEFAULT_LANGUAGE, type Language, type UITextKey } from '../config/localization';

/**
 * Custom hook for managing localization in the SmartRail-AI application
 * Provides clean separation between UI text and business logic
 */
export const useLocalization = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(DEFAULT_LANGUAGE);

  // Get localized text for a given key
  const getText = (key: UITextKey): string => {
    return UI_TEXTS[currentLanguage][key] || UI_TEXTS[DEFAULT_LANGUAGE][key] || key;
  };

  // Change the current language
  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    // Could persist to localStorage here if needed
    localStorage.setItem('smartrail-language', language);
  };

  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('smartrail-language') as Language;
    if (savedLanguage && UI_TEXTS[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  return {
    currentLanguage,
    setLanguage,
    getText,
    availableLanguages: Object.keys(UI_TEXTS) as Language[],
  };
};

export default useLocalization;
