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

  it('rejects invalid payloads without writing', async () => {
    await expect(
      saveEntry(def, '2026-09-09', { title: '' }, undefined, repo),
    ).rejects.toBeInstanceOf(ValidationError);
    await expect(repo.listEntries()).resolves.toHaveLength(0);
  });
});
