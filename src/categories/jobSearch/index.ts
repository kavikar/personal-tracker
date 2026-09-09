import type { CategoryDefinition } from '../types';
import { JobSearchForm } from './Form';
import { ACTIVE_STATUSES, JOB_STATUS_LABELS, jobSearchSchema, type JobSearchData } from './schema';
import { summarizeJobSearch } from './summarize';

export const jobSearchCategory: CategoryDefinition<JobSearchData> = {
  key: 'jobSearch',
  label: 'Job Search',
  description: 'Applications, interviews, and follow-ups.',
  color: {
    dot: 'bg-sky-500',
    badge: 'bg-sky-100 text-sky-800',
    accent: 'border-sky-500',
  },
  schema: jobSearchSchema,
  describe: (data) => `${data.company} · ${data.role} (${JOB_STATUS_LABELS[data.status]})`,
  summarize: summarizeJobSearch,
  Form: JobSearchForm,
  dueDate: (data) => data.nextActionDate,
  isDone: (data) => !ACTIVE_STATUSES.includes(data.status),
};

export type { JobSearchData } from './schema';
