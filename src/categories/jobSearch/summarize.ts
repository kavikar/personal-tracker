import type { Entry } from '../../db/types';
import type { SummaryContext, SummaryStat } from '../types';
import { ACTIVE_STATUSES, type JobSearchData } from './schema';

export function summarizeJobSearch(
  entries: Entry<JobSearchData>[],
  { range, today }: SummaryContext,
): SummaryStat[] {
  const count = (predicate: (data: JobSearchData) => boolean) =>
    entries.filter((entry) => predicate(entry.data)).length;

  const followUpsDue = entries.filter(
    (entry) =>
      entry.data.nextActionDate !== undefined &&
      entry.data.nextActionDate >= range.from &&
      entry.data.nextActionDate <= range.to &&
      ACTIVE_STATUSES.includes(entry.data.status),
  );
  const overdue = followUpsDue.filter((entry) => entry.data.nextActionDate! < today).length;

  return [
    { label: 'Applications sent', value: count((d) => d.status === 'applied') },
    { label: 'Interviews', value: count((d) => d.status === 'interview') },
    { label: 'Offers', value: count((d) => d.status === 'offer') },
    { label: 'Screened (passed framework)', value: count((d) => d.passesEvalFramework === true) },
    {
      label: 'Follow-ups due',
      value: followUpsDue.length,
      hint: overdue > 0 ? `${overdue} overdue` : undefined,
    },
  ];
}
