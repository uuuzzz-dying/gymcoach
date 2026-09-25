export const locales = ['zh', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'zh';
export const localeCookieName = 'gymcoach.locale';
export const localeCookieMaxAge = 60 * 60 * 24 * 365;

export function isLocale(value: string | null | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export const localeLabels: Record<Locale, string> = {
  zh: '简体中文',
  en: 'English',
};
