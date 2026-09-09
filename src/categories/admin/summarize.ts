import type { Entry } from '../../db/types';
import type { SummaryContext, SummaryStat } from '../types';
import type { AdminData } from './schema';

export function summarizeAdmin(
  entries: Entry<AdminData>[],
  { today }: SummaryContext,
): SummaryStat[] {
  const completed = entries.filter((entry) => entry.data.completed).length;
  const open = entries.filter((entry) => !entry.data.completed);
  const overdue = open.filter(
    (entry) => entry.data.dueDate !== undefined && entry.data.dueDate < today,
  ).length;
  return [
    { label: 'Tasks completed', value: completed },
    {
      label: 'Open tasks',
      value: open.length,
      hint: overdue > 0 ? `${overdue} overdue` : undefined,
    },
  ];
}
