import type { Entry } from '../db/types';
import { getCategory } from './registry';
import type { CategoryContext } from './types';

/** One-line label for an entry, falling back gracefully for unknown categories. */
export function describeEntry(entry: Entry, ctx: CategoryContext): string {
  const def = getCategory(entry.category);
  if (!def) return entry.category;
  try {
    return def.describe(entry.data, ctx);
  } catch {
    return def.label;
  }
}
