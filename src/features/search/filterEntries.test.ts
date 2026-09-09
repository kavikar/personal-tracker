import { describe, expect, it } from 'vitest';
import type { Entry } from '../../db/types';
import { EMPTY_FILTERS, filterEntries, isEmptyFilters } from './filterEntries';

const entry = (id: string, date: string, category: Entry['category'], data: object): Entry => ({
  id,
  date,
  category,
  data,
  createdAt: id,
  updatedAt: id,
});

const entries = [
  entry('1', '2026-09-01', 'jobSearch', { company: 'Acme', role: 'SDET', status: 'applied' }),
  entry('2', '2026-09-05', 'dsa', { title: 'Two Sum', topics: ['arrays', 'hash map'] }),
  entry('3', '2026-09-09', 'admin', { title: 'WES documents', notes: 'courier to Acme street' }),
  entry('4', '2026-09-09', 'habit', { habitId: 'h1', value: true }),
];
const describeStub = (e: Entry) => (e.category === 'habit' ? 'Exercise: done' : '');

describe('filterEntries', () => {
  it('returns everything newest first with empty filters', () => {
    expect(filterEntries(entries, EMPTY_FILTERS, describeStub).map((e) => e.id)).toEqual([
      '4',
      '3',
      '2',
      '1',
    ]);
  });

  it('filters by category set', () => {
    expect(
      filterEntries(entries, { ...EMPTY_FILTERS, categories: ['dsa', 'admin'] }, describeStub).map(
        (e) => e.id,
      ),
    ).toEqual(['3', '2']);
  });

  it('filters by inclusive date range', () => {
    expect(
      filterEntries(
        entries,
        { ...EMPTY_FILTERS, from: '2026-09-05', to: '2026-09-09' },
        describeStub,
      ).map((e) => e.id),
    ).toEqual(['4', '3', '2']);
    expect(
      filterEntries(entries, { ...EMPTY_FILTERS, to: '2026-09-04' }, describeStub).map((e) => e.id),
    ).toEqual(['1']);
  });

  it('matches text in nested payload strings and in the description', () => {
    expect(
      filterEntries(entries, { ...EMPTY_FILTERS, query: 'acme' }, describeStub).map((e) => e.id),
    ).toEqual(['3', '1']);
    expect(
      filterEntries(entries, { ...EMPTY_FILTERS, query: 'hash' }, describeStub).map((e) => e.id),
    ).toEqual(['2']);
    expect(
      filterEntries(entries, { ...EMPTY_FILTERS, query: 'exercise' }, describeStub).map(
        (e) => e.id,
      ),
    ).toEqual(['4']);
  });

  it('detects empty filters', () => {
    expect(isEmptyFilters(EMPTY_FILTERS)).toBe(true);
    expect(isEmptyFilters({ ...EMPTY_FILTERS, query: ' ' })).toBe(true);
    expect(isEmptyFilters({ ...EMPTY_FILTERS, from: '2026-09-01' })).toBe(false);
  });
});
