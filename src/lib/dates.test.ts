import { describe, expect, it } from 'vitest';
import {
  addDays,
  addMonths,
  addWeeks,
  daysBetween,
  eachDayInRange,
  formatLong,
  formatMonth,
  isInRange,
  isSameMonth,
  isValidDateKey,
  monthGrid,
  monthRange,
  parseDateKey,
  toDateKey,
  todayKey,
  weekDays,
  weekRange,
} from './dates';

describe('date keys', () => {
  it('round-trips a local date through a key', () => {
    const date = new Date(2026, 8, 9, 15, 30);
    expect(toDateKey(date)).toBe('2026-09-09');
    expect(parseDateKey('2026-09-09')).toEqual(new Date(2026, 8, 9));
  });

  it('rejects malformed or impossible keys', () => {
    expect(() => parseDateKey('2026-9-9')).toThrow(RangeError);
    expect(() => parseDateKey('2026-02-30')).toThrow(RangeError);
    expect(isValidDateKey('2026-02-28')).toBe(true);
    expect(isValidDateKey('2026-02-30')).toBe(false);
    expect(isValidDateKey(20260909)).toBe(false);
  });

  it('derives today from an injected clock', () => {
    expect(todayKey(new Date(2026, 0, 1, 23, 59))).toBe('2026-01-01');
  });
});

describe('arithmetic', () => {
  it('adds days across month and year boundaries', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
  });

  it('adds weeks and months', () => {
    expect(addWeeks('2026-09-09', 1)).toBe('2026-09-16');
    expect(addMonths('2026-01-31', 1)).toBe('2026-02-28');
    expect(addMonths('2026-09-09', -12)).toBe('2025-09-09');
  });

  it('counts calendar days between keys, signed', () => {
    expect(daysBetween('2026-09-01', '2026-09-09')).toBe(8);
    expect(daysBetween('2026-09-09', '2026-09-01')).toBe(-8);
    expect(daysBetween('2026-09-09', '2026-09-09')).toBe(0);
  });
});

describe('ranges', () => {
  it('builds Monday-to-Sunday week ranges', () => {
    expect(weekRange('2026-09-09')).toEqual({ from: '2026-09-07', to: '2026-09-13' });
    expect(weekRange('2026-09-07')).toEqual({ from: '2026-09-07', to: '2026-09-13' });
    expect(weekRange('2026-09-13')).toEqual({ from: '2026-09-07', to: '2026-09-13' });
  });

  it('builds month ranges', () => {
    expect(monthRange('2026-02-14')).toEqual({ from: '2026-02-01', to: '2026-02-28' });
    expect(monthRange('2028-02-14')).toEqual({ from: '2028-02-01', to: '2028-02-29' });
  });

  it('enumerates days in a range inclusively', () => {
    expect(eachDayInRange({ from: '2026-01-30', to: '2026-02-02' })).toEqual([
      '2026-01-30',
      '2026-01-31',
      '2026-02-01',
      '2026-02-02',
    ]);
  });

  it('checks membership and month equality', () => {
    expect(isInRange('2026-09-09', { from: '2026-09-01', to: '2026-09-30' })).toBe(true);
    expect(isInRange('2026-10-01', { from: '2026-09-01', to: '2026-09-30' })).toBe(false);
    expect(isSameMonth('2026-09-01', '2026-09-30')).toBe(true);
    expect(isSameMonth('2026-09-30', '2026-10-01')).toBe(false);
  });
});

describe('calendar grids', () => {
  it('returns the seven days of a week, Monday first', () => {
    expect(weekDays('2026-09-09')).toEqual([
      '2026-09-07',
      '2026-09-08',
      '2026-09-09',
      '2026-09-10',
      '2026-09-11',
      '2026-09-12',
      '2026-09-13',
    ]);
  });

  it('pads the month grid to whole weeks', () => {
    const grid = monthGrid('2026-09-15');
    expect(grid).toHaveLength(5);
    expect(grid[0]).toEqual([
      '2026-08-31',
      '2026-09-01',
      '2026-09-02',
      '2026-09-03',
      '2026-09-04',
      '2026-09-05',
      '2026-09-06',
    ]);
    expect(grid[4][6]).toBe('2026-10-04');
    expect(grid.every((row) => row.length === 7)).toBe(true);
  });

  it('uses six rows when the month needs them', () => {
    // August 2026 starts on a Saturday and has 31 days.
    const grid = monthGrid('2026-08-01');
    expect(grid).toHaveLength(6);
    expect(grid[0][0]).toBe('2026-07-27');
    expect(grid[5][6]).toBe('2026-09-06');
  });
});

describe('formatting', () => {
  it('formats human-readable labels', () => {
    expect(formatLong('2026-09-09')).toBe('Wed 9 Sep 2026');
    expect(formatMonth('2026-09-09')).toBe('September 2026');
  });
});
