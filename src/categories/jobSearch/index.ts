import type { CategoryDefinition } from '../types';
import { JobSearchForm } from './Form';
import {
  ACTIVE_STATUSES,
  JOB_STATUS_LABELS,
  JOB_TIER_LABELS,
  jobSearchSchema,
  type JobSearchData,
} from './schema';
import { summarizeJobSearch } from './summarize';

export const jobSearchCategory: CategoryDefinition<JobSearchData> = {
  key: 'jobSearch',
  label: 'Job Search',
  description: 'Applications, interviews, and follow-ups.',
  color: {
    dot: 'bg-sky-500',
    badge: 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300',
    accent: 'border-sky-500',
  },
  schema: jobSearchSchema,
  describe: (data) => {
    const base = `${data.company} · ${data.role} (${JOB_STATUS_LABELS[data.status]})`;
    return data.tier ? `${base} · ${JOB_TIER_LABELS[data.tier]}` : base;
  },
  summarize: summarizeJobSearch,
  Form: JobSearchForm,
  dueDate: (data) => data.nextActionDate,
  isDone: (data) => !ACTIVE_STATUSES.includes(data.status),
};

export type { JobSearchData } from './schema';
