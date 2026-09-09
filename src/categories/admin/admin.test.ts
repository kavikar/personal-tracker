import { describe, expect, it } from 'vitest';
import type { Entry } from '../../db/types';
import { adminFollowUp, nextDueDate } from './followUp';
import { adminCategory, type AdminData } from './index';
import { adminSchema } from './schema';
import { summarizeAdmin } from './summarize';

const ctx = { range: { from: '2026-09-01', to: '2026-09-30' }, today: '2026-09-09', habits: [] };

const task = (data: Partial<AdminData>): AdminData => ({
  title: 'IELTS practice',
  completed: false,
  ...data,
});
const entry = (data: Partial<AdminData>): Entry<AdminData> => ({
  id: crypto.randomUUID(),
  date: '2026-09-09',
  category: 'admin',
  data: task(data),
  createdAt: '',
  updatedAt: '',
});

describe('adminSchema', () => {
  it('coerces recurrence numbers and drops blanks', () => {
    expect(
      adminSchema.parse({
        title: 'WES',
        dueDate: '2026-09-12',
        completed: false,
        recurrence: { every: '2', unit: 'week' },
        notes: '',
      }),
    ).toEqual({
      title: 'WES',
      dueDate: '2026-09-12',
      completed: false,
      recurrence: { every: 2, unit: 'week' },
    });
  });

  it('requires a due date for recurring tasks', () => {
    const result = adminSchema.safeParse({
      title: 'x',
      dueDate: '',
      completed: false,
      recurrence: { every: 1, unit: 'day' },
    });
    expect(result.success).toBe(false);
    expect(result.error!.issues[0].path).toEqual(['dueDate']);
  });
});

describe('nextDueDate', () => {
  it('advances by days, weeks, and months', () => {
    expect(nextDueDate('2026-09-09', { every: 2, unit: 'day' })).toBe('2026-09-11');
    expect(nextDueDate('2026-09-09', { every: 1, unit: 'week' })).toBe('2026-09-16');
    expect(nextDueDate('2026-01-31', { every: 1, unit: 'month' })).toBe('2026-02-28');
  });
});

describe('adminFollowUp', () => {
  const recurring = task({ dueDate: '2026-09-09', recurrence: { every: 2, unit: 'day' } });

  it('creates the next occurrence when a recurring task is completed', () => {
    const next = adminFollowUp(recurring, { ...recurring, completed: true }, '2026-09-09');
    expect(next).toEqual({
      date: '2026-09-11',
      category: 'admin',
      data: { ...recurring, completed: false, dueDate: '2026-09-11' },
    });
  });

  it('also schedules the next one when a new entry is logged as already done', () => {
    const done = { ...recurring, completed: true };
    expect(adminFollowUp(undefined, done, '2026-09-09')?.date).toBe('2026-09-11');
  });

  it('creates nothing for one-off tasks or re-saves of completed tasks', () => {
    expect(adminFollowUp(task({}), task({ completed: true }), '2026-09-09')).toBeUndefined();
    const done = { ...recurring, completed: true };
    expect(adminFollowUp(done, done, '2026-09-09')).toBeUndefined();
    expect(adminFollowUp(done, { ...done, notes: 'edited' }, '2026-09-09')).toBeUndefined();
  });
});

describe('adminCategory', () => {
  it('describes state, due date, and recurrence', () => {
    expect(adminCategory.describe(task({}), ctx)).toBe('☐ IELTS practice');
    expect(
      adminCategory.describe(
        task({ completed: true, dueDate: '2026-09-12', recurrence: { every: 1, unit: 'week' } }),
        ctx,
      ),
    ).toBe('✓ IELTS practice · due 12 Sep · every week');
    expect(
      adminCategory.describe(
        task({ recurrence: { every: 3, unit: 'day' }, dueDate: '2026-09-12' }),
        ctx,
      ),
    ).toContain('every 3 days');
  });

  it('summarises completed and open tasks with overdue count', () => {
    expect(
      summarizeAdmin(
        [
          entry({ completed: true }),
          entry({ dueDate: '2026-09-01' }),
          entry({ dueDate: '2026-09-20' }),
          entry({}),
        ],
        ctx,
      ),
    ).toEqual([
      { label: 'Tasks completed', value: 1 },
      { label: 'Open tasks', value: 3, hint: '1 overdue' },
    ]);
  });
});
