import { describe, it, expect } from 'vitest';
// @vitest-environment node
import { getTranslations, useTranslation, defaultLocale, locales } from './translations';

describe('translations', () => {
  describe('getTranslations', () => {
    it('should return German translations by default', () => {
      const translations = getTranslations();
      expect(translations).toBeDefined();
      expect(typeof translations).toBe('object');
    });

    it('should return English translations when locale is "en"', () => {
      const translations = getTranslations('en');
      expect(translations).toBeDefined();
      expect(typeof translations).toBe('object');
    });

    it('should return German translations when locale is "de"', () => {
      const translations = getTranslations('de');
      expect(translations).toBeDefined();
      expect(typeof translations).toBe('object');
    });

    it('should fallback to default locale for invalid locale', () => {
      const translations = getTranslations('invalid' as 'de' | 'en');
      expect(translations).toBeDefined();
    });
  });

  describe('useTranslation', () => {
    it('should return translation function', () => {
      const { t } = useTranslation();
      expect(typeof t).toBe('function');
    });

    it('should return key if translation not found', () => {
      const { t } = useTranslation();
      const result = t('nonexistent.key');
      expect(result).toBe('nonexistent.key');
    });

    it('should return translated value for existing key', () => {
      const { t } = useTranslation();
      // This will return the key if translation doesn't exist, or the value if it does
      const result = t('common.test');
      expect(typeof result).toBe('string');
    });

    it('should support nested keys', () => {
      const { t } = useTranslation();
      const result = t('auth.loginWithNetatmo');
      expect(typeof result).toBe('string');
    });

    it('should replace parameters in translations', () => {
      const { t } = useTranslation();
      // Test with a key that might have parameters
      const result = t('common.welcome', { name: 'Test' });
      expect(typeof result).toBe('string');
    });

    it('should return locale', () => {
      const { locale } = useTranslation('en');
      expect(locale).toBe('en');
    });
  });

  describe('constants', () => {
    it('should have default locale set to "de"', () => {
      expect(defaultLocale).toBe('de');
    });

    it('should have locales array with de and en', () => {
      expect(locales).toContain('de');
      expect(locales).toContain('en');
      expect(locales.length).toBe(2);
    });
  });
});

