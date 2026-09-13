import type { TrackerDatabase } from './database';
import { db as defaultDb } from './database';
import type {
  DateKey,
  DateRange,
  Entry,
  Goal,
  Habit,
  NewEntry,
  NewGoal,
  NewHabit,
  PillarSkill,
} from './types';
import type { CategoryKey } from '../categories/keys';

/**
 * The persistence seam. UI code and rollups talk to this interface, never to
 * Dexie directly, so a remote backend can replace the implementation without
 * touching features.
 */
export interface Repository {
  addEntry<T>(input: NewEntry<T>): Promise<Entry<T>>;
  /** Insert many entries in one transaction. All or nothing. */
  addEntries(inputs: readonly NewEntry[]): Promise<Entry[]>;
  updateEntry<T>(id: string, patch: Partial<Pick<Entry<T>, 'date' | 'data'>>): Promise<Entry<T>>;
  deleteEntry(id: string): Promise<void>;
  getEntry<T = unknown>(id: string): Promise<Entry<T> | undefined>;
  getEntriesByDate(date: DateKey): Promise<Entry[]>;
  getEntriesInRange(range: DateRange, category?: CategoryKey): Promise<Entry[]>;
  listEntries(): Promise<Entry[]>;

  addHabit(input: NewHabit): Promise<Habit>;
  updateHabit(id: string, patch: Partial<Omit<Habit, 'id' | 'createdAt'>>): Promise<Habit>;
  listHabits(includeArchived?: boolean): Promise<Habit[]>;

  addGoal(input: NewGoal): Promise<Goal>;
  updateGoal(id: string, patch: Partial<Omit<Goal, 'id' | 'createdAt'>>): Promise<Goal>;
  deleteGoal(id: string): Promise<void>;
  listGoals(): Promise<Goal[]>;

  listPillarSkills(): Promise<PillarSkill[]>;
  setPillarSkillChecked(id: string, checked: boolean): Promise<PillarSkill>;

  clearAll(): Promise<void>;
}

export class NotFoundError extends Error {
  constructor(entity: string, id: string) {
    super(`${entity} ${id} not found`);
    this.name = 'NotFoundError';
  }
}

const now = () => new Date().toISOString();
const newId = () => crypto.randomUUID();

function byDateThenCreated(a: Entry, b: Entry): number {
  return a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt);
}

export function createRepository(db: TrackerDatabase): Repository {
  return {
    async addEntry<T>(input: NewEntry<T>): Promise<Entry<T>> {
      const timestamp = now();
      const entry: Entry<T> = { id: newId(), ...input, createdAt: timestamp, updatedAt: timestamp };
      await db.entries.add(entry);
      return entry;
    },

    async addEntries(inputs) {
      const timestamp = now();
      const rows: Entry[] = inputs.map((input) => ({
        id: newId(),
        ...input,
        createdAt: timestamp,
        updatedAt: timestamp,
      }));
      await db.entries.bulkAdd(rows);
      return rows;
    },

    async updateEntry<T>(id: string, patch: Partial<Pick<Entry<T>, 'date' | 'data'>>) {
      const existing = (await db.entries.get(id)) as Entry<T> | undefined;
      if (!existing) throw new NotFoundError('Entry', id);
      const updated: Entry<T> = { ...existing, ...patch, updatedAt: now() };
      await db.entries.put(updated);
      return updated;
    },

    async deleteEntry(id) {
      await db.entries.delete(id);
    },

    async getEntry<T>(id: string) {
      return (await db.entries.get(id)) as Entry<T> | undefined;
    },

    async getEntriesByDate(date) {
      const rows = await db.entries.where('date').equals(date).toArray();
      return rows.sort(byDateThenCreated);
    },

    async getEntriesInRange({ from, to }, category) {
      const rows = category
        ? await db.entries
            .where('[category+date]')
            .between([category, from], [category, to], true, true)
            .toArray()
        : await db.entries.where('date').between(from, to, true, true).toArray();
      return rows.sort(byDateThenCreated);
    },

    async listEntries() {
      const rows = await db.entries.toArray();
      return rows.sort(byDateThenCreated);
    },

    async addHabit(input) {
      const habit: Habit = { id: newId(), archived: false, createdAt: now(), ...input };
      await db.habits.add(habit);
      return habit;
    },

    async updateHabit(id, patch) {
      const existing = await db.habits.get(id);
      if (!existing) throw new NotFoundError('Habit', id);
      const updated: Habit = { ...existing, ...patch };
      await db.habits.put(updated);
      return updated;
    },

    async listHabits(includeArchived = false) {
      const rows = await db.habits.toArray();
      return rows
        .filter((h) => includeArchived || !h.archived)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    },

    async addGoal(input) {
      const goal: Goal = { id: newId(), createdAt: now(), ...input };
      await db.goals.add(goal);
      return goal;
    },

    async updateGoal(id, patch) {
      const existing = await db.goals.get(id);
      if (!existing) throw new NotFoundError('Goal', id);
      const updated: Goal = { ...existing, ...patch };
      await db.goals.put(updated);
      return updated;
    },

    async deleteGoal(id) {
      await db.goals.delete(id);
    },

    async listGoals() {
      const rows = await db.goals.toArray();
      return rows.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    },

    async listPillarSkills() {
      return db.pillarSkills.toArray();
    },

    async setPillarSkillChecked(id, checked) {
      const updated: PillarSkill = { id, checked, updatedAt: now() };
      await db.pillarSkills.put(updated);
      return updated;
    },

    async clearAll() {
      await db.transaction(
        'rw',
        db.entries,
        db.habits,
        db.goals,
        db.pillarSkills,
        async () => {
          await db.entries.clear();
          await db.habits.clear();
          await db.goals.clear();
          await db.pillarSkills.clear();
        },
      );
    },
  };
}

export const repository = createRepository(defaultDb);
