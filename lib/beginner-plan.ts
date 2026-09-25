import { db } from '@/lib/db';

export const BEGINNER_DAYS = [
  { name: 'Push · 胸肩三头', day: 1, exercises: ['Machine chest press', 'Dumbbell lateral raise', 'Triceps pushdown (rope)'] },
  { name: 'Pull · 背部二头', day: 3, exercises: ['Neutral-grip lat pulldown', 'Chest-supported machine row', 'Standing cable curl (straight bar)'] },
  { name: 'Legs · 腿臀核心', day: 5, exercises: ['Leg press (45 deg)', 'Seated leg curl', 'Standing calf raise (or machine)'] },
];

// Only used when creating a fresh personal account, never replaces an existing plan.
export async function createBeginnerPlan(userId: string) {
  const catalog = await db.exercise.findMany({ where: { userId }, select: { id: true, name: true } });
  const byName = new Map(catalog.map((exercise) => [exercise.name, exercise.id]));
  return db.program.create({ data: {
    userId, name: '我的起点 · 4 周适应期', phase: 'Foundation', isActive: true,
    description: '周一 Push、周三 Pull、周五 Legs。先慢走热身 5–10 分钟；第 1 周每项可先做 1 组，适应后 2 组。选轻重量、保留约 3 次余力，不追求力竭。腿日可加站姿收腹 2 轮，每轮舒适呼吸 5 次。周二轻团课，周四恢复，周六轻有氧，周日休息。首次先请工作人员示范器械；结合医疗团队建议调整。',
    workouts: { create: BEGINNER_DAYS.map((day, index) => ({
      name: day.name, dayOfWeek: day.day, order: index + 1,
      exercises: { create: day.exercises.map((name, order) => {
        const exerciseId = byName.get(name);
        if (!exerciseId) throw new Error(`Missing beginner exercise: ${name}`);
        return { exerciseId, order: order + 1, targetSets: 2, targetRepsMin: 8, targetRepsMax: 12, targetRIR: 3, restSec: 90 };
      }) },
    })) },
  } });
}
