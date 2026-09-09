import { z } from 'zod';
import { isValidDateKey } from '../lib/dates';

/** Optional free-text field: blank input becomes undefined instead of "". */
export const optionalText = z
  .string()
  .trim()
  .transform((value) => (value === '' ? undefined : value))
  .optional();

/** Optional http(s) link with the same blank handling. */
export const optionalUrl = z
  .string()
  .trim()
  .transform((value) => (value === '' ? undefined : value))
  .optional()
  .refine((value) => value === undefined || /^https?:\/\/\S+$/.test(value), {
    message: 'Enter a full URL starting with http:// or https://',
  });

export const dateKeySchema = z.string().refine(isValidDateKey, { message: 'Use a valid date' });

/** Optional local day key with blank handling. */
export const optionalDateKey = z
  .string()
  .trim()
  .transform((value) => (value === '' ? undefined : value))
  .optional()
  .refine((value) => value === undefined || isValidDateKey(value), { message: 'Use a valid date' });

/** Whole minutes from a text input. */
export const minutesSchema = z.coerce
  .number({ message: 'Enter a number of minutes' })
  .int('Use whole minutes')
  .min(0, 'Minutes cannot be negative')
  .max(24 * 60, 'That is more than a day');
