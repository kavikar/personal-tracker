import type { HabitEntryData } from '../../categories/habit';
import { meetsTarget } from '../../categories/habit';
import type { AdminData } from '../../categories/admin';
import type { DsaData } from '../../categories/dsa';
import type { DateKey, DateRange, Entry, Goal, GoalPeriod, Habit } from '../../db/types';
import { isInRange, monthRange, weekRange, yearRange } from '../../lib/dates';

export function periodRange(period: GoalPeriod, today: DateKey): DateRange {
  switch (period) {
    case 'week':
      return weekRange(today);
    case 'month':
      return monthRange(today);
    case 'year':
      return yearRange(today);
  }
}

export interface GoalProgress {
  goal: Goal;
  habit?: Habit;
  current: number;
  range: DateRange;
  /** 0-100+, uncapped so an over-achieved goal is visible in the number. */
  percent: number;
  done: boolean;
}

/**
 * How far a goal is toward its target in its current period, counted from
 * scratch each time rather than stored: a habit goal sums numeric values or
 * counts met days, a dsa/admin goal counts solved/completed entries, and
 * everything else (job search) counts entries logged.
 */
export function computeGoalProgress(
  goal: Goal,
  entries: readonly Entry[],
  habits: readonly Habit[],
  today: DateKey,
): GoalProgress {
  const range = periodRange(goal.period, today);
  const inRange = entries.filter(
    (entry) => entry.category === goal.category && isInRange(entry.date, range),
  );

  let current: number;
  const habit = goal.category === 'habit' ? habits.find((h) => h.id === goal.habitId) : undefined;

  if (goal.category === 'habit') {
    const relevant = inRange.filter(
      (entry) => (entry.data as HabitEntryData).habitId === goal.habitId,
    );
    current =
      habit?.kind === 'numeric'
        ? relevant.reduce((sum, entry) => {
            const value = (entry.data as HabitEntryData).value;
            return sum + (typeof value === 'number' ? value : 0);
          }, 0)
        : relevant.filter(
            (entry) => habit && meetsTarget(habit, (entry.data as HabitEntryData).value),
          ).length;
  } else if (goal.category === 'dsa') {
    current = inRange.filter((entry) => (entry.data as DsaData).solved).length;
  } else if (goal.category === 'admin') {
    current = inRange.filter((entry) => (entry.data as AdminData).completed).length;
  } else {
    current = inRange.length;
  }

  const percent = goal.target > 0 ? (current / goal.target) * 100 : 0;
  return { goal, habit, current, range, percent, done: current >= goal.target };
}
