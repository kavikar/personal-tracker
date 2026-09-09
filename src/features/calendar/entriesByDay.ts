import type { CategoryKey } from '../../categories/keys';
import type { DateKey, Entry } from '../../db/types';

export interface DaySummary {
  total: number;
  /** Entry count per category, in first-seen order. */
  byCategory: Map<CategoryKey, number>;
}

/** Group entries by day and count them per category. */
export function summarizeByDay(entries: readonly Entry[]): Map<DateKey, DaySummary> {
  const days = new Map<DateKey, DaySummary>();
  for (const entry of entries) {
    let day = days.get(entry.date);
    if (!day) {
      day = { total: 0, byCategory: new Map() };
      days.set(entry.date, day);
    }
    day.total += 1;
    day.byCategory.set(entry.category, (day.byCategory.get(entry.category) ?? 0) + 1);
  }
  return days;
}
