import { NextResponse } from 'next/server';
import { handleApiError, requireApiUserId } from '@/lib/api';
import { getOpenGymGuide } from '@/lib/opengym-guide';

// Loads one animation record on demand. Keeping the 1,318-item source catalog
// on the server avoids adding a megabyte of JSON to every exercise-card bundle.
export async function GET(req: Request) {
  try {
    await requireApiUserId();
    const name = new URL(req.url).searchParams.get('name')?.trim();
    if (!name || name.length > 120) {
      return NextResponse.json({ error: 'Valid exercise name required.' }, { status: 400 });
    }
    const guide = getOpenGymGuide(name);
    if (!guide) return NextResponse.json({ error: 'Guide not found.' }, { status: 404 });
    return NextResponse.json({ guide });
  } catch (error) {
    return handleApiError(error);
  }
}
