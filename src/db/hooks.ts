import { useLiveQuery } from 'dexie-react-hooks';
import type { CategoryKey } from '../categories/keys';
import { repository } from './repository';
import type { DateKey, DateRange, Entry, Goal, Habit } from './types';

/**
 * Live queries re-run automatically whenever the underlying tables change, so
 * components never need to refetch after a write. Each hook returns
 * `undefined` while the first read is in flight.
 */

export function useEntriesInRange(range: DateRange, category?: CategoryKey): Entry[] | undefined {
  return useLiveQuery(
    () => repository.getEntriesInRange(range, category),
    [range.from, range.to, category],
  );
}

export function useEntriesByDate(date: DateKey): Entry[] | undefined {
  return useLiveQuery(() => repository.getEntriesByDate(date), [date]);
}

export function useAllEntries(): Entry[] | undefined {
  return useLiveQuery(() => repository.listEntries(), []);
}

export function useHabits(includeArchived = false): Habit[] | undefined {
  return useLiveQuery(() => repository.listHabits(includeArchived), [includeArchived]);
}

export function useGoals(): Goal[] | undefined {
  return useLiveQuery(() => repository.listGoals(), []);
}
