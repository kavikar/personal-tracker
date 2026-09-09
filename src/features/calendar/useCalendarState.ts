import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { DateKey } from '../../db/types';
import { isValidDateKey, todayKey } from '../../lib/dates';

export type CalendarView = 'month' | 'week';

export interface CalendarState {
  view: CalendarView;
  /** The day the view is centred on. */
  focus: DateKey;
  /** The day open in the detail panel, if any. */
  selected: DateKey | null;
  setView: (view: CalendarView) => void;
  setFocus: (date: DateKey) => void;
  select: (date: DateKey | null) => void;
}

/**
 * Calendar navigation lives in the URL so views are shareable, the back
 * button works, and a reload lands on the same month.
 */
export function useCalendarState(): CalendarState {
  const [params, setParams] = useSearchParams();

  const view: CalendarView = params.get('view') === 'week' ? 'week' : 'month';
  const focus = useMemo(() => {
    const raw = params.get('date');
    return raw && isValidDateKey(raw) ? raw : todayKey();
  }, [params]);
  const selected = useMemo(() => {
    const raw = params.get('selected');
    return raw && isValidDateKey(raw) ? raw : null;
  }, [params]);

  const update = useCallback(
    (changes: Record<string, string | null>) => {
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
    },
    [setParams],
  );

  return {
    view,
    focus,
    selected,
    setView: (next) => update({ view: next === 'month' ? null : next }),
    setFocus: (date) => update({ date }),
    select: (date) => update({ selected: date, ...(date ? { date } : {}) }),
  };
}
