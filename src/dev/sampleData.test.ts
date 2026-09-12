import { describe, expect, it } from 'vitest';
import { categories, parseEntryData } from '../categories';
import { TrackerDatabase } from '../db/database';
import { createRepository } from '../db/repository';
import { loadSampleData } from './sampleData';

describe('loadSampleData', () => {
  it('creates habits and valid entries for every category', async () => {
    const repo = createRepository(new TrackerDatabase(`sample-${crypto.randomUUID()}`));
    const summary = await loadSampleData(repo, '2026-09-09');
    const entries = await repo.listEntries();
    expect(entries).toHaveLength(summary.entries);
    expect(await repo.listHabits()).toHaveLength(summary.habits);
    expect(await repo.listGoals()).toHaveLength(summary.goals);

    for (const def of categories) {
      const own = entries.filter((entry) => entry.category === def.key);
      expect(own.length, def.key).toBeGreaterThan(0);
      for (const entry of own) expect(parseEntryData(def, entry.data).ok, def.key).toBe(true);
    }
    expect(entries.every((entry) => entry.date <= '2026-09-09')).toBe(true);
  });

  it('is deterministic', async () => {
    const a = createRepository(new TrackerDatabase(`sample-${crypto.randomUUID()}`));
    const b = createRepository(new TrackerDatabase(`sample-${crypto.randomUUID()}`));
    await loadSampleData(a, '2026-09-09');
    await loadSampleData(b, '2026-09-09');
    const strip = (rows: Awaited<ReturnType<typeof a.listEntries>>) =>
      rows
        .map((row) =>
          [row.date, row.category, JSON.stringify(row.data).replace(/"habitId":"[^"]+"/, '')].join(
            '|',
          ),
        )
        .sort();
    expect(strip(await a.listEntries())).toEqual(strip(await b.listEntries()));
  });
});
