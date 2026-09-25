import bcrypt from 'bcrypt';
import { db } from '../lib/db';
import { seedExerciseCatalog } from '../lib/exercise-catalog';
import { createBeginnerPlan } from '../lib/beginner-plan';

// Optional owner setup. Registration also installs the same starter plan.
// Never insert fictional sessions or overwrite an existing user's plan.
async function main() {
  const email = process.env.USER_EMAIL;
  const password = process.env.USER_PASSWORD;
  if (!email || !password || password === 'change-me-immediately') {
    throw new Error('Set USER_EMAIL and a unique USER_PASSWORD before seeding, or register through the app.');
  }
  const user = await db.user.upsert({
    where: { email }, update: {},
    create: { email, passwordHash: await bcrypt.hash(password, 12), displayName: '我的训练', goal: 'GENERAL_FITNESS', weeklyFrequency: 3 },
  });
  if (await db.program.count({ where: { userId: user.id } }) === 0) {
    await seedExerciseCatalog(db, user.id);
    await createBeginnerPlan(user.id);
  }
  console.log('Personal account ready; no sample training history created.');
}
main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => db.$disconnect());
