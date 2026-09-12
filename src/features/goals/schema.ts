import { z } from 'zod';
import { CATEGORY_KEYS } from '../../categories/keys';

export const GOAL_PERIODS = ['week', 'month', 'year'] as const;

export const GOAL_PERIOD_LABELS: Record<(typeof GOAL_PERIODS)[number], string> = {
  week: 'week',
  month: 'month',
  year: 'year',
};

export const goalSchema = z
  .object({
    label: z.string().trim().min(1, 'Give the goal a name').max(60, 'Keep it short'),
    category: z.enum(CATEGORY_KEYS, { message: 'Pick a category' }),
    habitId: z
      .string()
      .trim()
      .transform((value) => (value === '' ? undefined : value))
      .optional(),
    target: z.coerce.number({ message: 'Enter a number' }).positive('Target must be above zero'),
    period: z.enum(GOAL_PERIODS, { message: 'Pick a period' }),
  })
  .refine((data) => data.category !== 'habit' || Boolean(data.habitId), {
    message: 'Pick a habit',
    path: ['habitId'],
  });

export type GoalFormData = z.infer<typeof goalSchema>;
