import {
  addDays as dfAddDays,
  addMonths as dfAddMonths,
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  isValid,
  parse,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import type { DateKey, DateRange } from '../db/types';

/** Weeks start on Monday everywhere in the app. */
export const WEEK_STARTS_ON = 1;

const KEY_FORMAT = 'yyyy-MM-dd';
const KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Format a Date as a local calendar day key. */
export function toDateKey(date: Date): DateKey {
  return format(date, KEY_FORMAT);
}

/** Parse a day key into a Date at local midnight. Throws on malformed input. */
export function parseDateKey(key: DateKey): Date {
  const date = parse(key, KEY_FORMAT, new Date());
  if (!KEY_PATTERN.test(key) || !isValid(date)) {
    throw new RangeError(`Invalid date key: ${key}`);
  }
  return date;
}

export function isValidDateKey(value: unknown): value is DateKey {
  if (typeof value !== 'string' || !KEY_PATTERN.test(value)) return false;
  return isValid(parse(value, KEY_FORMAT, new Date()));
}

export function todayKey(now: Date = new Date()): DateKey {
  return toDateKey(now);
}

export function addDays(key: DateKey, amount: number): DateKey {
  return toDateKey(dfAddDays(parseDateKey(key), amount));
}

export function addWeeks(key: DateKey, amount: number): DateKey {
  return addDays(key, amount * 7);
}

export function addMonths(key: DateKey, amount: number): DateKey {
  return toDateKey(dfAddMonths(parseDateKey(key), amount));
}

/** Signed number of calendar days from `from` to `to`. */
export function daysBetween(from: DateKey, to: DateKey): number {
  return differenceInCalendarDays(parseDateKey(to), parseDateKey(from));
}

export function compareDateKeys(a: DateKey, b: DateKey): number {
  return a.localeCompare(b);
}

export function isSameMonth(a: DateKey, b: DateKey): boolean {
  return a.slice(0, 7) === b.slice(0, 7);
}

export function monthRange(key: DateKey): DateRange {
  const date = parseDateKey(key);
  return { from: toDateKey(startOfMonth(date)), to: toDateKey(endOfMonth(date)) };
}

export function weekRange(key: DateKey): DateRange {
  const date = parseDateKey(key);
  return {
    from: toDateKey(startOfWeek(date, { weekStartsOn: WEEK_STARTS_ON })),
    to: toDateKey(endOfWeek(date, { weekStartsOn: WEEK_STARTS_ON })),
  };
}

export function yearRange(key: DateKey): DateRange {
  const date = parseDateKey(key);
  return { from: toDateKey(startOfYear(date)), to: toDateKey(endOfYear(date)) };
}

/** Every day key in an inclusive range, in order. */
export function eachDayInRange({ from, to }: DateRange): DateKey[] {
  return eachDayOfInterval({ start: parseDateKey(from), end: parseDateKey(to) }).map(toDateKey);
}

/** The seven day keys of the week containing `key`, Monday first. */
export function weekDays(key: DateKey): DateKey[] {
  return eachDayInRange(weekRange(key));
}

/**
 * The calendar grid for the month containing `key`: whole weeks, Monday first,
 * padded with days from the neighbouring months so every row has seven cells.
 */
export function monthGrid(key: DateKey): DateKey[][] {
  const { from, to } = monthRange(key);
  const days = eachDayInRange({ from: weekRange(from).from, to: weekRange(to).to });
  const rows: DateKey[][] = [];
  for (let i = 0; i < days.length; i += 7) rows.push(days.slice(i, i + 7));
  return rows;
}

export function isInRange(key: DateKey, { from, to }: DateRange): boolean {
  return key >= from && key <= to;
}

/** "Tue 9 Sep 2026" */
export function formatLong(key: DateKey): string {
  return format(parseDateKey(key), 'EEE d MMM yyyy');
}

/** "September 2026" */
export function formatMonth(key: DateKey): string {
  return format(parseDateKey(key), 'MMMM yyyy');
}

/** "9 Sep" */
export function formatShort(key: DateKey): string {
  return format(parseDateKey(key), 'd MMM');
}

export function formatDateKey(key: DateKey, pattern: string): string {
  return format(parseDateKey(key), pattern);
}

/** "Today", "Yesterday", or "Tue 9 Sep 2026" for anything further back. */
export function formatRelativeDay(key: DateKey, today: DateKey = todayKey()): string {
  if (key === today) return 'Today';
  if (key === addDays(today, -1)) return 'Yesterday';
  return formatLong(key);
}
