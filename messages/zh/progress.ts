import { progress as english } from '../en/progress';
import type { MessageShape } from '@/i18n/message-types';
export const progress = {
  ...english,
  title: '进度',
  emptyTitle: '暂时还没有进度数据',
  emptyDescription: '完成几次训练后，这里会显示近 {weeks} 周的图表和个人纪录。',
  firstSession: '开始第一次训练',
  bodyweight: {
    ...english.bodyweight,
    title: '体重',
    current: '当前：{weight}',
    label: '体重（{unit}）',
    log: '记录',
    empty: '还没有体重记录。',
    second: '再记录一次即可查看变化。',
    onDate: '记录于 {date}',
  },
} satisfies MessageShape<typeof english>;
