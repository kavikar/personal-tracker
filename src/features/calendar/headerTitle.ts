import type { DateKey } from '../../db/types';
import { formatDateKey, formatMonth, isSameMonth, weekRange } from '../../lib/dates';
import type { CalendarView } from './useCalendarState';

export function headerTitle(view: CalendarView, focus: DateKey): string {
  if (view === 'month') return formatMonth(focus);
  const { from, to } = weekRange(focus);
  const start = isSameMonth(from, to) ? formatDateKey(from, 'd') : formatDateKey(from, 'd MMM');
  return `${start} – ${formatDateKey(to, 'd MMM yyyy')}`;
}
