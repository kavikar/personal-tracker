import { Button } from '../../components/Button';
import { repository } from '../../db/repository';
import type { HabitStreakRow } from './habitStreaks';

interface HabitStreaksCardProps {
  rows: HabitStreakRow[];
}

export function HabitStreaksCard({ rows }: HabitStreaksCardProps) {
  const active = rows.filter((row) => !row.habit.archived);
  const archived = rows.filter((row) => row.habit.archived);

  return (
    <section
      aria-labelledby="streaks-heading"
      className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs"
    >
      <h2 id="streaks-heading" className="text-sm font-semibold text-slate-800">
        Habit streaks
      </h2>
      {active.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">
          No habits yet. Open a day on the calendar and add one.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-slate-100">
          {active.map((row) => (
            <li key={row.habit.id} className="flex items-center justify-between gap-3 py-2">
              <div>
                <p className="text-sm font-medium text-slate-800">
                  {row.habit.name}
                  {row.doneToday && (
                    <span className="ml-2 text-xs text-emerald-700">done today</span>
                  )}
                </p>
                <p className="text-xs text-slate-500">longest {row.longest}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-right">
                  <span className="text-xl font-semibold text-slate-900">{row.current}</span>
                  <span className="ml-1 text-xs text-slate-500">day streak</span>
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={`Archive ${row.habit.name}`}
                  onClick={() => repository.updateHabit(row.habit.id, { archived: true })}
                >
                  Archive
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {archived.length > 0 && (
        <details className="mt-3 text-xs text-slate-500">
          <summary className="cursor-pointer">{archived.length} archived</summary>
          <ul className="mt-2 space-y-1">
            {archived.map((row) => (
              <li key={row.habit.id} className="flex items-center justify-between">
                <span>
                  {row.habit.name} · longest {row.longest}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={`Restore ${row.habit.name}`}
                  onClick={() => repository.updateHabit(row.habit.id, { archived: false })}
                >
                  Restore
                </Button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
