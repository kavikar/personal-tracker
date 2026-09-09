import { CategoryDot } from '../../components/CategoryDot';
import { describeEntry } from '../../categories/describe';
import type { CategoryContext } from '../../categories/types';
import type { DateKey, Entry } from '../../db/types';
import { formatDateKey, formatLong, todayKey, weekDays } from '../../lib/dates';

interface WeekViewProps {
  focus: DateKey;
  entries: readonly Entry[];
  selected: DateKey | null;
  onSelect: (date: DateKey) => void;
  context: CategoryContext;
  today?: DateKey;
}

export function WeekView({
  focus,
  entries,
  selected,
  onSelect,
  context,
  today = todayKey(),
}: WeekViewProps) {
  const days = weekDays(focus);
  const byDay = new Map<DateKey, Entry[]>();
  for (const entry of entries) {
    const list = byDay.get(entry.date) ?? [];
    list.push(entry);
    byDay.set(entry.date, list);
  }

  return (
    <div role="grid" aria-label="Week" className="grid grid-cols-1 gap-2 md:grid-cols-7">
      {days.map((date) => {
        const dayEntries = byDay.get(date) ?? [];
        const isSelected = date === selected;
        const isToday = date === today;
        return (
          <div
            key={date}
            role="gridcell"
            className={`flex min-h-32 flex-col rounded-md border bg-white ${
              isSelected ? 'border-slate-900' : 'border-slate-200'
            }`}
          >
            <button
              type="button"
              aria-pressed={isSelected}
              aria-label={`${formatLong(date)}, ${dayEntries.length} ${dayEntries.length === 1 ? 'entry' : 'entries'}`}
              onClick={() => onSelect(date)}
              className="flex items-center justify-between gap-2 rounded-t-md border-b border-slate-100 px-2 py-1.5 text-left hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
            >
              <span className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                {formatDateKey(date, 'EEE')}
              </span>
              <span
                className={`flex size-6 items-center justify-center rounded-full text-sm ${
                  isToday ? 'bg-slate-900 font-semibold text-white' : 'text-slate-700'
                }`}
              >
                {Number(date.slice(8, 10))}
              </span>
            </button>
            <ul className="flex flex-1 flex-col gap-1 p-1.5">
              {dayEntries.map((entry) => (
                <li key={entry.id} className="flex items-start gap-1.5 text-xs text-slate-700">
                  <CategoryDot category={entry.category} className="mt-1" />
                  <span className="line-clamp-2">{describeEntry(entry, context)}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
