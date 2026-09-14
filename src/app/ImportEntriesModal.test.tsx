import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { repository } from '../db/repository';
import { ImportEntriesModal } from './ImportEntriesModal';

beforeEach(async () => {
  await repository.clearAll();
});

describe('ImportEntriesModal', () => {
  it('imports a valid batch and reports the count', async () => {
    const user = userEvent.setup();
    const onImported = vi.fn();
    render(<ImportEntriesModal onClose={() => {}} onImported={onImported} />);

    const rows = [
      {
        date: '2026-09-14',
        category: 'jobSearch',
        data: { company: 'Cribl', role: 'Sr. Engineering Manager, SDET', status: 'applied' },
      },
      {
        date: '2026-09-11',
        category: 'jobSearch',
        data: { company: 'Synechron', role: 'QA Automation Engineer', status: 'applied', passesEvalFramework: false },
      },
    ];
    await user.click(screen.getByPlaceholderText(/date/));
    await user.paste(JSON.stringify(rows));
    await user.click(screen.getByRole('button', { name: 'Import' }));

    expect(await screen.findByText('Imported 2 entries.')).toBeInTheDocument();
    expect(onImported).toHaveBeenCalled();
    const entries = await repository.listEntries();
    expect(entries).toHaveLength(2);
    expect(entries.map((e) => e.category)).toEqual(['jobSearch', 'jobSearch']);
  });

  it('rejects the whole batch when one row fails its category schema, without importing the rest', async () => {
    const user = userEvent.setup();
    render(<ImportEntriesModal onClose={() => {}} onImported={() => {}} />);

    const rows = [
      { date: '2026-09-14', category: 'jobSearch', data: { company: 'Cribl', role: 'SDET', status: 'applied' } },
      { date: '2026-09-11', category: 'jobSearch', data: { role: 'Missing company', status: 'applied' } },
    ];
    await user.click(screen.getByPlaceholderText(/date/));
    await user.paste(JSON.stringify(rows));
    await user.click(screen.getByRole('button', { name: 'Import' }));

    expect(await screen.findByText(/Row 2/)).toBeInTheDocument();
    await expect(repository.listEntries()).resolves.toHaveLength(0);
  });

  it('shows a parse error for invalid JSON', async () => {
    const user = userEvent.setup();
    const { container } = render(<ImportEntriesModal onClose={() => {}} onImported={() => {}} />);

    await user.click(screen.getByPlaceholderText(/date/));
    await user.paste('{ not valid json');
    await user.click(screen.getByRole('button', { name: 'Import' }));

    await waitFor(() => expect(container.textContent).toMatch(/JSON/));
    await expect(repository.listEntries()).resolves.toHaveLength(0);
  });
});
