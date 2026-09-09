import type { CategoryKey } from '../../categories/keys';
import type { DateKey, Entry } from '../../db/types';

export interface SearchFilters {
  /** Case-insensitive text to look for. */
  query: string;
  /** Empty means every category. */
  categories: readonly CategoryKey[];
  from?: DateKey;
  to?: DateKey;
}

export const EMPTY_FILTERS: SearchFilters = { query: '', categories: [] };

/** Every string reachable in a payload, for text matching. */
function textOf(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(textOf);
  if (value && typeof value === 'object') return Object.values(value).flatMap(textOf);
  return [];
}

/**
 * Filter and sort entries, newest first. `describe` supplies the display
 * label so that derived text (habit names, status labels) is searchable too.
 */
export function filterEntries(
  entries: readonly Entry[],
  filters: SearchFilters,
  describe: (entry: Entry) => string,
): Entry[] {
  const query = filters.query.trim().toLowerCase();
  const categories = new Set(filters.categories);
  return entries
    .filter((entry) => {
      if (categories.size > 0 && !categories.has(entry.category)) return false;
      if (filters.from && entry.date < filters.from) return false;
      if (filters.to && entry.date > filters.to) return false;
      if (!query) return true;
      const haystack = [describe(entry), ...textOf(entry.data)].join('\n').toLowerCase();
      return haystack.includes(query);
    })
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
}

export function isEmptyFilters(filters: SearchFilters): boolean {
  return !filters.query.trim() && filters.categories.length === 0 && !filters.from && !filters.to;
}
