import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { repository } from '../../db/repository';
import type { Entry, Habit } from '../../db/types';
import { HabitCheckIn } from './HabitCheckIn';

const exercise: Habit = {
  id: 'h1',
  name: 'Exercise',
  kind: 'boolean',
  archived: false,
  createdAt: '',
};
const reading: Habit = {
  id: 'h2',
  name: 'Read',
  kind: 'numeric',
  unit: 'pages',
  dailyTarget: 20,
  archived: false,
  createdAt: '',
};
const retired: Habit = {
  id: 'h3',
  name: 'Retired',
  kind: 'boolean',
  archived: true,
  createdAt: '',
};

beforeEach(async () => {
  await repository.clearAll();
});

describe('HabitCheckIn', () => {
  it('renders nothing when there are no habits', () => {
    const { container } = render(<HabitCheckIn date="2026-09-09" habits={[]} entries={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('hides archived habits unless they have an entry that day', () => {
    const entry: Entry = {
      id: 'e',
      date: '2026-09-09',
      category: 'habit',
      data: { habitId: 'h3', value: true },
      createdAt: '',
      updatedAt: '',
    };
    const { rerender } = render(
      <HabitCheckIn date="2026-09-09" habits={[exercise, retired]} entries={[]} />,
    );
    expect(screen.queryByLabelText('Retired')).not.toBeInTheDocument();
    rerender(<HabitCheckIn date="2026-09-09" habits={[exercise, retired]} entries={[entry]} />);
    expect(screen.getByLabelText('Retired')).toBeChecked();
  });

  it('creates and removes a boolean entry from the checkbox', async () => {
    const user = userEvent.setup();
    render(<HabitCheckIn date="2026-09-09" habits={[exercise]} entries={[]} />);
    await user.click(screen.getByLabelText('Exercise'));
    await waitFor(async () =>
      expect(await repository.getEntriesByDate('2026-09-09')).toHaveLength(1),
    );
    const [created] = await repository.getEntriesByDate('2026-09-09');
    expect(created.data).toEqual({ habitId: 'h1', value: true });

    render(<HabitCheckIn date="2026-09-09" habits={[exercise]} entries={[created]} />);
    const boxes = screen.getAllByLabelText('Exercise');
    await user.click(boxes[boxes.length - 1]);
    await waitFor(async () =>
      expect(await repository.getEntriesByDate('2026-09-09')).toHaveLength(0),
    );
  });

  it('saves a numeric value on blur and updates it in place', async () => {
    const user = userEvent.setup();
    render(<HabitCheckIn date="2026-09-09" habits={[reading]} entries={[]} />);
    await user.type(screen.getByLabelText('Read'), '25');
    await user.tab();
    await waitFor(async () =>
      expect(await repository.getEntriesByDate('2026-09-09')).toHaveLength(1),
    );
    const [created] = await repository.getEntriesByDate('2026-09-09');
    expect(created.data).toEqual({ habitId: 'h2', value: 25 });

    render(<HabitCheckIn date="2026-09-09" habits={[reading]} entries={[created]} />);
    const inputs = screen.getAllByLabelText('Read');
    const input = inputs[inputs.length - 1];
    expect(input).toHaveValue(25);
    await user.clear(input);
    await user.type(input, '40{Enter}');
    await waitFor(async () => {
      const rows = await repository.getEntriesByDate('2026-09-09');
      expect(rows).toHaveLength(1);
      expect(rows[0].data).toEqual({ habitId: 'h2', value: 40 });
    });
  });
});
