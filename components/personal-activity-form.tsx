'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

export function PersonalActivityForm({ initialFee, today }: { initialFee: number | null; today: string }) {
  const router = useRouter();
  const [kind, setKind] = useState('class');
  const [name, setName] = useState('');
  const [date, setDate] = useState(today);
  const [minutes, setMinutes] = useState('30');
  const [atGym, setAtGym] = useState(true);
  const [fee, setFee] = useState(initialFee === null ? '' : (initialFee / 100).toFixed(2));
  const [busy, setBusy] = useState(false);
  async function save(url: string, method: string, body: unknown) {
    setBusy(true);
    try {
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!response.ok) throw new Error((await response.json()).error || '保存失败，请重试');
      toast.success('已保存'); router.refresh();
      return true;
    } catch (error) { toast.error(error instanceof Error ? error.message : '保存失败'); return false; }
    finally { setBusy(false); }
  }
  return <div className="space-y-8">
    <form className="space-y-4" onSubmit={async (event) => {
      event.preventDefault();
      if (await save('/api/activities', 'POST', { kind, name, date, minutes: Number(minutes), atGym })) setName('');
    }}>
      <h2 className="text-xl font-semibold">记录已完成的活动</h2>
      <p className="text-sm text-muted-foreground">休息也是计划的一部分。团课预约请在 PureGym 官方应用完成。</p>
      <Label htmlFor="activity-kind">活动类型</Label>
      <Select value={kind} onValueChange={setKind}><SelectTrigger id="activity-kind"><SelectValue /></SelectTrigger><SelectContent>
        <SelectItem value="class">轻度团课</SelectItem><SelectItem value="walk">散步 / 有氧</SelectItem><SelectItem value="recovery">恢复 / 休息</SelectItem><SelectItem value="orientation">第一次熟悉场地</SelectItem>
      </SelectContent></Select>
      <Label htmlFor="activity-name">名称</Label><Input id="activity-name" required maxLength={100} value={name} onChange={(e) => setName(e.target.value)} placeholder="例如：MIND、饭后散步、恢复日" />
      <div className="grid grid-cols-2 gap-4"><div><Label htmlFor="activity-date">日期</Label><Input id="activity-date" type="date" required max={today} value={date} onChange={(e) => setDate(e.target.value)} /></div>
      <div><Label htmlFor="activity-minutes">分钟</Label><Input id="activity-minutes" type="number" required min={0} max={600} value={minutes} onChange={(e) => setMinutes(e.target.value)} /></div></div>
      <div className="flex items-center gap-3"><Switch id="activity-gym" checked={atGym} onCheckedChange={setAtGym} /><Label htmlFor="activity-gym">这次去了健身房（计入会费使用次数）</Label></div>
      <Button className="w-full" disabled={busy}>完成打卡</Button>
    </form>
    <form className="space-y-3 border-t pt-5" onSubmit={(event) => {
      event.preventDefault(); void save('/api/activities', 'PATCH', { membershipPence: fee === '' ? null : Math.round(Number(fee) * 100) });
    }}>
      <Label htmlFor="membership-fee">你的 PureGym 月费（£）</Label><Input id="membership-fee" type="number" min={0} max={1000} step="0.01" value={fee} onChange={(e) => setFee(e.target.value)} placeholder="填写你的实际月费" />
      <Button variant="outline" disabled={busy}>保存月费</Button>
    </form>
  </div>;
}
