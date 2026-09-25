import { auth as english } from '../en/auth';
import type { MessageShape } from '@/i18n/message-types';

export const auth = {
  login: {
    title: '登录',
    description: '打开你的个人训练记录。',
    submit: '登录',
    submitting: '正在登录…',
    demoTitle: '演示账号',
    demoSubmit: '使用演示账号',
    noAccount: '还没有账号？',
    createAccount: '立即注册',
    error: '登录失败。',
  },
  signup: {
    title: '创建账号',
    description: '开始记录你的训练。',
    submit: '创建账号',
    submitting: '正在创建…',
    hasAccount: '已有账号？',
    signIn: '去登录',
    error: '注册失败。',
  },
  logout: '退出登录',
  validation: {
    invalidEmail: '邮箱格式不正确',
    nameRequired: '请输入名称',
    passwordRequired: '请输入密码',
    passwordMin: '密码至少 8 个字符',
  },
} satisfies MessageShape<typeof english>;
