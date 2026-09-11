import {
  Checkbox,
  Field,
  FormActions,
  Select,
  TextInput,
  useSchemaForm,
} from '../../components/form';
import type { FormProps } from '../types';
import { DIFFICULTIES, DIFFICULTY_LABELS, dsaSchema, type DsaData } from './schema';

type Values = {
  title: string;
  link: string;
  topics: string;
  difficulty: string;
  minutesSpent: string;
  solved: boolean;
};

function toValues(initial?: DsaData): Values {
  return {
    title: initial?.title ?? '',
    link: initial?.link ?? '',
    topics: initial?.topics.join(', ') ?? '',
    difficulty: initial?.difficulty ?? 'medium',
    minutesSpent: initial ? String(initial.minutesSpent) : '30',
    solved: initial?.solved ?? true,
  };
}

export function DsaForm({ initial, onSubmit, onCancel }: FormProps<DsaData>) {
  const form = useSchemaForm<DsaData, Values>(dsaSchema, toValues(initial));

  return (
    <form onSubmit={form.submit(onSubmit)} noValidate className="space-y-3">
      <Field label="Problem" error={form.errors.title}>
        {(ids) => (
          <TextInput
            {...ids}
            autoFocus
            placeholder="Two Sum"
            value={form.values.title}
            onChange={(e) => form.setValue('title', e.target.value)}
          />
        )}
      </Field>
      <Field label="Link" error={form.errors.link}>
        {(ids) => (
          <TextInput
            {...ids}
            type="url"
            placeholder="https://leetcode.com/problems/two-sum"
            value={form.values.link}
            onChange={(e) => form.setValue('link', e.target.value)}
          />
        )}
      </Field>
      <Field
        label="Topics"
        error={form.errors.topics}
        hint="Comma separated, e.g. arrays, hash map"
      >
        {(ids) => (
          <TextInput
            {...ids}
            value={form.values.topics}
            onChange={(e) => form.setValue('topics', e.target.value)}
          />
        )}
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Difficulty" error={form.errors.difficulty}>
          {(ids) => (
            <Select
              {...ids}
              value={form.values.difficulty}
              onChange={(e) => form.setValue('difficulty', e.target.value)}
            >
              {DIFFICULTIES.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {DIFFICULTY_LABELS[difficulty]}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label="Minutes spent" error={form.errors.minutesSpent}>
          {(ids) => (
            <TextInput
              {...ids}
              type="number"
              inputMode="numeric"
              min={0}
              value={form.values.minutesSpent}
              onChange={(e) => form.setValue('minutesSpent', e.target.value)}
            />
          )}
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
        <Checkbox
          checked={form.values.solved}
          onChange={(e) => form.setValue('solved', e.target.checked)}
        />
        Solved without looking at the solution
      </label>
      <FormActions onCancel={onCancel} />
    </form>
  );
}
