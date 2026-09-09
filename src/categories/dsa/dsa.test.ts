import { describe, expect, it } from 'vitest';
import type { Entry } from '../../db/types';
import { dsaCategory, type DsaData } from './index';
import { dsaSchema } from './schema';
import { summarizeDsa } from './summarize';

const ctx = { range: { from: '2026-09-01', to: '2026-09-30' }, today: '2026-09-09', habits: [] };

const entry = (data: Partial<DsaData>): Entry<DsaData> => ({
  id: crypto.randomUUID(),
  date: '2026-09-09',
  category: 'dsa',
  data: {
    title: 'Two Sum',
    topics: ['arrays'],
    difficulty: 'easy',
    minutesSpent: 20,
    solved: true,
    ...data,
  },
  createdAt: '',
  updatedAt: '',
});

describe('dsaSchema', () => {
  it('parses comma-separated topics into unique lowercase tags and coerces minutes', () => {
    const parsed = dsaSchema.parse({
      title: ' Two Sum ',
      link: '',
      topics: 'Arrays, hash map, arrays, ',
      difficulty: 'easy',
      minutesSpent: '25',
      solved: true,
    });
    expect(parsed).toEqual({
      title: 'Two Sum',
      topics: ['arrays', 'hash map'],
      difficulty: 'easy',
      minutesSpent: 25,
      solved: true,
    });
  });

  it('rejects non-integer or negative minutes', () => {
    expect(
      dsaSchema.safeParse({
        title: 'x',
        topics: '',
        difficulty: 'easy',
        minutesSpent: '1.5',
        solved: false,
      }).success,
    ).toBe(false);
    expect(
      dsaSchema.safeParse({
        title: 'x',
        topics: '',
        difficulty: 'easy',
        minutesSpent: '-1',
        solved: false,
      }).success,
    ).toBe(false);
  });
});

describe('dsaCategory.describe', () => {
  it('marks solved problems and shows difficulty and time', () => {
    expect(dsaCategory.describe(entry({}).data, ctx)).toBe('✓ Two Sum · Easy, 20m');
    expect(dsaCategory.describe(entry({ solved: false, difficulty: 'hard' }).data, ctx)).toBe(
      'Two Sum · Hard, 20m',
    );
  });
});

describe('summarizeDsa', () => {
  it('reports solved counts, hard problems, time, and the top topic', () => {
    const stats = summarizeDsa(
      [
        entry({ minutesSpent: 45, topics: ['arrays', 'two pointers'] }),
        entry({ minutesSpent: 30, difficulty: 'hard', topics: ['graphs'] }),
        entry({ minutesSpent: 15, solved: false, topics: ['arrays'] }),
      ],
      ctx,
    );
    expect(stats).toEqual([
      { label: 'Problems solved', value: 2, hint: '1 attempted' },
      { label: 'Hard solved', value: 1 },
      { label: 'Time studied', value: '1h 30m' },
      { label: 'Top topic', value: 'arrays', hint: '2 problems' },
    ]);
  });

  it('handles an empty range', () => {
    expect(summarizeDsa([], ctx)[3]).toEqual({ label: 'Top topic', value: '–', hint: undefined });
  });
});
