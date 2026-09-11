import type { CategoryDefinition } from '../types';
import { HabitForm } from './Form';
import { formatHabitValue, habitEntrySchema, type HabitEntryData } from './schema';
import { summarizeHabits } from './summarize';

export const habitCategory: CategoryDefinition<HabitEntryData> = {
  key: 'habit',
  label: 'Habit',
  description: 'Daily yes/no or numeric habits with streaks.',
  color: {
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    accent: 'border-emerald-500',
  },
  schema: habitEntrySchema,
  describe: (data, { habits }) => {
    const habit = habits.find((h) => h.id === data.habitId);
    if (!habit) return 'Habit (removed)';
    return `${habit.name}: ${formatHabitValue(habit, data.value)}`;
  },
  summarize: summarizeHabits,
  Form: HabitForm,
};

export type { HabitEntryData } from './schema';
export { computeStreaks } from '../../lib/streaks';
export { meetsTarget } from './schema';
