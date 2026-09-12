import type { CategoryKey } from '../categories/keys';

/** Local calendar day in `YYYY-MM-DD` form. Never a timestamp, never UTC. */
export type DateKey = string;

/** ISO-8601 timestamp. */
export type Timestamp = string;

/**
 * One logged item on one calendar day.
 *
 * `data` is the category-specific payload. It is validated by the owning
 * category's Zod schema before it is written and when it is read back, but the
 * database itself treats it as an opaque object.
 */
export interface Entry<TData = unknown> {
  id: string;
  date: DateKey;
  category: CategoryKey;
  data: TData;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type HabitKind = 'boolean' | 'numeric';

/** A habit definition. Daily values are stored as `habit` entries. */
export interface Habit {
  id: string;
  name: string;
  kind: HabitKind;
  /** Display unit for numeric habits, for example "pages" or "minutes". */
  unit?: string;
  /** Numeric habits count toward a streak on days where value >= dailyTarget. */
  dailyTarget?: number;
  archived: boolean;
  createdAt: Timestamp;
}

export interface DateRange {
  /** Inclusive start day. */
  from: DateKey;
  /** Inclusive end day. */
  to: DateKey;
}

export type GoalPeriod = 'week' | 'month' | 'year';

/**
 * A user-defined target, for example "Read 10 pages" (habit, weekly) or
 * "50 problems" (dsa, yearly). Progress is computed on the fly from entries
 * in the current period; nothing about progress is stored.
 */
export interface Goal {
  id: string;
  label: string;
  category: CategoryKey;
  /** Required when category is 'habit': which habit this goal tracks. */
  habitId?: string;
  target: number;
  period: GoalPeriod;
  createdAt: Timestamp;
}

export type NewEntry<TData = unknown> = Pick<Entry<TData>, 'date' | 'category' | 'data'>;
export type NewHabit = Pick<Habit, 'name' | 'kind' | 'unit' | 'dailyTarget'>;
export type NewGoal = Pick<Goal, 'label' | 'category' | 'habitId' | 'target' | 'period'>;
