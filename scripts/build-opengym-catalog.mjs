import fs from 'node:fs';
import path from 'node:path';

const sourcePath = process.argv[2];
if (!sourcePath) {
  throw new Error('Usage: node scripts/build-opengym-catalog.mjs <upstream-exercises.json>');
}

const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const seen = new Set();

const muscleGroup = (exercise) => {
  const target = String(exercise.target ?? '').toLowerCase();
  if (target.includes('pector') || target.includes('serratus')) return 'CHEST';
  if (target === 'lats') return 'BACK_WIDTH';
  if (target.includes('back') || target.includes('trap') || target.includes('levator')) {
    return 'BACK_THICKNESS';
  }
  if (target.includes('delt')) return 'SHOULDERS_FRONT';
  if (target.includes('bicep')) return 'BICEPS';
  if (target.includes('tricep')) return 'TRICEPS';
  if (target.includes('forearm')) return 'FOREARMS';
  if (target.includes('quad')) return 'QUADS';
  if (target.includes('hamstring')) return 'HAMSTRINGS';
  if (target.includes('glute') || target.includes('adductor') || target.includes('abductor')) {
    return 'GLUTES';
  }
  if (target.includes('calf') || target.includes('calves')) return 'CALVES';
  if (target.includes('abs')) return 'ABS';
  if (target.includes('spine')) return 'LOWER_BACK';
  return 'OTHER';
};

const equipmentType = (exercise) => {
  const equipment = String(exercise.equipment ?? '').toLowerCase();
  const target = String(exercise.target ?? '').toLowerCase();
  if (target.includes('cardiovascular')) return 'CARDIO';
  if (equipment.includes('body weight') || equipment === 'assisted' || equipment === 'weighted') {
    return 'BODYWEIGHT';
  }
  if (equipment.includes('dumbbell') || equipment.includes('kettlebell')) return 'DUMBBELL';
  if (equipment.includes('barbell') || equipment.includes('trap bar')) return 'BARBELL';
  if (equipment.includes('cable') || equipment.includes('rope')) return 'CABLE';
  if (
    equipment.includes('machine') ||
    equipment.includes('sled') ||
    equipment.includes('stepmill') ||
    equipment.includes('ergometer') ||
    equipment.includes('skierg') ||
    equipment.includes('bike') ||
    equipment.includes('elliptical')
  ) {
    return target.includes('cardiovascular') ? 'CARDIO' : 'MACHINE';
  }
  return 'OTHER';
};

const isolationPattern =
  /curl|extension|raise|fly|crunch|kickback|adduction|abduction|shrug|wrist|neck/i;

const output = [];
for (const exercise of source) {
  const name = String(exercise.name ?? '').trim();
  const key = name.toLocaleLowerCase('en-US');
  if (!name || seen.has(key)) continue;
  seen.add(key);

  const equipment = equipmentType(exercise);
  const steps = Array.isArray(exercise.instruction_steps?.zh)
    ? exercise.instruction_steps.zh.map((step) => String(step).trim()).filter(Boolean)
    : [];
  const fallback = String(exercise.instructions?.zh ?? '').trim();
  const notes =
    steps.length > 0 ? steps.map((step, index) => `${index + 1}. ${step}`).join('\n') : fallback;
  const category =
    equipment === 'CARDIO' ? 'CARDIO' : isolationPattern.test(name) ? 'ISOLATION' : 'COMPOUND';

  output.push({
    datasetId: String(exercise.id),
    name,
    muscleGroup: muscleGroup(exercise),
    category,
    equipmentType: equipment,
    defaultRestSec: category === 'CARDIO' ? 60 : category === 'ISOLATION' ? 75 : 120,
    usesBodyweight: equipment === 'BODYWEIGHT',
    notes: notes.slice(0, 2000),
    imageUrl: `https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/${exercise.image}`,
    gifUrl: `https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/${exercise.gif_url}`,
    attribution: String(exercise.attribution ?? '© Gym visual — https://gymvisual.com/'),
  });
}

const destination = path.resolve('data', 'opengym-exercises.zh.json');
fs.writeFileSync(destination, `${JSON.stringify(output)}\n`);
console.log(`Wrote ${output.length} unique exercises to ${destination}`);
