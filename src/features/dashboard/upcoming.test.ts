import { describe, expect, it } from 'vitest';
import type { AnyCategoryDefinition } from '../../categories/types';
import type { Entry } from '../../db/types';
import { collectDueItems } from './upcoming';

const withDue = {
  key: 'admin',
  dueDate: (data: { due?: string }) => data.due,
  isDone: (data: { done?: boolean }) => data.done === true,
} as unknown as AnyCategoryDefinition;
const withoutDue = { key: 'dsa' } as unknown as AnyCategoryDefinition;

const entry = (id: string, category: Entry['category'], data: object): Entry => ({
  id,
  date: '2026-09-01',
  category,
  data,
  createdAt: id,
  updatedAt: id,
});

describe('collectDueItems', () => {
  it('keeps open items due within the horizon, overdue first', () => {
    const items = collectDueItems(
      [
        entry('a', 'admin', { due: '2026-09-15' }),
        entry('b', 'admin', { due: '2026-09-05' }),
        entry('c', 'admin', { due: '2026-09-10', done: true }),
        entry('d', 'admin', { due: '2026-09-20' }),
        entry('e', 'admin', {}),
        entry('f', 'dsa', { due: '2026-09-09' }),
        entry('g', 'admin', { due: '2026-09-09' }),
      ],
      [withDue, withoutDue],
      '2026-09-09',
    );
    expect(items.map((item) => [item.entry.id, item.overdue])).toEqual([
      ['b', true],
      ['g', false],
      ['a', false],
    ]);
  });

  it('respects a custom horizon', () => {
    const items = collectDueItems(
      [entry('a', 'admin', { due: '2026-09-11' })],
      [withDue],
      '2026-09-09',
      1,
    );
    expect(items).toEqual([]);
  });
});
