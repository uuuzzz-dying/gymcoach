import Link from 'next/link';
import { db } from '@/lib/db';
import { requireSession } from '@/lib/auth';
import { PersonalActivityForm } from '@/components/personal-activity-form';

export default async function ActivitiesPage() {
  const { userId } = await requireSession();
  const [user, activities] = await Promise.all([
    db.user.findUnique({ where: { id: userId }, select: { membershipPence: true } }),
    db.activityLog.findMany({ where: { userId }, orderBy: [{ date: 'desc' }, { createdAt: 'desc' }], take: 50 }),
  ]);
  return <main className="mx-auto w-full max-w-2xl space-y-6 px-4 py-6">
    <Link href="/" className="text-sm text-primary">← 回到今天</Link>
    <h1 className="text-2xl font-bold">团课与恢复打卡</h1>
    <PersonalActivityForm initialFee={user?.membershipPence ?? null} today={new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(new Date())} />
    <section className="space-y-3"><h2 className="text-lg font-semibold">最近的记录</h2>
      {!activities.length && <p className="text-muted-foreground">还没有记录。第一次到馆、散步和恢复日都可以从这里开始。</p>}
      {activities.map((entry) => <article key={entry.id} className="rounded-xl border p-4"><p className="font-semibold">{entry.name}</p><p className="text-sm text-muted-foreground">{entry.date} · {entry.minutes} 分钟 · {entry.atGym ? '到馆' : '场外 / 休息'}</p></article>)}
    </section>
  </main>;
}
