import { useCategoryContext } from '../../categories/useCategoryContext';
import { useAllEntries, useEntriesByDate, useEntriesInRange } from '../../db/hooks';
import { addMonths, addWeeks, monthGrid, todayKey, weekRange } from '../../lib/dates';
import { CalendarHeader } from './CalendarHeader';
import { DayPanel } from './DayPanel';
import { EmptyState } from './EmptyState';
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
  const selectedEntries = useEntriesByDate(calendar.selected ?? '') ?? [];
  const all = useAllEntries();
  const isEmpty = all !== undefined && all.length === 0 && context.habits.length === 0;

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
      {isEmpty && !calendar.selected && <EmptyState />}
      <div
        className={`grid gap-4 ${calendar.selected ? 'lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]' : ''}`}
      >
        <div>
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
        </div>
        {calendar.selected && (
          <DayPanel
            date={calendar.selected}
            entries={selectedEntries}
            context={context}
            onClose={() => calendar.select(null)}
          />
        )}
      </div>
    </section>
  );
}
