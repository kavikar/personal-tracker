import type { DateKey, NewEntry } from '../../db/types';
import { addDays, addMonths, addWeeks } from '../../lib/dates';
import type { AdminData, Recurrence } from './schema';

export function nextDueDate(dueDate: DateKey, { every, unit }: Recurrence): DateKey {
  switch (unit) {
    case 'day':
      return addDays(dueDate, every);
    case 'week':
      return addWeeks(dueDate, every);
    case 'month':
      return addMonths(dueDate, every);
  }
}

/**
 * When a recurring task becomes completed (edited from open to done, or logged
 * as done in the first place), schedule its next occurrence on the next due
 * date. Editing an already completed task, or completing a one-off task,
 * creates nothing.
 */
export function adminFollowUp(
  previous: AdminData | undefined,
  saved: AdminData,
  _date: DateKey,
): NewEntry<AdminData> | undefined {
  const justCompleted = saved.completed && !(previous?.completed ?? false);
  if (!justCompleted || !saved.recurrence || !saved.dueDate) return undefined;
  const dueDate = nextDueDate(saved.dueDate, saved.recurrence);
  return {
    date: dueDate,
    category: 'admin',
    data: { ...saved, completed: false, dueDate },
  };
}
