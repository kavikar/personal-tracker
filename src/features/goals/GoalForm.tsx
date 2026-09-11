import { categories } from '../../categories/registry';
import type { CategoryKey } from '../../categories/keys';
import { Field, FormActions, Select, TextInput, useSchemaForm } from '../../components/form';
import { useHabits } from '../../db/hooks';
import type { Goal } from '../../db/types';
import { GOAL_PERIODS, GOAL_PERIOD_LABELS, goalSchema, type GoalFormData } from './schema';

interface GoalFormProps {
  initial?: Goal;
  onSubmit: (data: GoalFormData) => void | Promise<void>;
  onCancel: () => void;
}

type Values = {
  label: string;
  category: CategoryKey;
  habitId: string;
  target: string;
  period: string;
};

function toValues(initial?: Goal): Values {
  return {
    label: initial?.label ?? '',
    category: initial?.category ?? 'jobSearch',
    habitId: initial?.habitId ?? '',
    target: initial ? String(initial.target) : '',
    period: initial?.period ?? 'month',
  };
}

export function GoalForm({ initial, onSubmit, onCancel }: GoalFormProps) {
  const form = useSchemaForm<GoalFormData, Values>(goalSchema, toValues(initial));
  const habits = useHabits() ?? [];

  return (
    <form onSubmit={form.submit(onSubmit)} noValidate className="space-y-3">
      <Field label="Goal" error={form.errors.label} hint="e.g. Read 10 pages, Solve 50 problems">
        {(ids) => (
          <TextInput
            {...ids}
            autoFocus
            placeholder="Read 10 pages"
            value={form.values.label}
            onChange={(e) => form.setValue('label', e.target.value)}
          />
        )}
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Category" error={form.errors.category}>
          {(ids) => (
            <Select
              {...ids}
              value={form.values.category}
              onChange={(e) => form.setValue('category', e.target.value as CategoryKey)}
            >
              {categories.map((definition) => (
                <option key={definition.key} value={definition.key}>
                  {definition.label}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label="Period" error={form.errors.period}>
          {(ids) => (
            <Select
              {...ids}
              value={form.values.period}
              onChange={(e) => form.setValue('period', e.target.value)}
            >
              {GOAL_PERIODS.map((period) => (
                <option key={period} value={period}>
                  Per {GOAL_PERIOD_LABELS[period]}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </div>
      {form.values.category === 'habit' && (
        <Field label="Habit" error={form.errors.habitId}>
          {(ids) => (
            <Select
              {...ids}
              value={form.values.habitId}
              onChange={(e) => form.setValue('habitId', e.target.value)}
            >
              <option value="">{habits.length === 0 ? 'No habits yet' : 'Pick a habit'}</option>
              {habits.map((habit) => (
                <option key={habit.id} value={habit.id}>
                  {habit.name}
                </option>
              ))}
            </Select>
          )}
        </Field>
      )}
      <Field
        label="Target"
        error={form.errors.target}
        hint={
          form.values.category === 'habit'
            ? 'Days met (yes/no habits) or total amount (numeric habits)'
            : 'Number of entries in the period'
        }
      >
        {(ids) => (
          <TextInput
            {...ids}
            type="number"
            inputMode="decimal"
            min={0}
            value={form.values.target}
            onChange={(e) => form.setValue('target', e.target.value)}
          />
        )}
      </Field>
      <FormActions onCancel={onCancel} />
    </form>
  );
}
