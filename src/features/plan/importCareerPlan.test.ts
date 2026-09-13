import { beforeEach, describe, expect, it } from 'vitest';
import { TrackerDatabase } from '../../db/database';
import { createRepository, type Repository } from '../../db/repository';
import { actionList, roadmap90, weeklyScheduleBlocks } from '../../data/careerPlan';
import { importCareerPlan, isCareerPlanImported } from './importCareerPlan';

let repo: Repository;

beforeEach(async () => {
  const db = new TrackerDatabase(`test-${crypto.randomUUID()}`);
  repo = createRepository(db);
});

describe('importCareerPlan', () => {
  it('seeds schedule blocks, action items, roadmap items, and one goal', async () => {
    const summary = await importCareerPlan(repo, '2026-09-09');

    expect(summary.scheduleBlocks).toBe(weeklyScheduleBlocks.length);
    expect(summary.actionItems).toBe(actionList.reduce((sum, g) => sum + g.items.length, 0));
    expect(summary.roadmapItems).toBe(roadmap90.reduce((sum, m) => sum + m.items.length, 0));
    expect(summary.goals).toBe(1);

    const entries = await repo.listEntries();
    expect(entries).toHaveLength(
      summary.scheduleBlocks + summary.actionItems + summary.roadmapItems,
    );
    expect(entries.every((e) => e.category === 'admin')).toBe(true);

    const goals = await repo.listGoals();
    expect(goals).toHaveLength(1);
    expect(goals[0]).toMatchObject({ category: 'jobSearch', period: 'week' });
  });

  it('gives recurring schedule blocks their weekly recurrence', async () => {
    await importCareerPlan(repo, '2026-09-09');
    const entries = await repo.listEntries();
    const recurring = entries.filter(
      (e) => (e.data as { recurrence?: unknown }).recurrence !== undefined,
    );
    expect(recurring).toHaveLength(weeklyScheduleBlocks.length);
  });

  it('is detected as imported once run, and not before', async () => {
    expect(isCareerPlanImported(await repo.listEntries())).toBe(false);
    await importCareerPlan(repo, '2026-09-09');
    expect(isCareerPlanImported(await repo.listEntries())).toBe(true);
  });
});
