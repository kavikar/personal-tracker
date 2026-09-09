import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { todayKey } from '../../lib/dates';
import { useCalendarState } from './useCalendarState';

function wrapperFor(url: string) {
  return ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
  );
}

describe('useCalendarState', () => {
  it('defaults to the month view centred on today with nothing selected', () => {
    const { result } = renderHook(() => useCalendarState(), { wrapper: wrapperFor('/') });
    expect(result.current.view).toBe('month');
    expect(result.current.focus).toBe(todayKey());
    expect(result.current.selected).toBeNull();
  });

  it('reads valid state from the URL and ignores malformed values', () => {
    const { result } = renderHook(() => useCalendarState(), {
      wrapper: wrapperFor('/?view=week&date=2026-09-09&selected=not-a-date'),
    });
    expect(result.current.view).toBe('week');
    expect(result.current.focus).toBe('2026-09-09');
    expect(result.current.selected).toBeNull();
  });

  it('selecting a day also moves focus to it', () => {
    const { result } = renderHook(() => useCalendarState(), {
      wrapper: wrapperFor('/?date=2026-09-09'),
    });
    act(() => result.current.select('2026-10-03'));
    expect(result.current.selected).toBe('2026-10-03');
    expect(result.current.focus).toBe('2026-10-03');
    act(() => result.current.select(null));
    expect(result.current.selected).toBeNull();
    expect(result.current.focus).toBe('2026-10-03');
  });
});
