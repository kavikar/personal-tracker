import { describe, expect, it } from 'vitest';
import { computeStreaks } from './streaks';

describe('computeStreaks', () => {
  it('is zero with no days', () => {
    expect(computeStreaks([], '2026-09-09')).toEqual({ current: 0, longest: 0 });
  });

  it('counts a run ending today', () => {
    expect(computeStreaks(['2026-09-07', '2026-09-08', '2026-09-09'], '2026-09-09')).toEqual({
      current: 3,
      longest: 3,
    });
  });

  it('keeps the streak alive when today is not logged yet', () => {
    expect(computeStreaks(['2026-09-07', '2026-09-08'], '2026-09-09')).toEqual({
      current: 2,
      longest: 2,
    });
  });

  it('breaks the current streak after a missed day but remembers the longest', () => {
    expect(
      computeStreaks(
        ['2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04', '2026-09-08', '2026-09-09'],
        '2026-09-09',
      ),
    ).toEqual({ current: 2, longest: 4 });
  });

  it('is zero when the last met day was before yesterday', () => {
    expect(computeStreaks(['2026-09-01', '2026-09-02'], '2026-09-09')).toEqual({
      current: 0,
      longest: 2,
    });
  });

  it('ignores duplicates and future days, and crosses month boundaries', () => {
    expect(
      computeStreaks(
        ['2026-08-31', '2026-08-31', '2026-09-01', '2026-09-02', '2026-09-03'],
        '2026-09-02',
      ),
    ).toEqual({ current: 3, longest: 3 });
  });
});
