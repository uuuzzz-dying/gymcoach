import { history as english } from '../en/history';
import type { MessageShape } from '@/i18n/message-types';
export const history = {
  ...english,
  title: '训练历史',
  noFiltered: '没有符合筛选条件的训练。',
  emptyTitle: '还没有训练记录',
  emptyDescription: '完成第一次训练后，这里会显示重量、组数和时长。',
  firstSession: '开始第一次训练',
  freeSession: '自由训练',
  cardio: '有氧',
  minutes: '{count} 分钟',
} satisfies MessageShape<typeof english>;
