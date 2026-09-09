import { describe, expect, it } from 'vitest';
import type { Entry, Habit } from '../../db/types';
import { habitStreakRows } from './habitStreaks';

const run: Habit = { id: 'run', name: 'Run', kind: 'boolean', archived: false, createdAt: '' };
const read: Habit = {
  id: 'read',
  name: 'Read',
  kind: 'numeric',
  dailyTarget: 10,
  archived: false,
  createdAt: '',
};
const entry = (date: string, habitId: string, value: boolean | number): Entry => ({
  id: `${date}-${habitId}`,
  date,
  category: 'habit',
  data: { habitId, value },
  createdAt: '',
  updatedAt: '',
});

describe('habitStreakRows', () => {
  it('computes streaks per habit from met days only', () => {
    const rows = habitStreakRows(
      [run, read],
      [
        entry('2026-09-07', 'run', true),
        entry('2026-09-08', 'run', true),
        entry('2026-09-09', 'run', false),
        entry('2026-09-08', 'read', 12),
        entry('2026-09-09', 'read', 4),
      ],
      '2026-09-09',
    );
    expect(rows).toEqual([
      { habit: run, current: 2, longest: 2, doneToday: false },
      { habit: read, current: 1, longest: 1, doneToday: false },
    ]);
  });
});
