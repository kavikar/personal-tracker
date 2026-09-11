import { useState } from 'react';
import { meetsTarget, type HabitEntryData } from '../../categories/habit';
import { Checkbox, TextInput } from '../../components/form';
import { repository } from '../../db/repository';
import type { DateKey, Entry, Habit } from '../../db/types';

interface HabitCheckInProps {
  date: DateKey;
  habits: readonly Habit[];
  entries: readonly Entry[];
}

function isHabitEntry(entry: Entry): entry is Entry<HabitEntryData> {
  return entry.category === 'habit';
}

/**
 * One row per habit with an inline control that writes straight to the
 * database: a checkbox for yes/no habits, a number box for numeric ones.
 * Clearing a value removes the entry so "not logged" and "skipped" are the
 * same thing on the calendar.
 */
export function HabitCheckIn({ date, habits, entries }: HabitCheckInProps) {
  const habitEntries = entries.filter(isHabitEntry);
  const byHabit = new Map(habitEntries.map((entry) => [entry.data.habitId, entry]));
  const rows = [
    ...habits.filter((habit) => !habit.archived),
    ...habits.filter((habit) => habit.archived && byHabit.has(habit.id)),
  ];

  if (rows.length === 0) return null;

  const save = async (habit: Habit, value: HabitEntryData['value'] | null) => {
    const existing = byHabit.get(habit.id);
    if (value === null) {
      if (existing) await repository.deleteEntry(existing.id);
      return;
    }
    if (existing)
      await repository.updateEntry<HabitEntryData>(existing.id, {
        data: { habitId: habit.id, value },
      });
    else
      await repository.addEntry<HabitEntryData>({
        date,
        category: 'habit',
        data: { habitId: habit.id, value },
      });
  };

  return (
    <section
      aria-label="Habits"
      className="rounded-md border border-emerald-200 bg-emerald-50/60 p-3 dark:border-emerald-900 dark:bg-emerald-950/30"
    >
      <h3 className="text-xs font-semibold tracking-wide text-emerald-800 uppercase dark:text-emerald-400">
        Habits
      </h3>
      <ul className="mt-2 space-y-2">
        {rows.map((habit) => {
          const entry = byHabit.get(habit.id);
          const met = entry ? meetsTarget(habit, entry.data.value) : false;
          return (
            <li key={habit.id} className="flex items-center justify-between gap-3 text-sm">
              <span
                className={
                  met ? 'text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'
                }
              >
                {habit.name}
                {habit.archived && (
                  <span className="ml-1 text-xs text-slate-400 dark:text-slate-500">
                    (archived)
                  </span>
                )}
                {habit.kind === 'numeric' && habit.dailyTarget !== undefined && (
                  <span className="ml-1 text-xs text-slate-400 dark:text-slate-500">
                    target {habit.dailyTarget}
                    {habit.unit ? ` ${habit.unit}` : ''}
                  </span>
                )}
              </span>
              {habit.kind === 'boolean' ? (
                <Checkbox
                  aria-label={habit.name}
                  checked={entry?.data.value === true}
                  onChange={(e) => void save(habit, e.target.checked ? true : null)}
                />
              ) : (
                <NumericInput
                  key={`${habit.id}:${entry?.data.value ?? ''}`}
                  habit={habit}
                  value={typeof entry?.data.value === 'number' ? entry.data.value : null}
                  onCommit={(value) => void save(habit, value)}
                />
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function NumericInput({
  habit,
  value,
  onCommit,
}: {
  habit: Habit;
  value: number | null;
  onCommit: (value: number | null) => void;
}) {
  const [text, setText] = useState(value === null ? '' : String(value));

  const commit = () => {
    const trimmed = text.trim();
    if (trimmed === '') {
      if (value !== null) onCommit(null);
      return;
    }
    const amount = Number(trimmed);
    if (!Number.isFinite(amount) || amount < 0) {
      setText(value === null ? '' : String(value));
      return;
    }
    if (amount !== value) onCommit(amount);
  };

  return (
    <div className="flex items-center gap-1">
      <TextInput
        aria-label={habit.name}
        type="number"
        inputMode="decimal"
        min={0}
        className="w-20 text-right"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commit();
          }
        }}
      />
      {habit.unit && (
        <span className="text-xs text-slate-500 dark:text-slate-400">{habit.unit}</span>
      )}
    </div>
  );
}
