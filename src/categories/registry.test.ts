import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { CATEGORY_KEYS, isCategoryKey } from './keys';
import { categories, getCategory, parseEntryData, requireCategory } from './registry';
import type { CategoryDefinition } from './types';

describe('category keys', () => {
  it('recognises registered keys only', () => {
    for (const key of CATEGORY_KEYS) expect(isCategoryKey(key)).toBe(true);
    expect(isCategoryKey('unknown')).toBe(false);
    expect(isCategoryKey(42)).toBe(false);
  });
});

describe('registry', () => {
  it('lists each category once under a known key', () => {
    const keys = categories.map((c) => c.key);
    expect(new Set(keys).size).toBe(keys.length);
    for (const key of keys) expect(isCategoryKey(key)).toBe(true);
    for (const def of categories) expect(getCategory(def.key)).toBe(def);
  });

  it('throws from requireCategory for an unregistered key', () => {
    const unregistered = CATEGORY_KEYS.find((key) => !getCategory(key));
    if (unregistered) expect(() => requireCategory(unregistered)).toThrow(/not registered/);
  });
});

describe('parseEntryData', () => {
  const def = {
    schema: z.object({ title: z.string().min(1, 'Title is required'), minutes: z.number().int() }),
  } as unknown as CategoryDefinition<{ title: string; minutes: number }>;

  it('returns typed data for valid input', () => {
    expect(parseEntryData(def, { title: 'Two Sum', minutes: 25 })).toEqual({
      ok: true,
      data: { title: 'Two Sum', minutes: 25 },
    });
  });

  it('returns readable errors with field paths', () => {
    const result = parseEntryData(def, { title: '', minutes: 1.5 });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toContain('title: Title is required');
      expect(result.errors.some((e) => e.startsWith('minutes:'))).toBe(true);
    }
  });
});
