'use client';

import React, { createContext, useContext, useState, useLayoutEffect, ReactNode } from 'react';
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
  const [language, setLanguage] = useState<Language>('en'); // Default to English
  const [isReady, setIsReady] = useState(false);

  // Load language from storage on mount using layout effect to avoid hydration mismatch
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = (localStorage.getItem('language') || localStorage.getItem('trip-planner-locale')) as Language | null;
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
        setLanguage(savedLanguage);
      } else {
        const browserLang = typeof navigator !== 'undefined' && navigator.language && navigator.language.startsWith('ar') ? 'ar' : 'en';
        setLanguage(browserLang);
      }
      setIsReady(true);
    }
  }, []);

  // Save language to storage and update document when it changes
  useLayoutEffect(() => {
    if (typeof window !== 'undefined' && isReady) {
      // Persist the language
      try {
        localStorage.setItem('language', language);
        localStorage.setItem('trip-planner-locale', language);
      } catch (e) {
        console.warn('Could not persist language to localStorage', e);
      }

      // Update document attributes synchronously before paint
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.classList.remove('rtl', 'ltr');
      document.documentElement.classList.add(language === 'ar' ? 'rtl' : 'ltr');

      // Update document title
      const siteName = language === 'ar' ? 'نخبة النقل' : 'Nukhbat Al-Naql';
      document.title = siteName;

      // Dispatch a languagechange event
      try {
        window.dispatchEvent(new Event('languagechange'));
      } catch (e) {
        // ignore
      }
    }
  }, [language, isReady]);

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
