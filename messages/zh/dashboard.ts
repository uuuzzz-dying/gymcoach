import { dashboard as english } from '../en/dashboard';
import type { MessageShape } from '@/i18n/message-types';

export const dashboard = {
  ...english,
  activeSession: '进行中的训练',
  sessionFallback: '训练',
  startedOn: '{name} 开始于 {date}',
  resumeSession: '继续训练',
  noActiveProgram: '暂无训练计划',
  noActiveProgramDescription: '先启用一个计划，再开始训练。',
  viewPrograms: '查看计划',
  emptyProgram: '计划为空',
  emptyProgramDescription: '{name} 还没有训练日。',
  configureProgram: '设置计划',
  startSession: '开始训练',
  activeProgram: '当前计划：{name}',
  chooseSession: '选择训练日',
  programSessions: '计划内训练',
  insight: {
    deloadTitle: '也许该恢复一下了',
    stalledTitle: '{count} 个动作近期停滞',
    stalledDetail: '{names} 近期没有进步。小幅调整重量、次数或动作技术即可。',
    prTitle: '新的个人纪录',
    prWeightDetail: '上次训练中，{name} 完成了新的最大重量。',
    prOneRmDetail: '上次训练中，{name} 完成了新的估算 1RM。',
    consistentTitle: '你正在稳定训练',
    consistentDetail: '本周已训练 {count} 天，继续保持。',
    deloadStalledReason: '{count} 个动作近期停滞：{names}。',
    deloadReadinessReason: '最近 {checkins} 次状态记录平均为 {average}/5。',
  },
} satisfies MessageShape<typeof english>;
