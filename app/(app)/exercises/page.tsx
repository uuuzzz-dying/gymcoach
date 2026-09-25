import { db } from '@/lib/db';
import { requireSession } from '@/lib/auth';
import { ensureExerciseCatalog } from '@/lib/exercise-catalog';
import { ExercisesView } from '@/components/exercises/exercises-view';

export default async function ExercisesPage() {
  const session = await requireSession();
  await ensureExerciseCatalog(db, session.userId);
  const [exercises, totalCount] = await Promise.all([
    db.exercise.findMany({
      where: { userId: session.userId },
      orderBy: [{ muscleGroup: 'asc' }, { name: 'asc' }],
      take: 100,
    }),
    db.exercise.count({ where: { userId: session.userId } }),
  ]);

  return (
    <main className="flex-1 px-4 py-6">
      <ExercisesView exercises={exercises} totalCount={totalCount} />
    </main>
  );
}
