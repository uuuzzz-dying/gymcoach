import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { exerciseInputSchema } from '@/lib/schemas/exercise';
import { handleApiError, parseJsonBody, requireApiUserId } from '@/lib/api';
import { ensureExerciseCatalog } from '@/lib/exercise-catalog';

export async function GET(req: Request) {
  try {
    const userId = await requireApiUserId();
    await ensureExerciseCatalog(db, userId);
    const query = new URL(req.url).searchParams.get('q')?.trim().slice(0, 120) ?? '';
    const where = {
      userId,
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: 'insensitive' as const } },
              { notes: { contains: query, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };
    const [items, total] = await Promise.all([
      db.exercise.findMany({
        where,
        orderBy: [{ muscleGroup: 'asc' }, { name: 'asc' }],
        take: 100,
      }),
      db.exercise.count({ where }),
    ]);
    return NextResponse.json({ items, total });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: Request) {
  try {
    const userId = await requireApiUserId();
    const data = await parseJsonBody(req, exerciseInputSchema);
    const exercise = await db.exercise.create({
      data: { ...data, userId, notes: data.notes ?? null },
    });
    return NextResponse.json(exercise, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
