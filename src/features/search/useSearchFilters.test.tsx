import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { useSearchFilters } from './useSearchFilters';

const wrapperFor = (url: string) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>;
  };

describe('useSearchFilters', () => {
  it('parses filters from the URL and drops invalid values', () => {
    const { result } = renderHook(() => useSearchFilters(), {
      wrapper: wrapperFor('/search?q=acme&categories=dsa,bogus,habit&from=2026-09-01&to=nope'),
    });
    expect(result.current[0]).toEqual({
      query: 'acme',
      categories: ['dsa', 'habit'],
      from: '2026-09-01',
      to: undefined,
    });
  });

  it('updates and clears filters', () => {
    const { result } = renderHook(() => useSearchFilters(), { wrapper: wrapperFor('/search') });
    act(() => result.current[1]({ query: 'two sum', categories: ['dsa'] }));
    expect(result.current[0].query).toBe('two sum');
    expect(result.current[0].categories).toEqual(['dsa']);
    act(() => result.current[2]());
    expect(result.current[0]).toEqual({
      query: '',
      categories: [],
      from: undefined,
      to: undefined,
    });
  });
});
