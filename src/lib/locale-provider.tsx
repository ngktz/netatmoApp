'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, useTranslation as useTranslationHook } from './translations';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children, defaultLocale = 'de' }: { children: ReactNode; defaultLocale?: Locale }) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  
  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem('locale') as Locale | null;
    if (savedLocale && ['de', 'en'].includes(savedLocale)) {
      setLocale(savedLocale);
    }
  }, []);
  
  useEffect(() => {
    // Save locale to localStorage
    localStorage.setItem('locale', locale);
    // Update html lang attribute
    document.documentElement.lang = locale;
  }, [locale]);
  
  const { t } = useTranslationHook(locale);
  
  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useTranslation must be used within LocaleProvider');
  }
  return context;
}

