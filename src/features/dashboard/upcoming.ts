import type { AnyCategoryDefinition } from '../../categories/types';
import type { DateKey, Entry } from '../../db/types';
import { addDays } from '../../lib/dates';

export interface DueItem {
  entry: Entry;
  dueDate: DateKey;
  overdue: boolean;
}

/**
 * Entries that need attention: not done, with a due date on or before
 * `today + horizonDays`. Overdue items come first, then soonest due.
 */
export function collectDueItems(
  entries: readonly Entry[],
  definitions: readonly AnyCategoryDefinition[],
  today: DateKey,
  horizonDays = 7,
): DueItem[] {
  const horizon = addDays(today, horizonDays);
  const byKey = new Map(definitions.map((def) => [def.key, def]));
  const items: DueItem[] = [];
  for (const entry of entries) {
    const def = byKey.get(entry.category);
    if (!def?.dueDate) continue;
    const dueDate = def.dueDate(entry.data);
    if (!dueDate || dueDate > horizon) continue;
    if (def.isDone?.(entry.data)) continue;
    items.push({ entry, dueDate, overdue: dueDate < today });
  }
  return items.sort(
    (a, b) =>
      a.dueDate.localeCompare(b.dueDate) || a.entry.createdAt.localeCompare(b.entry.createdAt),
  );
}
