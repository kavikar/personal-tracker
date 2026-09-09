import { useEntriesInRange } from '../../db/hooks';
import { addMonths, monthGrid, todayKey } from '../../lib/dates';
import { CalendarHeader } from './CalendarHeader';
import { MonthView } from './MonthView';
import { useCalendarState } from './useCalendarState';

export function CalendarPage() {
  const calendar = useCalendarState();
  const grid = monthGrid(calendar.focus);
  const range = { from: grid[0][0], to: grid[grid.length - 1][6] };
  const entries = useEntriesInRange(range) ?? [];

  return (
    <section aria-label="Calendar" className="space-y-4">
      <CalendarHeader
        focus={calendar.focus}
        onPrevious={() => calendar.setFocus(addMonths(calendar.focus, -1))}
        onNext={() => calendar.setFocus(addMonths(calendar.focus, 1))}
        onToday={() => calendar.setFocus(todayKey())}
      />
      <MonthView
        focus={calendar.focus}
        entries={entries}
        selected={calendar.selected}
        onSelect={calendar.select}
      />
    </section>
  );
}
