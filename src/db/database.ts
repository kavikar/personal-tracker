import Dexie, { type EntityTable } from 'dexie';
import type { Entry, Goal, Habit } from './types';

/**
 * IndexedDB database for the tracker.
 *
 * Only indexed fields are listed in the schema string. Everything else on a row
 * (notably `Entry.data`) is stored as-is, which is what lets categories evolve
 * without bumping the database version.
 */
export class TrackerDatabase extends Dexie {
  entries!: EntityTable<Entry, 'id'>;
  habits!: EntityTable<Habit, 'id'>;
  goals!: EntityTable<Goal, 'id'>;

  constructor(name = 'personal-tracker') {
    super(name);
    this.version(1).stores({
      entries: 'id, date, category, [category+date]',
      habits: 'id, name, archived',
    });
    this.version(2).stores({
      goals: 'id, category, habitId',
    });
  }
}

export const db = new TrackerDatabase();
