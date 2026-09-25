import { programs as english } from '../en/programs';
import type { MessageShape } from '@/i18n/message-types';
export const programs = {
  ...english,
  title: '训练计划',
  count: '共 {count} 个计划。',
  generateWithAi: '用 AI 生成',
  create: '创建',
  noProgram: '还没有计划',
  noProgramDescription: '创建第一个计划后就可以开始训练。',
  active: '当前使用',
  sessions: '训练日',
  addSession: '添加训练日',
  activate: '启用',
  deactivate: '停用',
  editProgram: '编辑计划',
} satisfies MessageShape<typeof english>;
