import { exercises as english } from '../en/exercises';
import type { MessageShape } from '@/i18n/message-types';
export const exercises = {
  ...english,
  title: '动作库',
  search: '按名称搜索动作',
  savedCount: '已保存 {count} 个动作。',
  restSeconds: '休息 {seconds} 秒',
  notes: '动作提示（可选）',
  media: {
    ...english.media,
    button: '动作教学',
    open: '查看 {name} 动作教学',
    start: '起始',
    finish: '结束',
    play: '播放示范',
    pause: '暂停示范',
    disclaimer: '图片仅供参考，不替代现场指导。出现锐痛立即停止。',
  },
} satisfies MessageShape<typeof english>;
