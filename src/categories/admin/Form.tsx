import {
  Checkbox,
  Field,
  FormActions,
  Select,
  TextInput,
  Textarea,
  useSchemaForm,
} from '../../components/form';
import type { FormProps } from '../types';
import { RECURRENCE_UNITS, adminSchema, type AdminData } from './schema';

type Values = {
  title: string;
  dueDate: string;
  completed: boolean;
  recurrence: { every: string; unit: string } | undefined;
  notes: string;
};

function toValues(initial?: AdminData): Values {
  return {
    title: initial?.title ?? '',
    dueDate: initial?.dueDate ?? '',
    completed: initial?.completed ?? false,
    recurrence: initial?.recurrence
      ? { every: String(initial.recurrence.every), unit: initial.recurrence.unit }
      : undefined,
    notes: initial?.notes ?? '',
  };
}

export function AdminForm({ date, initial, onSubmit, onCancel }: FormProps<AdminData>) {
  const form = useSchemaForm<AdminData, Values>(adminSchema, toValues(initial));
  const recurrence = form.values.recurrence;

  return (
    <form onSubmit={form.submit(onSubmit)} noValidate className="space-y-3">
      <Field label="Task" error={form.errors.title}>
        {(ids) => (
          <TextInput
            {...ids}
            autoFocus
            placeholder="Submit WES documents"
            value={form.values.title}
            onChange={(e) => form.setValue('title', e.target.value)}
          />
        )}
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Due date" error={form.errors.dueDate}>
          {(ids) => (
            <TextInput
              {...ids}
              type="date"
              value={form.values.dueDate}
              onChange={(e) => form.setValue('dueDate', e.target.value)}
            />
          )}
        </Field>
        <Field
          label="Repeat"
          error={form.errors.recurrence}
          hint={recurrence ? 'Completing it schedules the next one' : undefined}
        >
          {(ids) => (
            <div className="flex gap-2">
              {recurrence && (
                <TextInput
                  aria-label="Repeat every"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  className="w-20"
                  value={recurrence.every}
                  onChange={(e) =>
                    form.setValue('recurrence', { ...recurrence, every: e.target.value })
                  }
                />
              )}
              <Select
                {...ids}
                value={recurrence?.unit ?? 'none'}
                onChange={(e) =>
                  form.setValue(
                    'recurrence',
                    e.target.value === 'none'
                      ? undefined
                      : { every: recurrence?.every ?? '1', unit: e.target.value },
                  )
                }
              >
                <option value="none">Does not repeat</option>
                {RECURRENCE_UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {recurrence && recurrence.every !== '1' ? `${unit}s` : unit}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </Field>
      </div>
      <Field label="Notes" error={form.errors.notes}>
        {(ids) => (
          <Textarea
            {...ids}
            value={form.values.notes}
            onChange={(e) => form.setValue('notes', e.target.value)}
          />
        )}
      </Field>
      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
        <Checkbox
          checked={form.values.completed}
          onChange={(e) => form.setValue('completed', e.target.checked)}
        />
        Completed{initial ? '' : ` on ${date}`}
      </label>
      <FormActions onCancel={onCancel} />
    </form>
  );
}
