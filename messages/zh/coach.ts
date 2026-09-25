import { coach as english } from '../en/coach';
import type { MessageShape } from '@/i18n/message-types';
export const coach = {
  ...english,
  title: '教练',
  description: '根据你的训练记录进行每周回顾。',
  chatTitle: '对话',
  chatDescription: '带着你的训练数据与教练交流。',
  conversation: '对话',
  note: {
    ...english.note,
    title: '给教练的备注',
    description: '记录训练数据里看不到的情况，例如疾病、不适或生活限制。',
    placeholder: '例如：我是新手，请优先保守和安全的建议。',
    clear: '清空',
    save: '保存',
    saved: '备注已保存。',
    cleared: '备注已清空。',
    error: '无法保存备注。',
  },
} satisfies MessageShape<typeof english>;
