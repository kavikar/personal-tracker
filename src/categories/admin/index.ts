import { formatShort } from '../../lib/dates';
import type { CategoryDefinition } from '../types';
import { AdminForm } from './Form';
import { adminFollowUp } from './followUp';
import { adminSchema, describeRecurrence, type AdminData } from './schema';
import { summarizeAdmin } from './summarize';

export const adminCategory: CategoryDefinition<AdminData> = {
  key: 'admin',
  label: 'Admin',
  description: 'Immigration paperwork and other one-off or recurring tasks.',
  color: {
    dot: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
    accent: 'border-amber-500',
  },
  schema: adminSchema,
  describe: (data) => {
    const parts = [`${data.completed ? '✓' : '☐'} ${data.title}`];
    if (data.dueDate) parts.push(`due ${formatShort(data.dueDate)}`);
    if (data.recurrence) parts.push(describeRecurrence(data.recurrence));
    return parts.join(' · ');
  },
  summarize: summarizeAdmin,
  Form: AdminForm,
  dueDate: (data) => data.dueDate,
  isDone: (data) => data.completed,
  followUp: adminFollowUp,
};

export type { AdminData } from './schema';
