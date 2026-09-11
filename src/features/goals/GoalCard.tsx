import { useState } from 'react';
import { getCategory } from '../../categories/registry';
import type { CategoryKey } from '../../categories/keys';
import { Button } from '../../components/Button';
import type { GoalProgress } from './goalProgress';
import { GOAL_PERIOD_LABELS } from './schema';

const METER_COLORS: Record<CategoryKey, { fill: string; track: string }> = {
  jobSearch: { fill: 'bg-sky-500', track: 'bg-sky-100 dark:bg-sky-950/50' },
  dsa: { fill: 'bg-violet-500', track: 'bg-violet-100 dark:bg-violet-950/50' },
  admin: { fill: 'bg-amber-500', track: 'bg-amber-100 dark:bg-amber-950/50' },
  habit: { fill: 'bg-emerald-500', track: 'bg-emerald-100 dark:bg-emerald-950/50' },
};

interface GoalCardProps {
  progress: GoalProgress;
  onEdit: () => void;
  onDelete: () => void;
}

function formatAmount(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function GoalCard({ progress, onEdit, onDelete }: GoalCardProps) {
  const { goal, habit, current, percent, done } = progress;
  const def = getCategory(goal.category);
  const colors = METER_COLORS[goal.category];
  const unit = habit?.kind === 'numeric' ? habit.unit : undefined;
  const [confirming, setConfirming] = useState(false);

  return (
    <section
      aria-labelledby={`goal-${goal.id}`}
      className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2
            id={`goal-${goal.id}`}
            className="text-sm font-semibold text-slate-800 dark:text-slate-200"
          >
            {goal.label}
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {def?.label ?? goal.category}
            {habit ? ` · ${habit.name}` : ''} · this {GOAL_PERIOD_LABELS[goal.period]}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {confirming ? (
            <>
              <Button
                variant="danger"
                size="sm"
                onClick={onDelete}
                aria-label={`Confirm delete ${goal.label}`}
              >
                Delete
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={onEdit} aria-label={`Edit ${goal.label}`}>
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setConfirming(true)}
                aria-label={`Delete ${goal.label}`}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="mt-3">
        <div
          role="progressbar"
          aria-valuenow={Math.round(Math.min(percent, 100))}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${goal.label} progress`}
          className={`h-2 w-full overflow-hidden rounded-full ${colors.track}`}
        >
          <div
            className={`h-full rounded-full ${colors.fill} transition-[width]`}
            style={{ width: `${Math.min(Math.max(percent, 0), 100)}%` }}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-400">
            {formatAmount(current)}
            {unit ? ` ${unit}` : ''} of {formatAmount(goal.target)}
            {unit ? ` ${unit}` : ''}
          </span>
          {done ? (
            <span className="flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-400">
              <span aria-hidden="true">✓</span> Goal met
            </span>
          ) : (
            <span className="text-slate-500 dark:text-slate-400">{Math.round(percent)}%</span>
          )}
        </div>
      </div>
    </section>
  );
}
