import type { Locale } from './config';
import type englishMessages from '@/messages/en';

type AppMessages = typeof englishMessages;

const loaders = {
  zh: () => import('@/messages/zh').then((module) => module.default),
  en: () => import('@/messages/en').then((module) => module.default),
} satisfies Record<Locale, () => Promise<AppMessages>>;

export async function loadMessages(locale: Locale): Promise<AppMessages> {
  return loaders[locale]();
}
