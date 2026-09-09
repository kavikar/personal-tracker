import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type * as registry from '../../categories/registry';
import { repository } from '../../db/repository';
import type { Entry } from '../../db/types';
import { DayPanel } from './DayPanel';

vi.mock('../../categories/registry', async (importOriginal) => {
  const original = await importOriginal<typeof registry>();
  const { noteCategory } = await import('../../test/noteCategory');
  return {
    ...original,
    categories: [noteCategory],
    getCategory: (key: string) => (key === 'dsa' ? noteCategory : undefined),
  };
});

const context = { today: '2026-09-09', habits: [] };

function Harness() {
  const [entries, setEntries] = useState<Entry[]>([]);
  void repository.getEntriesByDate('2026-09-09').then(setEntries);
  return <DayPanel date="2026-09-09" entries={entries} context={context} onClose={() => {}} />;
}

beforeEach(async () => {
  await repository.clearAll();
});

describe('DayPanel', () => {
  it('adds an entry through the category form', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    expect(screen.getByText('Nothing logged yet.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Add Note' }));
    expect(screen.getByRole('dialog', { name: /Add Note/ })).toBeInTheDocument();
    await user.type(screen.getByLabelText('Text'), 'Two Sum');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    const stored = await repository.getEntriesByDate('2026-09-09');
    expect(stored).toHaveLength(1);
    expect(stored[0].data).toEqual({ text: 'Two Sum' });
  });

  it('shows validation errors and keeps the dialog open', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Add Note' }));
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('text: Text is required');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await expect(repository.listEntries()).resolves.toHaveLength(0);
  });

  it('edits and deletes existing entries', async () => {
    const user = userEvent.setup();
    const entry = await repository.addEntry({
      date: '2026-09-09',
      category: 'dsa',
      data: { text: 'Old' },
    });
    render(<DayPanel date="2026-09-09" entries={[entry]} context={context} onClose={() => {}} />);

    await user.click(screen.getByRole('button', { name: 'Edit Old' }));
    const input = screen.getByLabelText('Text');
    await user.clear(input);
    await user.type(input, 'New');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(async () => {
      expect((await repository.getEntry(entry.id))?.data).toEqual({ text: 'New' });
    });

    await user.click(screen.getByRole('button', { name: 'Delete Old' }));
    await user.click(screen.getByRole('button', { name: 'Confirm delete Old' }));
    await waitFor(async () => {
      await expect(repository.getEntry(entry.id)).resolves.toBeUndefined();
    });
  });
});
