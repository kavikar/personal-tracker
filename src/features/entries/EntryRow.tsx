import { useState } from 'react';
import { describeEntry } from '../../categories/describe';
import { getCategory } from '../../categories/registry';
import type { CategoryContext } from '../../categories/types';
import { Button } from '../../components/Button';
import { CategoryBadge } from '../../components/Badge';
import { repository } from '../../db/repository';
import type { Entry } from '../../db/types';
import { formatShort } from '../../lib/dates';

interface EntryRowProps {
  entry: Entry;
  context: CategoryContext;
  onEdit: (entry: Entry) => void;
  /** Show the entry date, for lists that span several days. */
  showDate?: boolean;
}

export function EntryRow({ entry, context, onEdit, showDate = false }: EntryRowProps) {
  const [confirming, setConfirming] = useState(false);
  const def = getCategory(entry.category);
  const description = describeEntry(entry, context);

  return (
    <li
      className={`flex items-center justify-between gap-3 rounded-md border-l-4 bg-white py-2 pr-2 pl-3 shadow-xs ${
        def?.color.accent ?? 'border-slate-300'
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-slate-800">{description}</p>
        <p className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
          {showDate && <span>{formatShort(entry.date)}</span>}
          <CategoryBadge category={entry.category} />
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {confirming ? (
          <>
            <Button
              variant="danger"
              size="sm"
              onClick={() => repository.deleteEntry(entry.id)}
              aria-label={`Confirm delete ${description}`}
            >
              Delete
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(entry)}
              aria-label={`Edit ${description}`}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setConfirming(true)}
              aria-label={`Delete ${description}`}
            >
              Delete
            </Button>
          </>
        )}
      </div>
    </li>
  );
}
