import type { Entry } from '../../db/types';
import { eachDayInRange } from '../../lib/dates';
import type { SummaryContext, SummaryStat } from '../types';
import { meetsTarget, type HabitEntryData } from './schema';

/**
 * One stat per active habit: days met out of the days in range that have
 * already happened. Streaks need the full history, so the dashboard computes
 * them separately from all habit entries.
 */
export function summarizeHabits(
  entries: Entry<HabitEntryData>[],
  { range, today, habits }: SummaryContext,
): SummaryStat[] {
  const elapsed = eachDayInRange(range).filter((day) => day <= today).length;
  return habits
    .filter((habit) => !habit.archived)
    .map((habit) => {
      const met = new Set(
        entries
          .filter(
            (entry) => entry.data.habitId === habit.id && meetsTarget(habit, entry.data.value),
          )
          .map((entry) => entry.date),
      ).size;
      const rate = elapsed > 0 ? Math.round((met / elapsed) * 100) : 0;
      return { label: habit.name, value: `${met}/${elapsed} days`, hint: `${rate}%` };
    });
}
