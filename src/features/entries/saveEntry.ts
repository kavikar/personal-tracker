import { parseEntryData } from '../../categories/registry';
import type { CategoryDefinition } from '../../categories/types';
import { repository as defaultRepository, type Repository } from '../../db/repository';
import type { DateKey, Entry } from '../../db/types';

export class ValidationError extends Error {
  readonly errors: string[];

  constructor(errors: string[]) {
    super(errors.join('; '));
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

/**
 * Validate a payload against its category schema and persist it, creating a
 * new entry or updating `existingId`. Throws ValidationError on bad input so
 * the caller can show the messages.
 */
export async function saveEntry<T>(
  def: CategoryDefinition<T>,
  date: DateKey,
  data: unknown,
  existingId?: string,
  repository: Repository = defaultRepository,
): Promise<Entry<T>> {
  const parsed = parseEntryData(def, data);
  if (!parsed.ok) throw new ValidationError(parsed.errors);

  const previous = existingId ? await repository.getEntry<T>(existingId) : undefined;
  if (existingId && !previous) throw new Error(`Entry ${existingId} no longer exists`);

  const saved = previous
    ? await repository.updateEntry<T>(existingId!, { date, data: parsed.data })
    : await repository.addEntry<T>({ date, category: def.key, data: parsed.data });

  const next = def.followUp?.(previous?.data, parsed.data, date);
  if (next) await repository.addEntry<T>(next);

  return saved;
}
