import { beforeEach, describe, expect, it } from 'vitest';
import { z } from 'zod';
import type { CategoryDefinition } from '../../categories/types';
import { TrackerDatabase } from '../../db/database';
import { createRepository, type Repository } from '../../db/repository';
import { saveEntry, ValidationError } from './saveEntry';

const def = {
  key: 'dsa',
  schema: z.object({ title: z.string().min(1, 'Title is required') }),
} as unknown as CategoryDefinition<{ title: string }>;

let repo: Repository;
beforeEach(() => {
  repo = createRepository(new TrackerDatabase(`save-${crypto.randomUUID()}`));
});

describe('saveEntry', () => {
  it('creates a validated entry', async () => {
    const entry = await saveEntry(def, '2026-09-09', { title: 'Two Sum' }, undefined, repo);
    expect(entry.category).toBe('dsa');
    expect(entry.data).toEqual({ title: 'Two Sum' });
    await expect(repo.getEntriesByDate('2026-09-09')).resolves.toHaveLength(1);
  });

  it('updates an existing entry in place, including its date', async () => {
    const entry = await saveEntry(def, '2026-09-09', { title: 'Two Sum' }, undefined, repo);
    const updated = await saveEntry(def, '2026-09-10', { title: 'Three Sum' }, entry.id, repo);
    expect(updated.id).toBe(entry.id);
    expect(updated.date).toBe('2026-09-10');
    await expect(repo.listEntries()).resolves.toHaveLength(1);
  });

  it('creates a follow-up entry when the category asks for one', async () => {
    const recurring = {
      ...def,
      followUp: (previous, saved, date) =>
        previous && !previous.title.startsWith('done') && saved.title.startsWith('done')
          ? { date: `${date.slice(0, 8)}20`, category: 'dsa', data: { title: 'next' } }
          : undefined,
    } as CategoryDefinition<{ title: string }>;
    const entry = await saveEntry(recurring, '2026-09-09', { title: 'todo' }, undefined, repo);
    await expect(repo.listEntries()).resolves.toHaveLength(1);
    await saveEntry(recurring, '2026-09-09', { title: 'done' }, entry.id, repo);
    const all = await repo.listEntries();
    expect(all.map((e) => [e.date, (e.data as { title: string }).title])).toEqual([
      ['2026-09-09', 'done'],
      ['2026-09-20', 'next'],
    ]);
  });

  it('rejects invalid payloads without writing', async () => {
    await expect(
      saveEntry(def, '2026-09-09', { title: '' }, undefined, repo),
    ).rejects.toBeInstanceOf(ValidationError);
    await expect(repo.listEntries()).resolves.toHaveLength(0);
  });
});
