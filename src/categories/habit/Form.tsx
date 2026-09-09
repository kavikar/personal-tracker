import { useState } from 'react';
import { Button } from '../../components/Button';
import { Checkbox, Field, FormActions, Select, TextInput } from '../../components/form';
import { useHabits } from '../../db/hooks';
import { repository } from '../../db/repository';
import type { FormProps } from '../types';
import { habitEntrySchema, newHabitSchema, type HabitEntryData } from './schema';

type Mode = 'pick' | 'create';

/**
 * Log a value for an existing habit, or define a new habit and log its first
 * value in one step. The habit definition is created before the entry is
 * handed back to the editor.
 */
export function HabitForm({ initial, onSubmit, onCancel }: FormProps<HabitEntryData>) {
  const habits = useHabits() ?? [];
  const [mode, setMode] = useState<Mode>(initial || habits.length > 0 ? 'pick' : 'create');
  const [habitId, setHabitId] = useState(initial?.habitId ?? '');
  const [value, setValue] = useState<string | boolean>(
    initial === undefined
      ? true
      : typeof initial.value === 'number'
        ? String(initial.value)
        : initial.value,
  );
  const [draft, setDraft] = useState({ name: '', kind: 'boolean', unit: '', dailyTarget: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const chosenId = habitId || habits[0]?.id || '';
  const chosen = habits.find((habit) => habit.id === chosenId);
  const kind = mode === 'create' ? draft.kind : (chosen?.kind ?? 'boolean');
  const unit = mode === 'create' ? draft.unit : chosen?.unit;

  const handleSubmit = async (event: { preventDefault(): void }) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    let id = chosenId;

    if (mode === 'create') {
      const parsed = newHabitSchema.safeParse(draft);
      if (!parsed.success) {
        for (const issue of parsed.error.issues)
          nextErrors[String(issue.path[0])] ??= issue.message;
        setErrors(nextErrors);
        return;
      }
      const habit = await repository.addHabit(parsed.data);
      id = habit.id;
    }

    const rawValue =
      kind === 'boolean' ? value === true : value === true ? '1' : value === false ? '0' : value;
    const parsed = habitEntrySchema.safeParse({ habitId: id, value: rawValue });
    if (!parsed.success) {
      for (const issue of parsed.error.issues) nextErrors[String(issue.path[0])] ??= issue.message;
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    await onSubmit(parsed.data);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      {mode === 'pick' ? (
        <Field label="Habit" error={errors.habitId}>
          {(ids) => (
            <div className="flex gap-2">
              <Select
                {...ids}
                value={chosenId}
                onChange={(e) => setHabitId(e.target.value)}
                disabled={Boolean(initial)}
              >
                {habits.length === 0 && <option value="">No habits yet</option>}
                {habits.map((habit) => (
                  <option key={habit.id} value={habit.id}>
                    {habit.name}
                  </option>
                ))}
              </Select>
              {!initial && (
                <Button onClick={() => setMode('create')} className="shrink-0">
                  New habit
                </Button>
              )}
            </div>
          )}
        </Field>
      ) : (
        <fieldset className="space-y-3 rounded-md border border-slate-200 p-3">
          <legend className="px-1 text-sm font-medium text-slate-700">New habit</legend>
          <Field label="Name" error={errors.name}>
            {(ids) => (
              <TextInput
                {...ids}
                autoFocus
                placeholder="Exercise"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            )}
          </Field>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Type" error={errors.kind}>
              {(ids) => (
                <Select
                  {...ids}
                  value={draft.kind}
                  onChange={(e) => setDraft({ ...draft, kind: e.target.value })}
                >
                  <option value="boolean">Yes / no</option>
                  <option value="numeric">Number</option>
                </Select>
              )}
            </Field>
            {draft.kind === 'numeric' && (
              <>
                <Field label="Unit" error={errors.unit}>
                  {(ids) => (
                    <TextInput
                      {...ids}
                      placeholder="pages"
                      value={draft.unit}
                      onChange={(e) => setDraft({ ...draft, unit: e.target.value })}
                    />
                  )}
                </Field>
                <Field label="Daily target" error={errors.dailyTarget}>
                  {(ids) => (
                    <TextInput
                      {...ids}
                      type="number"
                      inputMode="decimal"
                      min={0}
                      value={draft.dailyTarget}
                      onChange={(e) => setDraft({ ...draft, dailyTarget: e.target.value })}
                    />
                  )}
                </Field>
              </>
            )}
          </div>
          {habits.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setMode('pick')}>
              Use an existing habit instead
            </Button>
          )}
        </fieldset>
      )}

      {kind === 'boolean' ? (
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <Checkbox checked={value === true} onChange={(e) => setValue(e.target.checked)} />
          Done
        </label>
      ) : (
        <Field label={unit ? `Amount (${unit})` : 'Amount'} error={errors.value}>
          {(ids) => (
            <TextInput
              {...ids}
              type="number"
              inputMode="decimal"
              min={0}
              value={typeof value === 'string' ? value : value ? '1' : '0'}
              onChange={(e) => setValue(e.target.value)}
            />
          )}
        </Field>
      )}
      <FormActions onCancel={onCancel} />
    </form>
  );
}
