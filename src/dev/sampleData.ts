import type { AdminData } from '../categories/admin';
import type { DsaData } from '../categories/dsa';
import type { HabitEntryData } from '../categories/habit';
import type { JobSearchData } from '../categories/jobSearch';
import type { Repository } from '../db/repository';
import type { DateKey, NewEntry } from '../db/types';
import { addDays, parseDateKey } from '../lib/dates';

/** Small deterministic PRNG so sample data is identical on every load. */
function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const COMPANIES = [
  'Northwind',
  'Contoso',
  'Initech',
  'Globex',
  'Umbrella',
  'Hooli',
  'Vandelay',
  'Stark',
];
const ROLES = [
  'Platform Engineer',
  'Developer Productivity Engineer',
  'SDET',
  'Infrastructure Engineer',
];
const PROBLEMS: Array<[string, DsaData['difficulty'], string[]]> = [
  ['Two Sum', 'easy', ['arrays', 'hash map']],
  ['Valid Parentheses', 'easy', ['stack']],
  ['Merge Intervals', 'medium', ['arrays', 'sorting']],
  ['LRU Cache', 'medium', ['design', 'hash map']],
  ['Course Schedule', 'medium', ['graphs', 'topological sort']],
  ['Longest Substring Without Repeating Characters', 'medium', ['sliding window']],
  ['Trapping Rain Water', 'hard', ['two pointers']],
  ['Word Ladder', 'hard', ['graphs', 'bfs']],
  ['Binary Tree Level Order', 'medium', ['trees', 'bfs']],
  ['Kth Largest Element', 'medium', ['heap']],
];

export interface SampleDataSummary {
  entries: number;
  habits: number;
  goals: number;
}

/**
 * Populate the repository with about six weeks of believable history ending
 * today. Used by the "Load sample data" action so the demo is not empty.
 */
export async function loadSampleData(
  repository: Repository,
  today: DateKey,
): Promise<SampleDataSummary> {
  const random = mulberry32(20260909);
  const pick = <T>(items: readonly T[]) => items[Math.floor(random() * items.length)];
  const chance = (probability: number) => random() < probability;

  const exercise = await repository.addHabit({ name: 'Exercise', kind: 'boolean' });
  const reading = await repository.addHabit({
    name: 'Read',
    kind: 'numeric',
    unit: 'pages',
    dailyTarget: 20,
  });

  const entries: NewEntry[] = [];
  const start = addDays(today, -41);

  for (let offset = 0; offset <= 41; offset += 1) {
    const date = addDays(start, offset);
    const weekday = parseDateKey(date).getDay(); // 0 = Sunday
    const isWeekend = weekday === 0 || weekday === 6;

    if (chance(0.8)) entries.push(habit(date, exercise.id, true));
    if (chance(0.7)) entries.push(habit(date, reading.id, 10 + Math.floor(random() * 25)));

    if (!isWeekend && chance(0.55)) {
      const [title, difficulty, topics] = pick(PROBLEMS);
      entries.push({
        date,
        category: 'dsa',
        data: {
          title,
          topics,
          difficulty,
          minutesSpent: 20 + Math.floor(random() * 50),
          solved: chance(0.75),
        } satisfies DsaData,
      });
    }

    if (!isWeekend && chance(0.35)) {
      const status = pick<JobSearchData['status']>([
        'applied',
        'applied',
        'applied',
        'screening',
        'interview',
        'rejected',
      ]);
      entries.push({
        date,
        category: 'jobSearch',
        data: {
          company: pick(COMPANIES),
          role: pick(ROLES),
          status,
          // Only recent applications still carry a pending follow-up; older ones have lapsed.
          nextActionDate:
            (status === 'applied' || status === 'screening') && offset >= 41 - 10
              ? addDays(date, 7)
              : undefined,
        } satisfies JobSearchData,
      });
    }
  }

  const admin: Array<[number, AdminData]> = [
    [-30, { title: 'WES credential evaluation submitted', completed: true }],
    [-12, { title: 'Book IELTS test date', completed: true, dueDate: addDays(today, -10) }],
    [
      -2,
      {
        title: 'IELTS speaking practice',
        completed: true,
        dueDate: addDays(today, -2),
        recurrence: { every: 2, unit: 'day' },
      },
    ],
    [
      0,
      {
        title: 'IELTS speaking practice',
        completed: false,
        dueDate: today,
        recurrence: { every: 2, unit: 'day' },
      },
    ],
    [
      -5,
      {
        title: 'Collect police clearance certificate',
        completed: false,
        dueDate: addDays(today, 3),
      },
    ],
    [-1, { title: 'Renew passport', completed: false, dueDate: addDays(today, 20) }],
  ];
  for (const [offset, data] of admin)
    entries.push({ date: addDays(today, offset), category: 'admin', data });

  await repository.addEntries(entries);

  // A mix of habit-, dsa-, and jobSearch-backed goals, so the Goals page shows every kind.
  await repository.addGoal({
    label: 'Read 100 pages',
    category: 'habit',
    habitId: reading.id,
    target: 100,
    period: 'month',
  });
  await repository.addGoal({
    label: 'Exercise 20 days',
    category: 'habit',
    habitId: exercise.id,
    target: 20,
    period: 'month',
  });
  await repository.addGoal({
    label: 'Solve 50 problems',
    category: 'dsa',
    target: 50,
    period: 'year',
  });
  await repository.addGoal({
    label: 'Apply to 15 jobs',
    category: 'jobSearch',
    target: 15,
    period: 'month',
  });

  return { entries: entries.length, habits: 2, goals: 4 };
}

function habit(
  date: DateKey,
  habitId: string,
  value: HabitEntryData['value'],
): NewEntry<HabitEntryData> {
  return { date, category: 'habit', data: { habitId, value } };
}
