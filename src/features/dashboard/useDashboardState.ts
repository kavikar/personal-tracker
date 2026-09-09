import { useSearchParams } from 'react-router-dom';
import type { DateKey, DateRange } from '../../db/types';
import {
  addMonths,
  addWeeks,
  isValidDateKey,
  monthRange,
  todayKey,
  weekRange,
} from '../../lib/dates';

export type Period = 'week' | 'month';

export interface DashboardState {
  period: Period;
  focus: DateKey;
  range: DateRange;
  setPeriod: (period: Period) => void;
  step: (direction: 1 | -1) => void;
  goToday: () => void;
}

export function useDashboardState(): DashboardState {
  const [params, setParams] = useSearchParams();
  const period: Period = params.get('period') === 'month' ? 'month' : 'week';
  const raw = params.get('date');
  const focus = raw && isValidDateKey(raw) ? raw : todayKey();
  const range = period === 'week' ? weekRange(focus) : monthRange(focus);

  const update = (changes: Record<string, string | null>) =>
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        for (const [key, value] of Object.entries(changes)) {
          if (value === null) next.delete(key);
          else next.set(key, value);
        }
        return next;
      },
      { replace: true },
    );

  return {
    period,
    focus,
    range,
    setPeriod: (next) => update({ period: next === 'week' ? null : next }),
    step: (direction) =>
      update({
        date: period === 'week' ? addWeeks(focus, direction) : addMonths(focus, direction),
      }),
    goToday: () => update({ date: null }),
  };
}
