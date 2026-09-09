import { z } from 'zod';
import { minutesSchema, optionalUrl } from '../shared';

export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

/** Accepts a comma-separated string or an array, and returns unique lowercase tags. */
const topicsSchema = z
  .union([z.string(), z.array(z.string())])
  .transform((value) => {
    const raw = Array.isArray(value) ? value : value.split(',');
    const cleaned = raw.map((tag) => tag.trim().toLowerCase()).filter(Boolean);
    return [...new Set(cleaned)];
  })
  .pipe(z.array(z.string().max(40, 'Keep tags short')).max(10, 'At most 10 tags'));

export const dsaSchema = z.object({
  title: z.string().trim().min(1, 'Problem title is required'),
  link: optionalUrl,
  topics: topicsSchema,
  difficulty: z.enum(DIFFICULTIES, { message: 'Pick a difficulty' }),
  minutesSpent: minutesSchema,
  solved: z.boolean(),
});

export type DsaData = z.infer<typeof dsaSchema>;
