import type { DateKey } from '../db/types';
import { addDays, daysBetween } from './dates';

export interface Streaks {
  /** Consecutive met days ending today, or ending yesterday if today is not logged yet. */
  current: number;
  /** Longest run of consecutive met days on record. */
  longest: number;
}

/**
 * Compute streaks from the set of days on which a habit met its target.
 * Days after `today` are ignored so a pre-logged future day never counts.
 */
export function computeStreaks(metDays: Iterable<DateKey>, today: DateKey): Streaks {
  const days = [...new Set(metDays)].filter((day) => day <= today).sort();
  if (days.length === 0) return { current: 0, longest: 0 };

  let longest = 1;
  let run = 1;
  for (let i = 1; i < days.length; i += 1) {
    run = daysBetween(days[i - 1], days[i]) === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
  }

  const met = new Set(days);
  let cursor = met.has(today) ? today : addDays(today, -1);
  let current = 0;
  while (met.has(cursor)) {
    current += 1;
    cursor = addDays(cursor, -1);
  }

  return { current, longest };
}
