import { z } from 'zod';
import { optionalDateKey, optionalText, optionalUrl } from '../shared';

export const JOB_STATUSES = [
  'applied',
  'screening',
  'interview',
  'offer',
  'rejected',
  'withdrawn',
] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  applied: 'Applied',
  screening: 'Screening',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
};

/** Statuses that mean the application is still moving. */
export const ACTIVE_STATUSES: readonly JobStatus[] = ['applied', 'screening', 'interview', 'offer'];

export const jobSearchSchema = z.object({
  company: z.string().trim().min(1, 'Company is required'),
  role: z.string().trim().min(1, 'Role is required'),
  status: z.enum(JOB_STATUSES, { message: 'Pick a status' }),
  link: optionalUrl,
  nextActionDate: optionalDateKey,
  notes: optionalText,
});

export type JobSearchData = z.infer<typeof jobSearchSchema>;
