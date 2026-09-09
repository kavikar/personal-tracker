import { z } from 'zod';
import { optionalDateKey, optionalText } from '../shared';

export const RECURRENCE_UNITS = ['day', 'week', 'month'] as const;
export type RecurrenceUnit = (typeof RECURRENCE_UNITS)[number];

export const recurrenceSchema = z.object({
  every: z.coerce
    .number({ message: 'Enter how often it repeats' })
    .int('Use a whole number')
    .min(1, 'Must repeat at least every 1')
    .max(365, 'That is too far apart'),
  unit: z.enum(RECURRENCE_UNITS, { message: 'Pick a unit' }),
});

export type Recurrence = z.infer<typeof recurrenceSchema>;

export const adminSchema = z
  .object({
    title: z.string().trim().min(1, 'Task is required'),
    dueDate: optionalDateKey,
    completed: z.boolean(),
    recurrence: recurrenceSchema.optional(),
    notes: optionalText,
  })
  .refine((data) => !data.recurrence || data.dueDate !== undefined, {
    message: 'Recurring tasks need a due date',
    path: ['dueDate'],
  });

export type AdminData = z.infer<typeof adminSchema>;

export function describeRecurrence({ every, unit }: Recurrence): string {
  return every === 1 ? `every ${unit}` : `every ${every} ${unit}s`;
}
