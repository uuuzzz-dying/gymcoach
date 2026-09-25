import 'server-only';
import catalog from '@/data/opengym-exercises.zh.json';

export interface OpenGymGuide {
  datasetId: string;
  name: string;
  notes: string;
  imageUrl: string;
  gifUrl: string;
  attribution: string;
}

const guides = new Map<string, OpenGymGuide>();

for (const exercise of catalog) {
  guides.set(normalize(exercise.name), {
    datasetId: exercise.datasetId,
    name: exercise.name,
    notes: exercise.notes,
    imageUrl: exercise.imageUrl,
    gifUrl: exercise.gifUrl,
    attribution: exercise.attribution,
  });
}

function normalize(name: string): string {
  return name.trim().toLocaleLowerCase('en-US');
}

export function getOpenGymGuide(name: string): OpenGymGuide | null {
  return guides.get(normalize(name)) ?? null;
}
