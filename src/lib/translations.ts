import deTranslations from '../../locales/de/common.json';
import enTranslations from '../../locales/en/common.json';

export type Locale = 'de' | 'en';

const translations = {
  de: deTranslations,
  en: enTranslations,
};

export const defaultLocale: Locale = 'de';
export const locales: Locale[] = ['de', 'en'];

export function getTranslations(locale: Locale = defaultLocale) {
  return translations[locale] || translations[defaultLocale];
}

export function useTranslation(locale: Locale = defaultLocale) {
  const t = getTranslations(locale);
  
  return {
    t: (key: string, params?: Record<string, string | number>) => {
      const keys = key.split('.');
      let value: any = t;
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return key; // Return key if translation not found
        }
      }
      
      if (typeof value !== 'string') {
        return key;
      }
      
      // Replace parameters
      if (params) {
        return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
          return params[paramKey]?.toString() || match;
        });
      }
      
      return value;
    },
    locale,
  };
}

