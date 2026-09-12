import { describe, expect, it } from 'vitest';
import type { Entry } from '../../db/types';
import { groupEntriesByDate } from './groupEntriesByDate';

const entry = (id: string, date: string): Entry => ({
  id,
  date,
  category: 'dsa',
  data: {},
  createdAt: id,
  updatedAt: id,
});

describe('groupEntriesByDate', () => {
  it('groups contiguous entries sharing a date, preserving order', () => {
    const groups = groupEntriesByDate([
      entry('a', '2026-09-09'),
      entry('b', '2026-09-09'),
      entry('c', '2026-09-08'),
      entry('d', '2026-09-07'),
      entry('e', '2026-09-07'),
    ]);
    expect(groups.map((g) => [g.date, g.entries.map((e) => e.id)])).toEqual([
      ['2026-09-09', ['a', 'b']],
      ['2026-09-08', ['c']],
      ['2026-09-07', ['d', 'e']],
    ]);
  });

  it('returns an empty array for no entries', () => {
    expect(groupEntriesByDate([])).toEqual([]);
  });

  it('does not merge non-contiguous runs of the same date', () => {
    const groups = groupEntriesByDate([
      entry('a', '2026-09-09'),
      entry('b', '2026-09-08'),
      entry('c', '2026-09-09'),
    ]);
    expect(groups).toHaveLength(3);
  });
});
