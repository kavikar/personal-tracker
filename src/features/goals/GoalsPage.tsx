import { useState } from 'react';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { useAllEntries, useGoals, useHabits } from '../../db/hooks';
import { repository } from '../../db/repository';
import type { Goal } from '../../db/types';
import { todayKey } from '../../lib/dates';
import { GoalCard } from './GoalCard';
import { GoalForm } from './GoalForm';
import { computeGoalProgress } from './goalProgress';
import type { GoalFormData } from './schema';

export function GoalsPage() {
  const goals = useGoals();
  const entries = useAllEntries() ?? [];
  const habits = useHabits() ?? [];
  const [editing, setEditing] = useState<Goal | 'new' | null>(null);
  const today = todayKey();

  const save = async (data: GoalFormData) => {
    if (editing && editing !== 'new') await repository.updateGoal(editing.id, data);
    else await repository.addGoal(data);
    setEditing(null);
  };

  return (
    <section aria-label="Goals" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Goals</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Targets you set for yourself, tracked against the current week, month, or year.
          </p>
        </div>
        <Button variant="primary" onClick={() => setEditing('new')}>
          Add goal
        </Button>
      </div>

      {goals === undefined ? null : goals.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          <p className="font-medium text-slate-800 dark:text-slate-200">No goals yet.</p>
          <p className="mt-1">
            Add one for anything you track: "Read 10 pages" (weekly), "50 problems" (yearly), "10
            applications" (monthly).
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              progress={computeGoalProgress(goal, entries, habits, today)}
              onEdit={() => setEditing(goal)}
              onDelete={() => repository.deleteGoal(goal.id)}
            />
          ))}
        </div>
      )}

      {editing && (
        <Modal
          title={editing === 'new' ? 'Add goal' : `Edit ${editing.label}`}
          onClose={() => setEditing(null)}
        >
          <GoalForm
            initial={editing === 'new' ? undefined : editing}
            onSubmit={save}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
    </section>
  );
}
