import { describe, expect, it } from 'vitest';
import type { Entry, Habit } from '../../db/types';
import { habitCategory, type HabitEntryData } from './index';
import { formatHabitValue, habitEntrySchema, meetsTarget, newHabitSchema } from './schema';
import { summarizeHabits } from './summarize';

const exercise: Habit = {
  id: 'h1',
  name: 'Exercise',
  kind: 'boolean',
  archived: false,
  createdAt: '',
};
const reading: Habit = {
  id: 'h2',
  name: 'Read',
  kind: 'numeric',
  unit: 'pages',
  dailyTarget: 20,
  archived: false,
  createdAt: '',
};
const archived: Habit = { id: 'h3', name: 'Old', kind: 'boolean', archived: true, createdAt: '' };
const habits = [exercise, reading, archived];

const entry = (
  date: string,
  habitId: string,
  value: HabitEntryData['value'],
): Entry<HabitEntryData> => ({
  id: crypto.randomUUID(),
  date,
  category: 'habit',
  data: { habitId, value },
  createdAt: '',
  updatedAt: '',
});

describe('schemas', () => {
  it('keeps booleans and coerces numeric strings', () => {
    expect(habitEntrySchema.parse({ habitId: 'h1', value: true })).toEqual({
      habitId: 'h1',
      value: true,
    });
    expect(habitEntrySchema.parse({ habitId: 'h2', value: '25' })).toEqual({
      habitId: 'h2',
      value: 25,
    });
    expect(habitEntrySchema.safeParse({ habitId: '', value: true }).success).toBe(false);
  });

  it('normalises new habit fields', () => {
    expect(
      newHabitSchema.parse({ name: ' Read ', kind: 'numeric', unit: 'pages', dailyTarget: '20' }),
    ).toEqual({
      name: 'Read',
      kind: 'numeric',
      unit: 'pages',
      dailyTarget: 20,
    });
    expect(
      newHabitSchema.parse({ name: 'Run', kind: 'boolean', unit: '', dailyTarget: '' }),
    ).toEqual({
      name: 'Run',
      kind: 'boolean',
    });
  });
});

describe('meetsTarget and formatHabitValue', () => {
  it('applies boolean and numeric targets', () => {
    expect(meetsTarget(exercise, true)).toBe(true);
    expect(meetsTarget(exercise, false)).toBe(false);
    expect(meetsTarget(reading, 20)).toBe(true);
    expect(meetsTarget(reading, 19)).toBe(false);
    expect(meetsTarget({ kind: 'numeric' }, 0)).toBe(false);
    expect(meetsTarget({ kind: 'numeric' }, 1)).toBe(true);
  });

  it('formats values with units', () => {
    expect(formatHabitValue(exercise, true)).toBe('done');
    expect(formatHabitValue(reading, 12)).toBe('12 pages');
    expect(formatHabitValue({ kind: 'numeric' }, 3)).toBe('3');
  });
});

describe('habitCategory.describe', () => {
  it('names the habit and its value, tolerating deleted habits', () => {
    const ctx = { today: '2026-09-09', habits };
    expect(habitCategory.describe({ habitId: 'h2', value: 30 }, ctx)).toBe('Read: 30 pages');
    expect(habitCategory.describe({ habitId: 'missing', value: true }, ctx)).toBe(
      'Habit (removed)',
    );
  });
});

describe('summarizeHabits', () => {
  it('reports days met out of elapsed days for active habits only', () => {
    const stats = summarizeHabits(
      [
        entry('2026-09-07', 'h1', true),
        entry('2026-09-08', 'h1', false),
        entry('2026-09-09', 'h1', true),
        entry('2026-09-09', 'h1', true),
        entry('2026-09-08', 'h2', 25),
        entry('2026-09-09', 'h2', 5),
        entry('2026-09-09', 'h3', true),
      ],
      { range: { from: '2026-09-07', to: '2026-09-13' }, today: '2026-09-09', habits },
    );
    expect(stats).toEqual([
      { label: 'Exercise', value: '2/3 days', hint: '67%' },
      { label: 'Read', value: '1/3 days', hint: '33%' },
    ]);
  });
});
