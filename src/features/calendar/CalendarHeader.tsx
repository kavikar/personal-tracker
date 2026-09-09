import { Button } from '../../components/Button';
import { SegmentedControl } from '../../components/SegmentedControl';
import type { DateKey } from '../../db/types';
import { isSameMonth, todayKey, weekRange } from '../../lib/dates';
import { headerTitle } from './headerTitle';
import type { CalendarView } from './useCalendarState';

interface CalendarHeaderProps {
  view: CalendarView;
  focus: DateKey;
  onViewChange: (view: CalendarView) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

const VIEW_OPTIONS = [
  { value: 'month', label: 'Month' },
  { value: 'week', label: 'Week' },
] as const;

export function CalendarHeader({
  view,
  focus,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
}: CalendarHeaderProps) {
  const today = todayKey();
  const showingToday =
    view === 'month' ? isSameMonth(focus, today) : weekRange(focus).from === weekRange(today).from;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-semibold">{headerTitle(view, focus)}</h1>
      <div className="flex items-center gap-2">
        <SegmentedControl
          label="Calendar view"
          value={view}
          options={VIEW_OPTIONS}
          onChange={onViewChange}
        />
        <div className="flex items-center gap-1">
          <Button variant="ghost" onClick={onPrevious} aria-label={`Previous ${view}`}>
            <span aria-hidden="true">←</span>
          </Button>
          <Button variant="secondary" onClick={onToday} disabled={showingToday}>
            Today
          </Button>
          <Button variant="ghost" onClick={onNext} aria-label={`Next ${view}`}>
            <span aria-hidden="true">→</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
