import {
  Field,
  FormActions,
  Select,
  TextInput,
  Textarea,
  useSchemaForm,
} from '../../components/form';
import type { FormProps } from '../types';
import { JOB_STATUS_LABELS, JOB_STATUSES, jobSearchSchema, type JobSearchData } from './schema';

type Values = {
  company: string;
  role: string;
  status: string;
  link: string;
  nextActionDate: string;
  notes: string;
};

function toValues(initial?: JobSearchData): Values {
  return {
    company: initial?.company ?? '',
    role: initial?.role ?? '',
    status: initial?.status ?? 'applied',
    link: initial?.link ?? '',
    nextActionDate: initial?.nextActionDate ?? '',
    notes: initial?.notes ?? '',
  };
}

export function JobSearchForm({ initial, onSubmit, onCancel }: FormProps<JobSearchData>) {
  const form = useSchemaForm<JobSearchData, Values>(jobSearchSchema, toValues(initial));

  return (
    <form onSubmit={form.submit(onSubmit)} noValidate className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Company" error={form.errors.company}>
          {(ids) => (
            <TextInput
              {...ids}
              autoFocus
              value={form.values.company}
              onChange={(e) => form.setValue('company', e.target.value)}
            />
          )}
        </Field>
        <Field label="Role" error={form.errors.role}>
          {(ids) => (
            <TextInput
              {...ids}
              value={form.values.role}
              onChange={(e) => form.setValue('role', e.target.value)}
            />
          )}
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Status" error={form.errors.status}>
          {(ids) => (
            <Select
              {...ids}
              value={form.values.status}
              onChange={(e) => form.setValue('status', e.target.value)}
            >
              {JOB_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {JOB_STATUS_LABELS[status]}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field
          label="Next action date"
          error={form.errors.nextActionDate}
          hint="Follow-up or interview date"
        >
          {(ids) => (
            <TextInput
              {...ids}
              type="date"
              value={form.values.nextActionDate}
              onChange={(e) => form.setValue('nextActionDate', e.target.value)}
            />
          )}
        </Field>
      </div>
      <Field label="Link" error={form.errors.link}>
        {(ids) => (
          <TextInput
            {...ids}
            type="url"
            placeholder="https://"
            value={form.values.link}
            onChange={(e) => form.setValue('link', e.target.value)}
          />
        )}
      </Field>
      <Field label="Notes" error={form.errors.notes}>
        {(ids) => (
          <Textarea
            {...ids}
            value={form.values.notes}
            onChange={(e) => form.setValue('notes', e.target.value)}
          />
        )}
      </Field>
      <FormActions onCancel={onCancel} />
    </form>
  );
}
