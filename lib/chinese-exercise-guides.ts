export interface ChineseExerciseGuide {
  href: string;
  title: string;
  focus: string;
  cues: string[];
}

const guides: Record<string, ChineseExerciseGuide> = {
  'Machine chest press': {
    href: 'https://www.bilibili.com/video/BV1bY411N7aQ/',
    title: 'B站：坐姿推胸详细教程',
    focus: '胸大肌；肱三头肌辅助',
    cues: [
      '把手调到胸口中部附近，肩胛骨向后下方固定。',
      '推出时想象用上臂把胸口向中间夹，不要耸肩抢力。',
      '肘部不要硬锁死，回程慢而可控。',
    ],
  },
  'Neutral-grip lat pulldown': {
    href: 'https://www.bilibili.com/video/BV1dC4y1r7nQ/',
    title: 'B站：高位下拉详细教程',
    focus: '背阔肌；肱二头肌辅助',
    cues: [
      '先把肩膀向下沉，再让肘部朝髋部方向拉。',
      '胸口微微抬起，身体只需轻微后倾，不要大幅后仰。',
      '想象“肘在拉”，不要只想着用手把杆拽下来。',
    ],
  },
  'Lat pulldown (wide grip)': {
    href: 'https://www.bilibili.com/video/BV1dC4y1r7nQ/',
    title: 'B站：高位下拉详细教程',
    focus: '背阔肌；上背辅助',
    cues: [
      '先沉肩，再把肘部向下拉。',
      '把杆拉向上胸，不要拉到颈后。',
      '回程保持控制，让背阔肌充分拉长。',
    ],
  },
  'Chest-supported machine row': {
    href: 'https://www.bilibili.com/video/BV1m2421L7tw/',
    title: 'B站：器械坐姿划船教程',
    focus: '中背、背阔肌；肱二头肌辅助',
    cues: [
      '胸口贴住靠垫，肩膀远离耳朵。',
      '肘部向后拉，末端轻轻夹紧肩胛骨。',
      '不要用身体后仰借力，回程慢慢伸展。',
    ],
  },
  'Seated cable row (close handles)': {
    href: 'https://www.bilibili.com/video/BV1UG411k7ZM/',
    title: 'B站：坐姿划船详解',
    focus: '中背、背阔肌；肱二头肌辅助',
    cues: [
      '躯干稳定，胸口自然挺起。',
      '把手拉向肚脐附近，肘部贴近身体向后走。',
      '末端夹背，回程不要含胸甩出去。',
    ],
  },
  'Leg press (45 deg)': {
    href: 'https://www.bilibili.com/video/BV1Ep4y1o7n9/',
    title: 'B站：Leg Press 腿举保姆级教程',
    focus: '股四头肌、臀肌',
    cues: [
      '双脚约肩宽放在踏板中部，膝盖方向跟脚尖一致。',
      '下降到腰背仍能贴住靠垫的深度，不要追求过深。',
      '推起时不要把膝盖硬锁死。',
    ],
  },
  'Seated leg curl': {
    href: 'https://www.bilibili.com/video/BV1Hx4y1Y7TN/',
    title: 'B站：坐姿腿弯举保姆级教程',
    focus: '大腿后侧腘绳肌',
    cues: [
      '膝关节尽量对准机器转轴，滚垫压在脚踝上方。',
      '背和髋贴稳靠垫，用大腿后侧把小腿向下/后卷。',
      '收缩处停一下，再慢慢回到起点。',
    ],
  },
  'Machine crunch': {
    href: 'https://www.bilibili.com/video/BV1Wz4y1y7vr/',
    title: 'B站：卷腹机正确用法',
    focus: '腹直肌',
    cues: [
      '不是用手臂拉机器，想象肋骨向骨盆靠近。',
      '骨盆保持稳定，用腹部把躯干卷起来。',
      '回程不要完全放松，让腹部持续有张力。',
    ],
  },
  'Seated dumbbell overhead press': {
    href: 'https://www.bilibili.com/video/BV1Mk4y1U7ki/',
    title: 'B站：新手肩部训练教学',
    focus: '三角肌前束和中束；肱三头肌辅助',
    cues: [
      '背部贴稳靠垫，核心收紧，不要用腰部大幅反弓。',
      '肘部在手腕下方，向上推时不要耸肩。',
      '下降到舒适范围即可，不追求过深。',
    ],
  },
};

export function getChineseExerciseGuide(
  exerciseName: string,
  displayName?: string,
): ChineseExerciseGuide {
  const exact = guides[exerciseName];
  if (exact) return exact;

  const label = displayName || exerciseName;
  return {
    href: `https://search.bilibili.com/all?keyword=${encodeURIComponent(`${label} 健身 动作教程`)}`,
    title: 'B站：搜索中文动作教程',
    focus: '以动作卡显示的主要目标肌群为主',
    cues: [
      '先用轻重量熟悉轨迹，再进入正式组。',
      '动作全程保持稳定，不用甩动或突然加速借力。',
      '出现尖锐疼痛、关节夹痛或明显异常不适时立即停止。',
    ],
  };
}
