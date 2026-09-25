import { exercises as english } from '../en/exercises';
import type { MessageShape } from '@/i18n/message-types';
export const exercises = {
  ...english,
  title: '动作库',
  search: '按名称搜索动作',
  savedCount: '已保存 {count} 个动作。',
  showingFirst: '正在显示前 {shown} 个，共 {total} 个。请输入更具体的关键词缩小范围。',
  restSeconds: '休息 {seconds} 秒',
  notes: '动作提示（可选）',
  media: {
    ...english.media,
    button: '动作教学',
    open: '查看 {name} 动作教学',
    description: '训练前先结合动画和中文步骤熟悉动作。',
    start: '起始',
    finish: '结束',
    play: '播放示范',
    pause: '暂停示范',
    disclaimer: '图片仅供参考，不替代现场指导。出现锐痛立即停止。',
    animationAlt: '{name} 动作动画示范',
    animationSource: '动画来源：动作数据集 · {attribution}',
    steps: '中文动作步骤',
    loading: '正在加载动画…',
  },
} satisfies MessageShape<typeof english>;
