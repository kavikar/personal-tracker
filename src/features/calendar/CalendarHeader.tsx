import { Button } from '../../components/Button';
import type { DateKey } from '../../db/types';
import { formatMonth, todayKey } from '../../lib/dates';

interface CalendarHeaderProps {
  focus: DateKey;
  title?: string;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function CalendarHeader({ focus, title, onPrevious, onNext, onToday }: CalendarHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-semibold">{title ?? formatMonth(focus)}</h1>
      <div className="flex items-center gap-1">
        <Button variant="ghost" onClick={onPrevious} aria-label="Previous">
          <span aria-hidden="true">←</span>
        </Button>
        <Button variant="secondary" onClick={onToday} disabled={focus === todayKey()}>
          Today
        </Button>
        <Button variant="ghost" onClick={onNext} aria-label="Next">
          <span aria-hidden="true">→</span>
        </Button>
      </div>
    </div>
  );
}
