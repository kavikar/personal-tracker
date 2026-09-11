import { describe, expect, it } from 'vitest';
import type { Entry, Goal, Habit } from '../../db/types';
import { addDays, monthRange, weekRange, yearRange } from '../../lib/dates';
import { computeGoalProgress, periodRange } from './goalProgress';

const TODAY = '2026-09-09';

const entry = (id: string, date: string, category: Entry['category'], data: object): Entry => ({
  id,
  date,
  category,
  data,
  createdAt: id,
  updatedAt: id,
});

const goal = (overrides: Partial<Goal>): Goal => ({
  id: 'g1',
  label: 'Test goal',
  category: 'jobSearch',
  target: 3,
  period: 'month',
  createdAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

describe('periodRange', () => {
  it('matches the week/month/year helpers', () => {
    expect(periodRange('week', TODAY)).toEqual(weekRange(TODAY));
    expect(periodRange('month', TODAY)).toEqual(monthRange(TODAY));
    expect(periodRange('year', TODAY)).toEqual(yearRange(TODAY));
  });
});

describe('computeGoalProgress', () => {
  it('counts entries logged in the period for a simple category (jobSearch)', () => {
    const range = monthRange(TODAY);
    const entries = [
      entry('a', range.from, 'jobSearch', {}),
      entry('b', TODAY, 'jobSearch', {}),
      entry('c', addDays(range.to, 1), 'jobSearch', {}), // outside the period
    ];
    const progress = computeGoalProgress(
      goal({ category: 'jobSearch', target: 2 }),
      entries,
      [],
      TODAY,
    );
    expect(progress.current).toBe(2);
    expect(progress.done).toBe(true);
    expect(progress.percent).toBe(100);
  });

  it('counts only solved entries for dsa', () => {
    const entries = [
      entry('a', TODAY, 'dsa', { solved: true }),
      entry('b', TODAY, 'dsa', { solved: false }),
      entry('c', TODAY, 'dsa', { solved: true }),
    ];
    const progress = computeGoalProgress(
      goal({ category: 'dsa', target: 5, period: 'year' }),
      entries,
      [],
      TODAY,
    );
    expect(progress.current).toBe(2);
    expect(progress.done).toBe(false);
    expect(progress.percent).toBe(40);
  });

  it('counts only completed entries for admin', () => {
    const entries = [
      entry('a', TODAY, 'admin', { completed: true }),
      entry('b', TODAY, 'admin', { completed: false }),
    ];
    const progress = computeGoalProgress(
      goal({ category: 'admin', target: 1, period: 'week' }),
      entries,
      [],
      TODAY,
    );
    expect(progress.current).toBe(1);
    expect(progress.done).toBe(true);
  });

  it('sums values for a numeric habit goal, ignoring other habits', () => {
    const habits: Habit[] = [
      { id: 'h1', name: 'Read', kind: 'numeric', archived: false, createdAt: '' },
    ];
    const entries = [
      entry('a', TODAY, 'habit', { habitId: 'h1', value: 10 }),
      entry('b', TODAY, 'habit', { habitId: 'h1', value: 15 }),
      entry('c', TODAY, 'habit', { habitId: 'other', value: 999 }),
    ];
    const progress = computeGoalProgress(
      goal({ category: 'habit', habitId: 'h1', target: 20, period: 'week' }),
      entries,
      habits,
      TODAY,
    );
    expect(progress.current).toBe(25);
    expect(progress.done).toBe(true);
    expect(progress.percent).toBe(125);
  });

  it('counts days met for a boolean habit goal', () => {
    const habits: Habit[] = [
      { id: 'h1', name: 'Exercise', kind: 'boolean', archived: false, createdAt: '' },
    ];
    const entries = [
      entry('a', TODAY, 'habit', { habitId: 'h1', value: true }),
      entry('b', addDays(TODAY, -1), 'habit', { habitId: 'h1', value: false }),
      entry('c', addDays(TODAY, -2), 'habit', { habitId: 'h1', value: true }),
    ];
    const progress = computeGoalProgress(
      goal({ category: 'habit', habitId: 'h1', target: 5, period: 'month' }),
      entries,
      habits,
      TODAY,
    );
    expect(progress.current).toBe(2);
  });

  it('is zero when the habit no longer exists', () => {
    const entries = [entry('a', TODAY, 'habit', { habitId: 'missing', value: true })];
    const progress = computeGoalProgress(
      goal({ category: 'habit', habitId: 'missing', target: 5, period: 'month' }),
      entries,
      [],
      TODAY,
    );
    expect(progress.current).toBe(0);
    expect(progress.habit).toBeUndefined();
  });
});
