import Link from 'next/link';
import { AlertTriangle, CheckCircle2, Dumbbell, HeartPulse, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const sessions = [
  {
    title: 'Push · 胸肩三头',
    day: '周一',
    exercises: [
      ['器械推胸', '座椅调到把手与胸中部同高；肩胛轻贴靠背，推出时不要锁死手肘。'],
      ['哑铃侧平举', '用很轻的哑铃；肘部微弯，抬到肩高即可，不要甩起来。'],
      ['绳索三头下压', '手肘贴近身体；向下伸直时不要猛然锁死肘关节。'],
    ],
  },
  {
    title: 'Pull · 背部二头',
    day: '周三',
    exercises: [
      ['对握高位下拉', '先让肩膀下沉，再用手肘往下拉；把手拉到上胸附近。'],
      ['胸托器械划船', '胸口贴稳胸垫；将手肘拉向身体后方，回放时要慢。'],
      ['站姿绳索弯举', '手肘固定在身体两侧，不摇晃；顶端停 1 秒再慢慢放下。'],
    ],
  },
  {
    title: 'Legs · 腿臀核心',
    day: '周五',
    exercises: [
      ['45° 倒蹬机', '双脚与肩同宽；膝盖跟随脚尖方向，下背始终贴稳靠垫。'],
      ['坐姿腿弯举', '膝关节对齐器械转轴；屈膝到底停 1 秒，不要快速弹回。'],
      ['站姿提踵', '脚跟缓慢降到舒服的低点，再稳定踮起；不借用弹力。'],
    ],
  },
] as const;

export default function BeginnerGuidePage() {
  return (
    <main className="flex-1 px-4 py-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <section className="rounded-3xl bg-primary p-6 text-primary-foreground">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Dumbbell className="size-5" />
            你的第一个 4 周
          </div>
          <h1 className="text-3xl font-black tracking-tight">完全新手训练教程</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 opacity-90">
            目标是安全地建立规律，而不是第一天就练到极限。每周三练，其他日安排轻团课、散步或恢复。
          </p>
          <Button asChild variant="secondary" className="mt-5">
            <Link href="/session/new">
              <PlayCircle className="mr-2 size-4" />
              开始今天的训练
            </Link>
          </Button>
        </section>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">第一次到健身房</h2>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm leading-6 sm:grid-cols-2">
            {[
              '跑步机慢走 5–10 分钟，不需要跑。',
              '找到饮水处、更衣室和计划中的三台器械。',
              '请工作人员示范调整座椅和安全锁。',
              '每台机器用最轻重量试 8 次，感受动作轨迹。',
            ].map((item) => (
              <div key={item} className="flex gap-2 rounded-xl border p-3">
                <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {sessions.map((session) => (
          <Card key={session.title}>
            <CardHeader>
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-xl font-bold">{session.title}</h2>
                <span className="text-sm text-muted-foreground">{session.day}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                1–2 组 × 8–12 次 · 组间休息 90 秒 · 每组保留约 3 次余力
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {session.exercises.map(([name, cue], index) => (
                <div key={name} className="rounded-xl border p-4">
                  <div className="font-semibold">
                    {index + 1}. {name}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{cue}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        <Card className="border-amber-500/40">
          <CardHeader>
            <div className="flex items-center gap-2">
              <HeartPulse className="size-5 text-amber-500" />
              <h2 className="text-xl font-bold">2 型糖尿病训练前提醒</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6">
            <p>
              按你的医疗团队建议决定是否测量血糖，并带好水和你平时使用的低血糖应急用品。如果血糖低于
              4 mmol/L，或出现发抖、出汗、头晕、混乱等症状，停止训练并按你的低血糖处理计划行动。
            </p>
            <div className="flex gap-2 rounded-xl bg-amber-500/10 p-3">
              <AlertTriangle className="mt-1 size-4 shrink-0 text-amber-600" />
              <span>
                本网站用于记录和一般安全提醒，不会判断你是否适合训练，也不提供用药或胰岛素调整建议。
              </span>
            </div>
            <a
              className="font-medium text-primary underline-offset-4 hover:underline"
              href="https://www.nhs.uk/conditions/low-blood-sugar-hypoglycaemia/"
              target="_blank"
              rel="noreferrer"
            >
              NHS 低血糖处理指南 ↗
            </a>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
