import { describe, expect, it } from 'vitest';
import type { Entry } from '../../db/types';
import { summarizeByDay } from './entriesByDay';

const entry = (date: string, category: Entry['category']): Entry => ({
  id: `${date}-${category}-${Math.random()}`,
  date,
  category,
  data: {},
  createdAt: '2026-09-09T00:00:00.000Z',
  updatedAt: '2026-09-09T00:00:00.000Z',
});

describe('summarizeByDay', () => {
  it('returns an empty map for no entries', () => {
    expect(summarizeByDay([]).size).toBe(0);
  });

  it('counts totals and per-category counts for each day', () => {
    const days = summarizeByDay([
      entry('2026-09-09', 'dsa'),
      entry('2026-09-09', 'dsa'),
      entry('2026-09-09', 'habit'),
      entry('2026-09-10', 'jobSearch'),
    ]);
    expect(days.get('2026-09-09')?.total).toBe(3);
    expect([...days.get('2026-09-09')!.byCategory]).toEqual([
      ['dsa', 2],
      ['habit', 1],
    ]);
    expect(days.get('2026-09-10')?.total).toBe(1);
    expect(days.has('2026-09-11')).toBe(false);
  });
});
