import { useCategoryContext } from '../../categories/useCategoryContext';
import { useEntriesInRange } from '../../db/hooks';
import { addMonths, addWeeks, monthGrid, todayKey, weekRange } from '../../lib/dates';
import { CalendarHeader } from './CalendarHeader';
import { MonthView } from './MonthView';
import { useCalendarState } from './useCalendarState';
import { WeekView } from './WeekView';

export function CalendarPage() {
  const calendar = useCalendarState();
  const context = useCategoryContext();

  const range =
    calendar.view === 'month'
      ? (() => {
          const grid = monthGrid(calendar.focus);
          return { from: grid[0][0], to: grid[grid.length - 1][6] };
        })()
      : weekRange(calendar.focus);
  const entries = useEntriesInRange(range) ?? [];

  const step = (direction: 1 | -1) =>
    calendar.setFocus(
      calendar.view === 'month'
        ? addMonths(calendar.focus, direction)
        : addWeeks(calendar.focus, direction),
    );

  return (
    <section aria-label="Calendar" className="space-y-4">
      <CalendarHeader
        view={calendar.view}
        focus={calendar.focus}
        onViewChange={calendar.setView}
        onPrevious={() => step(-1)}
        onNext={() => step(1)}
        onToday={() => calendar.setFocus(todayKey())}
      />
      {calendar.view === 'month' ? (
        <MonthView
          focus={calendar.focus}
          entries={entries}
          selected={calendar.selected}
          onSelect={calendar.select}
        />
      ) : (
        <WeekView
          focus={calendar.focus}
          entries={entries}
          selected={calendar.selected}
          onSelect={calendar.select}
          context={context}
        />
      )}
    </section>
  );
}
