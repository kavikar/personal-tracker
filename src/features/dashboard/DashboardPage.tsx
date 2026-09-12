import { categories } from '../../categories/registry';
import { useCategoryContext } from '../../categories/useCategoryContext';
import { Button } from '../../components/Button';
import { SegmentedControl } from '../../components/SegmentedControl';
import { useAllEntries, useEntriesInRange } from '../../db/hooks';
import { formatDateKey, formatMonth, todayKey } from '../../lib/dates';
import { DueSoonCard } from './DueSoonCard';
import { habitStreakRows } from './habitStreaks';
import { HabitStreaksCard } from './HabitStreaksCard';
import { SummaryCard } from './SummaryCard';
import { collectDueItems } from './upcoming';
import { useDashboardState } from './useDashboardState';

const PERIOD_OPTIONS = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
] as const;

export function DashboardPage() {
  const state = useDashboardState();
  const context = useCategoryContext();
  const inRange = useEntriesInRange(state.range) ?? [];
  const all = useAllEntries() ?? [];
  const today = todayKey();

  const summaryContext = { ...context, range: state.range };
  const title =
    state.period === 'month'
      ? formatMonth(state.focus)
      : `${formatDateKey(state.range.from, 'd MMM')} – ${formatDateKey(state.range.to, 'd MMM yyyy')}`;

  const streaks = habitStreakRows(
    context.habits,
    all.filter((entry) => entry.category === 'habit' && entry.date <= today),
    today,
  );
  const due = collectDueItems(all, categories, today);

  return (
    <section aria-label="Dashboard" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <div className="flex items-center gap-2">
          <SegmentedControl
            label="Period"
            value={state.period}
            options={PERIOD_OPTIONS}
            onChange={state.setPeriod}
          />
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              onClick={() => state.step(-1)}
              aria-label={`Previous ${state.period}`}
            >
              <span aria-hidden="true">←</span>
            </Button>
            <Button variant="secondary" onClick={state.goToday} disabled={state.focus === today}>
              Today
            </Button>
            <Button
              variant="ghost"
              onClick={() => state.step(1)}
              aria-label={`Next ${state.period}`}
            >
              <span aria-hidden="true">→</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {categories.map((definition) => (
          <SummaryCard
            key={definition.key}
            definition={definition}
            range={state.range}
            stats={definition.summarize(
              inRange.filter((entry) => entry.category === definition.key),
              summaryContext,
            )}
          />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <HabitStreaksCard rows={streaks} />
        <DueSoonCard items={due} context={context} />
      </div>
    </section>
  );
}
