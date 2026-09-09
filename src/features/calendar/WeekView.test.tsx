import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Entry } from '../../db/types';
import { headerTitle } from './headerTitle';
import { WeekView } from './WeekView';

const context = { today: '2026-09-09', habits: [] };

const entry = (date: string, category: Entry['category']): Entry => ({
  id: `${date}-${category}`,
  date,
  category,
  data: {},
  createdAt: '2026-09-09T00:00:00.000Z',
  updatedAt: '2026-09-09T00:00:00.000Z',
});

describe('WeekView', () => {
  it('renders seven day columns Monday to Sunday with entry counts', () => {
    render(
      <WeekView
        focus="2026-09-09"
        entries={[entry('2026-09-09', 'dsa')]}
        selected={null}
        onSelect={() => {}}
        context={context}
        today="2026-09-09"
      />,
    );
    const headers = screen.getAllByRole('button');
    expect(headers).toHaveLength(7);
    expect(headers[0]).toHaveAccessibleName('Mon 7 Sep 2026, 0 entries');
    expect(headers[2]).toHaveAccessibleName('Wed 9 Sep 2026, 1 entry');
    expect(headers[6]).toHaveAccessibleName('Sun 13 Sep 2026, 0 entries');
  });

  it('reports the selected day on click', async () => {
    const onSelect = vi.fn();
    render(
      <WeekView
        focus="2026-09-09"
        entries={[]}
        selected={null}
        onSelect={onSelect}
        context={context}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: /Fri 11 Sep 2026/ }));
    expect(onSelect).toHaveBeenCalledWith('2026-09-11');
  });
});

describe('headerTitle', () => {
  it('shows the month name in month view', () => {
    expect(headerTitle('month', '2026-09-09')).toBe('September 2026');
  });

  it('shows a compact range in week view', () => {
    expect(headerTitle('week', '2026-09-09')).toBe('7 – 13 Sep 2026');
    expect(headerTitle('week', '2026-09-30')).toBe('28 Sep – 4 Oct 2026');
  });
});
