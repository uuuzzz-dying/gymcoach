import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { handleApiError, parseJsonBody, requireApiUserId } from '@/lib/api';

const activitySchema = z.object({
  kind: z.enum(['class', 'walk', 'recovery', 'orientation']),
  name: z.string().trim().min(1).max(100),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
    const date = new Date(`${value}T12:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value && date.getTime() <= Date.now() + 86400000;
  }, '请选择有效的已完成活动日期'),
  minutes: z.number().int().min(0).max(600),
  atGym: z.boolean(),
});

export async function POST(req: Request) {
  try {
    const userId = await requireApiUserId();
    const data = await parseJsonBody(req, activitySchema);
    const entry = await db.activityLog.create({ data: { userId, ...data } });
    return NextResponse.json(entry, { status: 201 });
  } catch (error) { return handleApiError(error); }
}

export async function PATCH(req: Request) {
  try {
    const userId = await requireApiUserId();
    const data = await parseJsonBody(req, z.object({ membershipPence: z.number().int().min(0).max(100000).nullable() }));
    await db.user.update({ where: { id: userId }, data });
    return NextResponse.json({ ok: true });
  } catch (error) { return handleApiError(error); }
}
