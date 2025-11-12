'use client';

import { useTranslation } from '@/lib/locale-provider';
import { Locale } from '@/lib/translations';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  const switchLanguage = (newLocale: Locale) => {
    setLocale(newLocale);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => switchLanguage('de')}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
          locale === 'de'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        aria-label="Deutsch"
      >
        DE
      </button>
      <button
        onClick={() => switchLanguage('en')}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
          locale === 'en'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}

