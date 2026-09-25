import { navigation as english } from '../en/navigation';
import type { MessageShape } from '@/i18n/message-types';

export const navigation = {
  home: 'Главная',
  guide: 'Гид для новичка',
  history: 'История',
  progress: 'Прогресс',
  coach: 'Тренер',
  chat: 'Чат',
  programs: 'Программы',
  catalog: 'Упражнения',
  settings: 'Настройки',
} satisfies MessageShape<typeof english>;
