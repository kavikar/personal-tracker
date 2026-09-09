import { meetsTarget, type HabitEntryData } from '../../categories/habit';
import type { DateKey, Entry, Habit } from '../../db/types';
import { computeStreaks, type Streaks } from '../../lib/streaks';

export interface HabitStreakRow extends Streaks {
  habit: Habit;
  /** Whether the habit has been met today. */
  doneToday: boolean;
}

export function habitStreakRows(
  habits: readonly Habit[],
  entries: readonly Entry[],
  today: DateKey,
): HabitStreakRow[] {
  const metDays = new Map<string, DateKey[]>();
  for (const entry of entries) {
    if (entry.category !== 'habit') continue;
    const data = entry.data as HabitEntryData;
    const habit = habits.find((h) => h.id === data.habitId);
    if (!habit || !meetsTarget(habit, data.value)) continue;
    const list = metDays.get(habit.id) ?? [];
    list.push(entry.date);
    metDays.set(habit.id, list);
  }
  return habits.map((habit) => {
    const days = metDays.get(habit.id) ?? [];
    return { habit, ...computeStreaks(days, today), doneToday: days.includes(today) };
  });
}
