'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, getNestedTranslation } from '@/i18n/translations';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [language, setLanguage] = useState<Language>('en');

  // Load language from storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check both possible storage keys for backward compatibility
      const savedLanguage = localStorage.getItem('language') || localStorage.getItem('trip-planner-locale') as Language;
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
        setLanguage(savedLanguage);
      } else {
        // Detect browser language
        const browserLang = navigator.language.startsWith('ar') ? 'ar' : 'en';
        setLanguage(browserLang);
      }
    }
  }, []);

  // Save language to storage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Save to both keys for compatibility
      localStorage.setItem('language', language);
      localStorage.setItem('trip-planner-locale', language);
      
      // Update document direction and language
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      
      // Add RTL class for better CSS support
      document.documentElement.classList.toggle('rtl', language === 'ar');
      document.documentElement.classList.toggle('ltr', language === 'en');
      
      // Update document title
      const siteName = language === 'ar' ? 'نخبة النقل' : 'Nukhbat Al-Naql';
      document.title = siteName;
    }
  }, [language]);

  const t = (key: string): string => {
    try {
      const translation = getNestedTranslation(translations[language], key);
      // If translation not found, try English as fallback
      if (translation === key && language !== 'en') {
        const fallbackTranslation = getNestedTranslation(translations.en, key);
        return fallbackTranslation !== key ? fallbackTranslation : key;
      }
      return translation;
    } catch (error) {
      console.warn(`Translation key "${key}" not found for language "${language}"`);
      return key;
    }
  };

  const isRTL = language === 'ar';

  const value: TranslationContextType = {
    language,
    setLanguage,
    t,
    isRTL,
  };

  return (
    <TranslationContext.Provider value={value}>
      <div className={isRTL ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </TranslationContext.Provider>
  );
}

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    // Return default values instead of throwing error during SSR
    return {
      language: 'en' as Language,
      setLanguage: () => {},
      t: (key: string) => key,
      isRTL: false
    };
  }
  return context;
};

// Hook for easy access to translation function
export const useT = () => {
  const { t } = useTranslation();
  return t;
};
