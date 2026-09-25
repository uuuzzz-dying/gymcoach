import { navigation as english } from '../en/navigation';
import type { MessageShape } from '@/i18n/message-types';

export const navigation = {
  home: '首页',
  guide: '新手教程',
  history: '训练历史',
  progress: '进度',
  coach: '教练',
  chat: '对话',
  programs: '训练计划',
  catalog: '动作库',
  settings: '设置',
} satisfies MessageShape<typeof english>;
