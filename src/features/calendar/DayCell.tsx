import { CategoryDot } from '../../components/CategoryDot';
import { getCategory } from '../../categories/registry';
import type { DateKey } from '../../db/types';
import { formatLong } from '../../lib/dates';
import type { DaySummary } from './entriesByDay';

interface DayCellProps {
  date: DateKey;
  summary?: DaySummary;
  isToday: boolean;
  isSelected: boolean;
  isOutsideMonth?: boolean;
  onSelect: (date: DateKey) => void;
}

export function DayCell({
  date,
  summary,
  isToday,
  isSelected,
  isOutsideMonth = false,
  onSelect,
}: DayCellProps) {
  const dayNumber = Number(date.slice(8, 10));
  const counts = summary ? [...summary.byCategory] : [];
  const label = summary
    ? `${formatLong(date)}, ${summary.total} ${summary.total === 1 ? 'entry' : 'entries'}`
    : formatLong(date);

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isSelected}
      onClick={() => onSelect(date)}
      className={`flex min-h-20 flex-col items-start gap-1 rounded-md border p-1.5 text-left transition-colors focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none ${
        isSelected
          ? 'border-slate-900 bg-white'
          : 'border-slate-200 bg-white hover:border-slate-400'
      } ${isOutsideMonth ? 'opacity-40' : ''}`}
    >
      <span
        className={`flex size-6 items-center justify-center rounded-full text-sm ${
          isToday ? 'bg-slate-900 font-semibold text-white' : 'text-slate-700'
        }`}
      >
        {dayNumber}
      </span>
      {counts.length > 0 && (
        <ul className="flex flex-wrap gap-x-1.5 gap-y-0.5">
          {counts.map(([category, count]) => (
            <li
              key={category}
              className="flex items-center gap-1 text-xs text-slate-600"
              title={getCategory(category)?.label ?? category}
            >
              <CategoryDot category={category} />
              {count}
            </li>
          ))}
        </ul>
      )}
    </button>
  );
}
