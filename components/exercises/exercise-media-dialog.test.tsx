import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ExerciseMediaDialog } from './exercise-media-dialog';

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response('{}', { status: 404 })),
  );
});

afterEach(() => vi.unstubAllGlobals());

describe('ExerciseMediaDialog', () => {
  it('shows the animated guide, Chinese steps and source information', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              guide: {
                datasetId: '0025',
                name: 'barbell bench press',
                notes: '1. 平躺在长凳上。',
                imageUrl: 'https://raw.githubusercontent.com/example/start.jpg',
                gifUrl: 'https://raw.githubusercontent.com/example/demo.gif',
                attribution: '© Gym visual — https://gymvisual.com/',
              },
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          ),
      ),
    );
    const user = userEvent.setup();
    render(
      <ExerciseMediaDialog
        exerciseName="Barbell bench press"
        displayName="Barbell bench press"
        equipmentType="BARBELL"
      />,
    );

    await user.click(
      screen.getByRole('button', { name: 'View technique for Barbell bench press' }),
    );
    expect(
      await screen.findByAltText('Barbell bench press animated exercise demonstration'),
    ).toBeInTheDocument();
    expect(await screen.findByText(/平躺在长凳上/)).toBeInTheDocument();
    expect(await screen.findByText(/gym visual/i)).toBeInTheDocument();
    expect(screen.getByText(/required equipment: barbell/i)).toBeInTheDocument();
  });

  it('marks a close visual substitute as a similar variant', async () => {
    const user = userEvent.setup();
    render(
      <ExerciseMediaDialog
        exerciseName="Bulgarian split squat"
        displayName="Bulgarian split squat"
        equipmentType="DUMBBELL"
      />,
    );
    await user.click(
      screen.getByRole('button', { name: 'View technique for Bulgarian split squat' }),
    );
    expect(screen.getByText('Similar variant')).toBeInTheDocument();
  });

  it('offers a Commons search for an unknown custom exercise', async () => {
    const user = userEvent.setup();
    render(
      <ExerciseMediaDialog
        exerciseName="Future custom movement"
        displayName="Future custom movement"
        equipmentType="OTHER"
      />,
    );
    await user.click(
      screen.getByRole('button', { name: 'View technique for Future custom movement' }),
    );
    expect(await screen.findByRole('link', { name: /search wikimedia commons/i })).toHaveAttribute(
      'href',
      expect.stringContaining('title=Special:MediaSearch'),
    );
  });
});
