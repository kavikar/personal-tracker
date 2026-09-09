import type { ComponentType } from 'react';
import type { ZodType } from 'zod';
import type { DateKey, DateRange, Entry, Habit } from '../db/types';
import type { CategoryKey } from './keys';

/** Props every category quick-entry form receives. The same form handles add and edit. */
export interface FormProps<T> {
  /** The calendar day the entry belongs to. */
  date: DateKey;
  /** Present when editing an existing entry. */
  initial?: T;
  onSubmit: (data: T) => void | Promise<void>;
  onCancel: () => void;
}

/** Extra data a category may need to render or summarise entries. */
export interface CategoryContext {
  today: DateKey;
  habits: Habit[];
}

export interface SummaryContext extends CategoryContext {
  range: DateRange;
}

/** One number on the dashboard, for example "Applications sent: 4". */
export interface SummaryStat {
  label: string;
  value: string | number;
  /** Optional secondary line, for example "2 overdue". */
  hint?: string;
}

/** Tailwind class names that give a category its visual identity. */
export interface CategoryColor {
  /** Small dot on calendar cells. */
  dot: string;
  /** Pill background and text for labels. */
  badge: string;
  /** Left border accent on entry rows. */
  accent: string;
}

/**
 * The contract every category implements. Categories are plain modules under
 * `src/categories/<name>/` and are listed in `registry.ts`.
 */
export interface CategoryDefinition<T> {
  key: CategoryKey;
  label: string;
  description: string;
  color: CategoryColor;
  /** Validates and types the entry payload. */
  schema: ZodType<T>;
  /** One-line label for an entry in lists and search results. */
  describe: (data: T, ctx: CategoryContext) => string;
  /** Rollup numbers for the dashboard over a date range. */
  summarize: (entries: Entry<T>[], ctx: SummaryContext) => SummaryStat[];
  /** Quick-entry and edit form. */
  Form: ComponentType<FormProps<T>>;
  /**
   * The day an entry needs attention (a follow-up, a deadline). Categories
   * without deadlines leave this undefined.
   */
  dueDate?: (data: T) => DateKey | undefined;
  /** Whether a due item has been dealt with. Defaults to false when omitted. */
  isDone?: (data: T) => boolean;
}

/**
 * A definition with its payload type erased, for code that iterates over every
 * category. The `any` is confined to this alias because `CategoryDefinition`
 * uses `T` in both parameter and return positions.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyCategoryDefinition = CategoryDefinition<any>;
