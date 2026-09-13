import type { AdminData } from '../../categories/admin';
import {
  CAREER_PLAN_MARKER,
  actionList,
  roadmap90,
  weeklyApplicationTarget,
  weeklyScheduleBlocks,
} from '../../data/careerPlan';
import type { Repository } from '../../db/repository';
import type { DateKey, Entry, NewEntry } from '../../db/types';
import { addDays, addMonths, parseDateKey } from '../../lib/dates';

/** The next occurrence of `weekday` (0=Sun..6=Sat) on or after `today`. */
function nextWeekday(today: DateKey, weekday: number): DateKey {
  const diff = (weekday - parseDateKey(today).getDay() + 7) % 7;
  return addDays(today, diff);
}

function adminEntry(date: DateKey, data: AdminData): NewEntry<AdminData> {
  return { date, category: 'admin', data };
}

export interface CareerPlanImportSummary {
  scheduleBlocks: number;
  actionItems: number;
  roadmapItems: number;
  goals: number;
}

/** True once `importCareerPlan` has already run — checked so the button can hide itself. */
export function isCareerPlanImported(entries: Entry[]): boolean {
  return entries.some(
    (e) => e.category === 'admin' && (e.data as AdminData).notes?.includes(CAREER_PLAN_MARKER),
  );
}

/**
 * One-time import of the career plan's weekly schedule, action list, and
 * 90-day roadmap as admin tasks, plus the one goal the plan states an actual
 * number for (10-15 applications/week). Idempotency is the caller's
 * responsibility — check `isCareerPlanImported` first.
 */
export async function importCareerPlan(
  repository: Repository,
  today: DateKey,
): Promise<CareerPlanImportSummary> {
  const entries: NewEntry<AdminData>[] = [];

  for (const block of weeklyScheduleBlocks) {
    const dueDate = nextWeekday(today, block.weekday);
    entries.push(
      adminEntry(dueDate, {
        title: block.title,
        completed: false,
        dueDate,
        recurrence: { every: 1, unit: 'week' },
        notes: `${CAREER_PLAN_MARKER} ${block.notes}`,
      }),
    );
  }

  for (const group of actionList) {
    const dueDate = addDays(today, group.daysFromNow);
    for (const item of group.items) {
      entries.push(
        adminEntry(dueDate, {
          title: item,
          completed: false,
          dueDate,
          notes: `${CAREER_PLAN_MARKER} ${group.title}`,
        }),
      );
    }
  }

  for (const month of roadmap90) {
    const dueDate = addMonths(today, month.monthsFromNow);
    for (const item of month.items) {
      entries.push(
        adminEntry(dueDate, {
          title: item,
          completed: false,
          dueDate,
          notes: `${CAREER_PLAN_MARKER} ${month.month} — ${month.title}`,
        }),
      );
    }
  }

  await repository.addEntries(entries);

  await repository.addGoal({
    label: 'Apply to jobs',
    category: 'jobSearch',
    target: weeklyApplicationTarget,
    period: 'week',
  });

  return {
    scheduleBlocks: weeklyScheduleBlocks.length,
    actionItems: actionList.reduce((sum, g) => sum + g.items.length, 0),
    roadmapItems: roadmap90.reduce((sum, m) => sum + m.items.length, 0),
    goals: 1,
  };
}
