import { beforeEach, describe, expect, it } from 'vitest';
import { TrackerDatabase } from './database';
import { createRepository, NotFoundError, type Repository } from './repository';

let repo: Repository;

beforeEach(async () => {
  const db = new TrackerDatabase(`test-${crypto.randomUUID()}`);
  repo = createRepository(db);
});

describe('entries', () => {
  it('adds an entry with generated id and timestamps', async () => {
    const entry = await repo.addEntry({
      date: '2026-09-09',
      category: 'dsa',
      data: { title: 'Two Sum' },
    });
    expect(entry.id).toMatch(/[0-9a-f-]{36}/);
    expect(entry.createdAt).toBe(entry.updatedAt);
    await expect(repo.getEntry(entry.id)).resolves.toEqual(entry);
  });

  it('adds many entries at once', async () => {
    const rows = await repo.addEntries([
      { date: '2026-09-09', category: 'dsa', data: { n: 1 } },
      { date: '2026-09-10', category: 'habit', data: { n: 2 } },
    ]);
    expect(rows).toHaveLength(2);
    expect(new Set(rows.map((r) => r.id)).size).toBe(2);
    await expect(repo.listEntries()).resolves.toHaveLength(2);
  });

  it('updates data and bumps updatedAt', async () => {
    const entry = await repo.addEntry({ date: '2026-09-09', category: 'dsa', data: { n: 1 } });
    await new Promise((r) => setTimeout(r, 2));
    const updated = await repo.updateEntry(entry.id, { data: { n: 2 } });
    expect(updated.data).toEqual({ n: 2 });
    expect(updated.updatedAt > entry.updatedAt).toBe(true);
    expect(updated.createdAt).toBe(entry.createdAt);
  });

  it('throws NotFoundError when updating a missing entry', async () => {
    await expect(repo.updateEntry('missing', { data: {} })).rejects.toBeInstanceOf(NotFoundError);
  });

  it('deletes an entry', async () => {
    const entry = await repo.addEntry({ date: '2026-09-09', category: 'habit', data: {} });
    await repo.deleteEntry(entry.id);
    await expect(repo.getEntry(entry.id)).resolves.toBeUndefined();
  });

  it('lists entries by day sorted by creation order', async () => {
    const first = await repo.addEntry({ date: '2026-09-09', category: 'dsa', data: { n: 1 } });
    await new Promise((r) => setTimeout(r, 2));
    const second = await repo.addEntry({ date: '2026-09-09', category: 'habit', data: { n: 2 } });
    await repo.addEntry({ date: '2026-09-10', category: 'dsa', data: { n: 3 } });
    const rows = await repo.getEntriesByDate('2026-09-09');
    expect(rows.map((r) => r.id)).toEqual([first.id, second.id]);
  });

  it('queries an inclusive date range, optionally scoped to a category', async () => {
    await repo.addEntry({ date: '2026-08-31', category: 'dsa', data: {} });
    await repo.addEntry({ date: '2026-09-01', category: 'dsa', data: {} });
    await repo.addEntry({ date: '2026-09-15', category: 'jobSearch', data: {} });
    await repo.addEntry({ date: '2026-09-30', category: 'dsa', data: {} });
    await repo.addEntry({ date: '2026-10-01', category: 'dsa', data: {} });

    const all = await repo.getEntriesInRange({ from: '2026-09-01', to: '2026-09-30' });
    expect(all.map((r) => r.date)).toEqual(['2026-09-01', '2026-09-15', '2026-09-30']);

    const dsaOnly = await repo.getEntriesInRange({ from: '2026-09-01', to: '2026-09-30' }, 'dsa');
    expect(dsaOnly.map((r) => r.date)).toEqual(['2026-09-01', '2026-09-30']);
  });
});

describe('habits', () => {
  it('adds and lists habits in creation order, hiding archived ones by default', async () => {
    const a = await repo.addHabit({ name: 'Exercise', kind: 'boolean' });
    await new Promise((r) => setTimeout(r, 2));
    const b = await repo.addHabit({
      name: 'Read',
      kind: 'numeric',
      unit: 'pages',
      dailyTarget: 20,
    });
    await repo.updateHabit(a.id, { archived: true });

    expect((await repo.listHabits()).map((h) => h.id)).toEqual([b.id]);
    expect((await repo.listHabits(true)).map((h) => h.id)).toEqual([a.id, b.id]);
  });

  it('throws NotFoundError when updating a missing habit', async () => {
    await expect(repo.updateHabit('missing', { name: 'x' })).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe('goals', () => {
  it('adds, updates, and lists goals in creation order', async () => {
    const a = await repo.addGoal({
      label: 'Apply to jobs',
      category: 'jobSearch',
      target: 10,
      period: 'month',
    });
    await new Promise((r) => setTimeout(r, 2));
    const b = await repo.addGoal({
      label: 'Read more',
      category: 'habit',
      habitId: 'habit-1',
      target: 100,
      period: 'year',
    });

    expect((await repo.listGoals()).map((g) => g.id)).toEqual([a.id, b.id]);

    const updated = await repo.updateGoal(a.id, { target: 20 });
    expect(updated.target).toBe(20);
  });

  it('throws NotFoundError when updating a missing goal', async () => {
    await expect(repo.updateGoal('missing', { target: 1 })).rejects.toBeInstanceOf(NotFoundError);
  });

  it('deletes a goal', async () => {
    const goal = await repo.addGoal({
      label: 'Solve problems',
      category: 'dsa',
      target: 50,
      period: 'year',
    });
    await repo.deleteGoal(goal.id);
    await expect(repo.listGoals()).resolves.toEqual([]);
  });
});

describe('clearAll', () => {
  it('removes every row', async () => {
    await repo.addEntry({ date: '2026-09-09', category: 'dsa', data: {} });
    await repo.addHabit({ name: 'Exercise', kind: 'boolean' });
    await repo.addGoal({
      label: 'Apply to jobs',
      category: 'jobSearch',
      target: 10,
      period: 'month',
    });
    await repo.clearAll();
    await expect(repo.listEntries()).resolves.toEqual([]);
    await expect(repo.listHabits(true)).resolves.toEqual([]);
    await expect(repo.listGoals()).resolves.toEqual([]);
  });
});
