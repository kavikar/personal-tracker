import { z } from 'zod';
import type { Habit } from '../../db/types';

/** Daily value for one habit: done/not done, or a number with a unit. */
export const habitEntrySchema = z.object({
  habitId: z.string().min(1, 'Pick a habit'),
  value: z.union([
    z.boolean(),
    z.coerce.number({ message: 'Enter a number' }).min(0, 'Cannot be negative'),
  ]),
});

export type HabitEntryData = z.infer<typeof habitEntrySchema>;

/** Fields needed to create a habit definition from the form. */
export const newHabitSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(60, 'Keep the name short'),
  kind: z.enum(['boolean', 'numeric']),
  unit: z
    .string()
    .trim()
    .transform((value) => (value === '' ? undefined : value))
    .optional(),
  dailyTarget: z
    .union([z.literal(''), z.coerce.number().positive('Target must be above zero')])
    .transform((value) => (value === '' ? undefined : value))
    .optional(),
});

export type NewHabitValues = z.infer<typeof newHabitSchema>;

/** Whether a logged value counts toward the streak for this habit. */
export function meetsTarget(
  habit: Pick<Habit, 'kind' | 'dailyTarget'>,
  value: HabitEntryData['value'],
): boolean {
  if (habit.kind === 'boolean') return value === true;
  const amount = typeof value === 'number' ? value : value ? 1 : 0;
  return amount >= (habit.dailyTarget ?? 1);
}

export function formatHabitValue(
  habit: Pick<Habit, 'kind' | 'unit'>,
  value: HabitEntryData['value'],
): string {
  if (habit.kind === 'boolean') return value ? 'done' : 'skipped';
  const amount = typeof value === 'number' ? value : value ? 1 : 0;
  return habit.unit ? `${amount} ${habit.unit}` : String(amount);
}
