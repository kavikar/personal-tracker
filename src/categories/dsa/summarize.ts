import type { Entry } from '../../db/types';
import type { SummaryContext, SummaryStat } from '../types';
import type { DsaData } from './schema';

export function summarizeDsa(entries: Entry<DsaData>[], _ctx: SummaryContext): SummaryStat[] {
  const solved = entries.filter((entry) => entry.data.solved).length;
  const minutes = entries.reduce((total, entry) => total + entry.data.minutesSpent, 0);
  const hard = entries.filter(
    (entry) => entry.data.solved && entry.data.difficulty === 'hard',
  ).length;

  const topicCounts = new Map<string, number>();
  for (const entry of entries) {
    for (const topic of entry.data.topics) {
      topicCounts.set(topic, (topicCounts.get(topic) ?? 0) + 1);
    }
  }
  const topTopic = [...topicCounts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0];

  return [
    {
      label: 'Problems solved',
      value: solved,
      hint: entries.length > solved ? `${entries.length - solved} attempted` : undefined,
    },
    { label: 'Hard solved', value: hard },
    {
      label: 'Time studied',
      value: minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`,
    },
    {
      label: 'Top topic',
      value: topTopic ? topTopic[0] : '–',
      hint: topTopic && `${topTopic[1]} problems`,
    },
  ];
}
