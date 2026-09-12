import type { DateKey, Entry } from '../../db/types';

export interface EntryGroup {
  date: DateKey;
  entries: Entry[];
}

/** Group already-sorted entries into contiguous runs sharing a date. */
export function groupEntriesByDate(entries: readonly Entry[]): EntryGroup[] {
  const groups: EntryGroup[] = [];
  for (const entry of entries) {
    const last = groups[groups.length - 1];
    if (last && last.date === entry.date) last.entries.push(entry);
    else groups.push({ date: entry.date, entries: [entry] });
  }
  return groups;
}
