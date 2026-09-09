/**
 * Stable identifiers for every category the tracker knows about.
 *
 * The key is stored on each entry row, so it must never be renamed once data
 * exists. Adding a category means adding a key here and a folder under
 * `src/categories/` that implements the `CategoryDefinition` contract. No
 * database migration is needed because entry payloads are opaque to Dexie.
 */
export const CATEGORY_KEYS = ['jobSearch', 'dsa', 'admin', 'habit'] as const;

export type CategoryKey = (typeof CATEGORY_KEYS)[number];

export function isCategoryKey(value: unknown): value is CategoryKey {
  return typeof value === 'string' && (CATEGORY_KEYS as readonly string[]).includes(value);
}
