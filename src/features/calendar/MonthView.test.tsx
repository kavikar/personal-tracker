import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Entry } from '../../db/types';
import { MonthView } from './MonthView';

const entry = (date: string, category: Entry['category']): Entry => ({
  id: `${date}-${category}`,
  date,
  category,
  data: {},
  createdAt: '2026-09-09T00:00:00.000Z',
  updatedAt: '2026-09-09T00:00:00.000Z',
});

describe('MonthView', () => {
  it('renders a padded grid of day buttons for the focused month', () => {
    render(
      <MonthView
        focus="2026-09-15"
        entries={[]}
        selected={null}
        onSelect={() => {}}
        today="2026-09-09"
      />,
    );
    expect(screen.getAllByRole('columnheader')).toHaveLength(7);
    expect(screen.getAllByRole('button')).toHaveLength(35);
    expect(screen.getByRole('button', { name: 'Mon 31 Aug 2026' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sun 4 Oct 2026' })).toBeInTheDocument();
  });

  it('announces entry counts on days that have entries', () => {
    render(
      <MonthView
        focus="2026-09-15"
        entries={[entry('2026-09-09', 'dsa'), entry('2026-09-09', 'habit')]}
        selected={null}
        onSelect={() => {}}
        today="2026-09-09"
      />,
    );
    expect(screen.getByRole('button', { name: 'Wed 9 Sep 2026, 2 entries' })).toBeInTheDocument();
  });

  it('marks the selected day and reports clicks', async () => {
    const onSelect = vi.fn();
    render(
      <MonthView
        focus="2026-09-15"
        entries={[]}
        selected="2026-09-10"
        onSelect={onSelect}
        today="2026-09-09"
      />,
    );
    expect(screen.getByRole('button', { name: 'Thu 10 Sep 2026' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Fri 11 Sep 2026' }));
    expect(onSelect).toHaveBeenCalledWith('2026-09-11');
  });
});
