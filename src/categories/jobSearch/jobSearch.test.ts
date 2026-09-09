import { describe, expect, it } from 'vitest';
import type { Entry } from '../../db/types';
import { jobSearchCategory, type JobSearchData } from './index';
import { jobSearchSchema } from './schema';
import { summarizeJobSearch } from './summarize';

const entry = (date: string, data: Partial<JobSearchData>): Entry<JobSearchData> => ({
  id: crypto.randomUUID(),
  date,
  category: 'jobSearch',
  data: { company: 'Acme', role: 'SDET', status: 'applied', ...data },
  createdAt: '',
  updatedAt: '',
});

describe('jobSearchSchema', () => {
  it('trims text and drops blank optional fields', () => {
    const parsed = jobSearchSchema.parse({
      company: '  Acme ',
      role: 'Platform Engineer',
      status: 'applied',
      link: '',
      nextActionDate: '',
      notes: '  ',
    });
    expect(parsed).toEqual({ company: 'Acme', role: 'Platform Engineer', status: 'applied' });
  });

  it('rejects missing required fields, bad links, and bad dates', () => {
    const result = jobSearchSchema.safeParse({
      company: '',
      role: '',
      status: 'unknown',
      link: 'acme.com',
      nextActionDate: '2026-13-01',
    });
    expect(result.success).toBe(false);
    const paths = result.error!.issues.map((i) => i.path[0]);
    expect(paths).toEqual(
      expect.arrayContaining(['company', 'role', 'status', 'link', 'nextActionDate']),
    );
  });
});

describe('jobSearchCategory', () => {
  it('describes an entry with company, role, and status', () => {
    expect(
      jobSearchCategory.describe(
        { company: 'Acme', role: 'SDET', status: 'interview' },
        { today: '2026-09-09', habits: [] },
      ),
    ).toBe('Acme · SDET (Interview)');
  });

  it('treats closed applications as done for due-date purposes', () => {
    expect(
      jobSearchCategory.dueDate!({
        company: 'A',
        role: 'B',
        status: 'applied',
        nextActionDate: '2026-09-12',
      }),
    ).toBe('2026-09-12');
    expect(jobSearchCategory.isDone!({ company: 'A', role: 'B', status: 'rejected' })).toBe(true);
    expect(jobSearchCategory.isDone!({ company: 'A', role: 'B', status: 'screening' })).toBe(false);
  });
});

describe('summarizeJobSearch', () => {
  it('counts applications, interviews, offers, and follow-ups in range', () => {
    const ctx = {
      range: { from: '2026-09-07', to: '2026-09-13' },
      today: '2026-09-10',
      habits: [],
    };
    const stats = summarizeJobSearch(
      [
        entry('2026-09-07', { status: 'applied', nextActionDate: '2026-09-08' }),
        entry('2026-09-08', { status: 'applied', nextActionDate: '2026-09-20' }),
        entry('2026-09-09', { status: 'interview', nextActionDate: '2026-09-12' }),
        entry('2026-09-10', { status: 'offer' }),
        entry('2026-09-11', { status: 'rejected', nextActionDate: '2026-09-11' }),
      ],
      ctx,
    );
    expect(stats).toEqual([
      { label: 'Applications sent', value: 2 },
      { label: 'Interviews', value: 1 },
      { label: 'Offers', value: 1 },
      { label: 'Follow-ups due', value: 2, hint: '1 overdue' },
    ]);
  });
});
