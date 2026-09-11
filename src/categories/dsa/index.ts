import type { CategoryDefinition } from '../types';
import { DsaForm } from './Form';
import { DIFFICULTY_LABELS, dsaSchema, type DsaData } from './schema';
import { summarizeDsa } from './summarize';

export const dsaCategory: CategoryDefinition<DsaData> = {
  key: 'dsa',
  label: 'DSA',
  description: 'Problems solved, topics, and time spent.',
  color: {
    dot: 'bg-violet-500',
    badge: 'bg-violet-100 text-violet-800 dark:bg-violet-950/60 dark:text-violet-300',
    accent: 'border-violet-500',
  },
  schema: dsaSchema,
  describe: (data) =>
    `${data.solved ? '✓ ' : ''}${data.title} · ${DIFFICULTY_LABELS[data.difficulty]}, ${data.minutesSpent}m`,
  summarize: summarizeDsa,
  Form: DsaForm,
};

export type { DsaData } from './schema';
