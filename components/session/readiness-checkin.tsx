'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { HeartPulse } from 'lucide-react';
import { toast } from 'sonner';
import type { MuscleGroup } from '@/lib/prisma-client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { readinessCheckinInputSchema } from '@/lib/schemas/readiness';
import { muscleGroupMessageKeys } from '@/i18n/enum-keys';

// Optional, skippable pre-session readiness check-in (issue #38). Adds no
// friction: it is collapsed by default behind a single tap and never blocks
// starting a session. The latest check-in feeds the coach payload as an input
// signal; it does not change anything about how a session is logged.
//
// Soreness (per-muscle-group 1-5) and a free-text note are equally optional
// (issue #48): they live behind a second "Add soreness / note" toggle so the
// quick two-tap readiness + sleep path stays unchanged. Only rated groups are
// submitted, matching the partial-map semantics the schema and coach expect.

const SCALE = [1, 2, 3, 4, 5];

const MUSCLE_GROUPS = Object.keys(muscleGroupMessageKeys) as MuscleGroup[];

export function ReadinessCheckin() {
  const t = useTranslations('session.readiness');
  const exerciseT = useTranslations('exercises');
  const common = useTranslations('common');
  const [open, setOpen] = useState(false);
  const [readiness, setReadiness] = useState<number | null>(null);
  const [sleepQuality, setSleepQuality] = useState<number | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [soreness, setSoreness] = useState<Partial<Record<MuscleGroup, number>>>({});
  const [note, setNote] = useState('');
  const [glucose, setGlucose] = useState('');
  const [glucoseContext, setGlucoseContext] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function setSorenessFor(group: MuscleGroup, value: number) {
    setSoreness((prev) => {
      // Tapping the current rating again clears it, so a group can be unrated.
      if (prev[group] === value) {
        const next = { ...prev };
        delete next[group];
        return next;
      }
      return { ...prev, [group]: value };
    });
  }

  async function submit() {
    if (readiness === null || sleepQuality === null) {
      toast.error(t('rateBoth'));
      return;
    }
    // Only send a soreness map / note when the user actually filled them in, so
    // the quick path stays a clean { readiness, sleepQuality } payload.
    const trimmedNote = note.trim();
    const payload = {
      readiness,
      sleepQuality,
      ...(glucose !== '' ? { glucoseMmol: Number(glucose) } : {}),
      ...(glucoseContext.trim() ? { glucoseContext: glucoseContext.trim() } : {}),
      ...(Object.keys(soreness).length > 0 ? { soreness } : {}),
      ...(trimmedNote.length > 0 ? { note: trimmedNote } : {}),
    };

    // Validate locally with the same schema the route uses, so a bad note
    // length (etc.) is caught before the round-trip.
    const parsed = readinessCheckinInputSchema.safeParse(payload);
    if (!parsed.success) {
      toast.error(t('invalid'));
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/readiness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error ?? `Error ${res.status}`);
      }
      toast.success(t('saved'));
      setSaved(true);
      setOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t('saveError'));
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="self-start"
        onClick={() => setOpen(true)}
      >
        <HeartPulse className="size-4" />
        <span className="ml-2">
          {saved ? t('update') : t('open')}
        </span>
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <h2 className="text-base font-semibold">{t('title')}</h2>
        <p className="text-xs text-muted-foreground">
          {t('description')}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-sm">
          <p className="font-medium">糖尿病训练前提示（非医疗建议）</p>
          <p className="mt-1 text-muted-foreground">
            血糖低于 4 mmol/L 或出现低血糖症状时，停止运动，按个人低血糖处理方案补充快速糖分，10–15 分钟后复测。严重意识异常、抽搐或无法吞咽时请旁人拨打 999，不要喂食。数值不低不代表适合运动；感到不适时不要硬撑。
          </p>
          <a href="https://www.nhs.uk/conditions/low-blood-sugar-hypoglycaemia/" className="mt-2 inline-block underline" target="_blank" rel="noreferrer">NHS 处理指引</a>
        </div>
        <div className="space-y-2">
          <Label htmlFor="glucose">手动血糖记录（mmol/L，可留空）</Label>
          <Input id="glucose" inputMode="decimal" type="number" min="0.1" max="100" step="0.1" value={glucose} onChange={(event) => setGlucose(event.target.value)} />
          {glucose !== '' && Number(glucose) < 4 && <p role="alert" className="text-sm font-semibold text-amber-600">当前输入低于 4 mmol/L。请暂停训练，先按低血糖处理指引处理。</p>}
          <Label htmlFor="glucose-context">测量背景（可选）</Label>
          <Input id="glucose-context" maxLength={200} value={glucoseContext} onChange={(event) => setGlucoseContext(event.target.value)} placeholder="例如：训练前，午餐后两小时" />
          <p className="text-sm text-muted-foreground">这些字段单独保存在你的账号中，不用于自动调整重量或药物。常规备注可能进入 AI 教练上下文，请勿在备注里填写不希望发送给 AI 的信息。</p>
        </div>
        <ScaleRow label={t('overall')} value={readiness} onChange={setReadiness} />
        <ScaleRow label={t('sleep')} value={sleepQuality} onChange={setSleepQuality} />

        {!detailsOpen ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="self-start"
            onClick={() => setDetailsOpen(true)}
          >
            {t('details')}
          </Button>
        ) : (
          <div className="flex flex-col gap-4 border-t pt-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                {t('soreness')}
              </Label>
              <p className="text-xs text-muted-foreground">
                {t('sorenessDescription')}
              </p>
              <div className="flex flex-col gap-3">
                {MUSCLE_GROUPS.map((group) => (
                  <SorenessRow
                    key={group}
                    label={exerciseT(`muscleGroups.${muscleGroupMessageKeys[group]}`)}
                    value={soreness[group] ?? null}
                    onChange={(v) => setSorenessFor(group, v)}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="readiness-note"
                className="text-xs uppercase tracking-wide text-muted-foreground"
              >
                {t('note')}
              </Label>
              <Textarea
                id="readiness-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={500}
                rows={3}
                placeholder={t('notePlaceholder')}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={saving}
          >
            {t('skip')}
          </Button>
          <Button type="button" onClick={submit} disabled={saving}>
            {saving ? common('actions.saving') : t('save')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ScaleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </Label>
      <div className="grid grid-cols-5 gap-2">
        {SCALE.map((n) => (
          <Button
            key={n}
            type="button"
            variant={value === n ? 'default' : 'outline'}
            onClick={() => onChange(n)}
            className="min-h-tap text-lg font-semibold"
            aria-label={`${label}: ${n}`}
            aria-pressed={value === n}
          >
            {n}
          </Button>
        ))}
      </div>
    </div>
  );
}

function SorenessRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (v: number) => void;
}) {
  const t = useTranslations('session.readiness');

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm">{label}</span>
      <div className="grid grid-cols-5 gap-1">
        {SCALE.map((n) => (
          <Button
            key={n}
            type="button"
            size="sm"
            variant={value === n ? 'default' : 'outline'}
            onClick={() => onChange(n)}
            className="min-h-tap w-9 px-0 text-sm font-semibold"
            aria-label={t('sorenessAria', { name: label, value: n })}
            aria-pressed={value === n}
          >
            {n}
          </Button>
        ))}
      </div>
    </div>
  );
}
