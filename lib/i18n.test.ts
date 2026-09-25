import { createTranslator } from 'next-intl';
import { describe, expect, it } from 'vitest';
import { isLocale, locales } from '@/i18n/config';
import englishMessages from '@/messages/en';
import chineseMessages from '@/messages/zh';

function messageKeys(value: unknown, prefix = ''): string[] {
  if (typeof value === 'string') return [prefix];
  if (!value || typeof value !== 'object') return [];

  return Object.entries(value).flatMap(([key, child]) =>
    messageKeys(child, prefix ? `${prefix}.${key}` : key),
  );
}

describe('i18n configuration', () => {
  it('recognizes only supported locales', () => {
    expect(locales).toEqual(['zh', 'en']);
    expect(isLocale('zh')).toBe(true);
    expect(isLocale('en')).toBe(true);
    expect(isLocale('fr')).toBe(false);
    expect(isLocale('ru')).toBe(false);
    expect(isLocale('de')).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });

  it('keeps every locale dictionary structurally complete', () => {
    expect(messageKeys(chineseMessages).sort()).toEqual(messageKeys(englishMessages).sort());
  });

  it('uses Chinese navigation and count labels', () => {
    const t = createTranslator({ locale: 'zh', messages: chineseMessages });
    expect(t('common.counts.sets', { count: 3 })).toBe('3 组');
    expect(t('navigation.settings')).toBe('设置');
    expect(t('navigation.guide')).toBe('新手教程');
  });
});
