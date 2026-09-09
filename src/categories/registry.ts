import { dsaCategory } from './dsa';
import { jobSearchCategory } from './jobSearch';
import type { CategoryKey } from './keys';
import type { AnyCategoryDefinition, CategoryDefinition } from './types';

/**
 * Every registered category, in display order. Add a new category by
 * implementing `CategoryDefinition` in its own folder and appending it here.
 */
export const categories: readonly AnyCategoryDefinition[] = [jobSearchCategory, dsaCategory];

const byKey = new Map<CategoryKey, AnyCategoryDefinition>(categories.map((c) => [c.key, c]));

export function getCategory(key: CategoryKey): AnyCategoryDefinition | undefined {
  return byKey.get(key);
}

/** Like `getCategory` but throws, for code paths where the key is known to be registered. */
export function requireCategory(key: CategoryKey): AnyCategoryDefinition {
  const def = byKey.get(key);
  if (!def) throw new Error(`Category "${key}" is not registered`);
  return def;
}

/**
 * Validate an entry payload against its category schema. Returns the parsed
 * payload or a list of human-readable problems.
 */
export function parseEntryData<T>(
  def: CategoryDefinition<T>,
  data: unknown,
): { ok: true; data: T } | { ok: false; errors: string[] } {
  const result = def.schema.safeParse(data);
  if (result.success) return { ok: true, data: result.data };
  return {
    ok: false,
    errors: result.error.issues.map((issue) =>
      issue.path.length ? `${issue.path.join('.')}: ${issue.message}` : issue.message,
    ),
  };
}
