import Link from 'next/link';
import { HeartPulse, CalendarDays } from 'lucide-react';
import { db } from '@/lib/db';
import { requireSession } from '@/lib/auth';
import { Button } from '@/components/ui/button';

const schedule = ['恢复日', 'Push · 胸肩三头', '轻团课 / 散步', 'Pull · 背部二头', '恢复 / 轻松活动', 'Legs · 腿臀核心', '自选轻团课 / 有氧'];
const dayKey = (date: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(date);

export default async function DashboardPage() {
  const { userId } = await requireSession();
  const [user, program, sessions, activities, readiness] = await Promise.all([
    db.user.findUnique({ where: { id: userId }, select: { displayName: true, membershipPence: true } }),
    db.program.findFirst({ where: { userId, isActive: true }, include: { workouts: { orderBy: { order: 'asc' } } } }),
    db.session.findMany({ where: { userId }, select: { id: true, startedAt: true, finishedAt: true }, orderBy: { startedAt: 'desc' } }),
    db.activityLog.findMany({ where: { userId }, select: { date: true, atGym: true, kind: true } }),
    db.readinessCheckin.findFirst({ where: { userId }, orderBy: { createdAt: 'desc' } }),
  ]);
  const today = dayKey(new Date());
  const weekday = new Date(`${today}T12:00:00Z`).getUTCDay();
  const completed = sessions.filter((session) => session.finishedAt);
  const active = sessions.find((session) => !session.finishedAt);
  const firstVisit = !completed.length && !activities.some((entry) => entry.kind === 'orientation');
  const gymDates = new Set([...completed.map((session) => dayKey(session.startedAt)), ...activities.filter((entry) => entry.atGym).map((entry) => entry.date)]);
  const habitDates = new Set([...gymDates, ...activities.map((entry) => entry.date)]);
  let streak = 0;
  const cursor = new Date(`${today}T12:00:00Z`);
  if (!habitDates.has(today)) cursor.setUTCDate(cursor.getUTCDate() - 1);
  while (habitDates.has(cursor.toISOString().slice(0, 10))) { streak++; cursor.setUTCDate(cursor.getUTCDate() - 1); }
  const monthVisits = [...gymDates].filter((date) => date.startsWith(today.slice(0, 7))).length;
  const monday = new Date(`${today}T12:00:00Z`); monday.setUTCDate(monday.getUTCDate() - ((weekday + 6) % 7));
  const weekCount = completed.filter((session) => dayKey(session.startedAt) >= monday.toISOString().slice(0, 10) && dayKey(session.startedAt) <= today).length;
  const fee = user?.membershipPence;
  const todayWorkout = program?.workouts.find((workout) => workout.dayOfWeek === (weekday || 7));
  return <main className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6 sm:py-10">
    <div><p className="text-sm text-muted-foreground">{today} · FOR MY HEALTH</p><h1 className="mt-1 text-2xl font-semibold">{user?.displayName ? `${user.displayName}，` : ''}今天，从一点点开始</h1></div>
    <section className="rounded-3xl bg-primary p-6 text-primary-foreground sm:p-8">
      <p className="text-sm font-medium">{firstVisit ? 'DAY 0 · 第一次到馆' : 'TODAY · 今日安排'}</p>
      <h2 className="my-3 text-3xl font-bold sm:text-4xl">{firstVisit ? '先熟悉，再开始' : todayWorkout?.name ?? schedule[weekday]}</h2>
      <p className="max-w-lg leading-relaxed">{firstVisit ? '慢走 5–10 分钟，找到储物柜与饮水点，请工作人员示范胸推、下拉和腿举。今天能安心走进去，就已经完成第一步。' : todayWorkout ? '慢走热身 → 轻重量练动作 → 记录每一组。前一周每项可先做 1 组，适应后再做 2 组。' : '今天给身体恢复的时间。轻松走走或选择适合新手的低强度团课，不用为了连续打卡硬撑。'}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild variant="secondary" className="min-h-12 rounded-full px-6 text-base"><Link href={active ? `/session/${active.id}` : firstVisit || !todayWorkout ? '/activities' : '/session/new'}>{active ? '继续未完成的训练' : firstVisit ? '完成首次到馆打卡' : todayWorkout ? '开始今天的训练' : '记录今天的活动'}</Link></Button>
        {(firstVisit || !todayWorkout) && <Button asChild variant="secondary" className="min-h-12 rounded-full"><Link href="/session/new">选择力量训练</Link></Button>}
      </div>
    </section>
    <section className="grid grid-cols-3 gap-3" aria-label="训练概览">{[['本周力量', `${weekCount} / 3`], ['习惯连续', `${streak} 天`], ['本月到馆', `${monthVisits} 天`]].map(([label, value]) => <div key={label} className="rounded-2xl border bg-card p-4"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></div>)}</section>
    <section className="rounded-2xl border bg-card p-5"><div className="flex items-center justify-between"><h2 className="font-semibold">PureGym 会员使用</h2><Link className="text-sm text-primary" href="/activities">设置月费</Link></div><p className="mt-3 text-xl font-semibold">{fee == null ? '填写你的实际月费' : monthVisits ? `£${(fee / 100 / monthVisits).toFixed(2)} / 到馆日` : '本月还没有到馆记录'}</p><p className="mt-2 text-sm text-muted-foreground">{fee == null ? '不预填价格，统计从真实打卡开始。' : `月费 £${(fee / 100).toFixed(2)} · 同一天力量与团课合并计为 1 次到馆。`}</p></section>
    <section className="space-y-3"><h2 className="flex items-center gap-2 text-lg font-semibold"><CalendarDays className="size-5" />一周节奏</h2><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{[1,2,3,4,5,6,0].map((day) => <div key={day} className={`rounded-xl border p-3 ${weekday === day ? 'border-primary bg-primary/10' : 'bg-card'}`}><p className="text-sm text-muted-foreground">周{['日','一','二','三','四','五','六'][day]}</p><p className="mt-1 text-sm font-medium">{schedule[day]}</p></div>)}</div><p className="text-sm text-muted-foreground">休息日也可以记录，习惯连续天数包含恢复打卡。先建立规律，不强求每天进健身房。</p></section>
    <section className="rounded-2xl border p-5"><h2 className="flex items-center gap-2 font-semibold"><HeartPulse className="size-5 text-primary" />训练前，照顾好自己</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">准备好水、合脚鞋和需要的低血糖应急用品。状态记录用于回顾，不会判断你是否适合运动或调整用药；运动方案请结合你的医疗团队建议。</p><Link href="/session/new" className="mt-3 inline-block text-sm text-primary">记录状态与血糖 →</Link>{readiness && <p className="mt-2 text-sm text-muted-foreground">上次状态：{readiness.readiness}/5{readiness.glucoseMmol != null ? ` · 血糖 ${readiness.glucoseMmol} mmol/L` : ''} · {dayKey(readiness.createdAt)}</p>}<p className="mt-3 text-sm"><a className="underline" href="https://www.nhs.uk/conditions/low-blood-sugar-hypoglycaemia/" target="_blank" rel="noreferrer">NHS 低血糖指南</a></p></section>
    <div className="grid grid-cols-2 gap-3"><Button asChild variant="outline" className="min-h-12"><Link href="/history">训练历史</Link></Button><Button asChild variant="outline" className="min-h-12"><Link href="/activities">团课与恢复记录</Link></Button></div>
    <p className="text-sm text-muted-foreground">iPhone：用 Safari 打开网址 → 分享 → 添加到主屏幕。个人应用，非 PureGym 官方产品。</p>
  </main>;
}
