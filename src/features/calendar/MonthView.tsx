import type { DateKey, Entry } from '../../db/types';
import { isSameMonth, monthGrid, todayKey } from '../../lib/dates';
import { DayCell } from './DayCell';
import { summarizeByDay } from './entriesByDay';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface MonthViewProps {
  focus: DateKey;
  entries: readonly Entry[];
  selected: DateKey | null;
  onSelect: (date: DateKey) => void;
  today?: DateKey;
}

export function MonthView({
  focus,
  entries,
  selected,
  onSelect,
  today = todayKey(),
}: MonthViewProps) {
  const rows = monthGrid(focus);
  const days = summarizeByDay(entries);

  return (
    <div role="grid" aria-label="Month" className="grid grid-cols-7 gap-1">
      {WEEKDAYS.map((day) => (
        <div
          key={day}
          role="columnheader"
          className="px-1 pb-1 text-center text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400"
        >
          {day}
        </div>
      ))}
      {rows.flat().map((date) => (
        <DayCell
          key={date}
          date={date}
          summary={days.get(date)}
          isToday={date === today}
          isSelected={date === selected}
          isOutsideMonth={!isSameMonth(date, focus)}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
