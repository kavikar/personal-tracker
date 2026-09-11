import { Link } from 'react-router-dom';
import { describeEntry } from '../../categories/describe';
import type { CategoryContext } from '../../categories/types';
import { CategoryDot } from '../../components/CategoryDot';
import { formatShort } from '../../lib/dates';
import type { DueItem } from './upcoming';

interface DueSoonCardProps {
  items: DueItem[];
  context: CategoryContext;
}

const MAX_ITEMS = 8;

export function DueSoonCard({ items: allItems, context }: DueSoonCardProps) {
  const items = allItems.slice(0, MAX_ITEMS);
  const hidden = allItems.length - items.length;
  return (
    <section
      aria-labelledby="due-heading"
      className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900"
    >
      <h2 id="due-heading" className="text-sm font-semibold text-slate-800 dark:text-slate-200">
        Due in the next 7 days
      </h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Nothing due. Nice.</p>
      ) : (
        <ul className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
          {items.map(({ entry, dueDate, overdue }) => (
            <li key={entry.id} className="py-2">
              <Link
                to={`/?date=${entry.date}&selected=${entry.date}`}
                className="flex items-start gap-2 text-sm hover:underline"
              >
                <CategoryDot category={entry.category} className="mt-1.5" />
                <span className="min-w-0 flex-1 truncate text-slate-800 dark:text-slate-200">
                  {describeEntry(entry, context)}
                </span>
                <span
                  className={`shrink-0 text-xs ${overdue ? 'font-semibold text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  {overdue ? 'overdue · ' : ''}
                  {formatShort(dueDate)}
                </span>
              </Link>
            </li>
          ))}
          {hidden > 0 && (
            <li className="pt-2 text-xs text-slate-500 dark:text-slate-400">
              <Link to="/search" className="hover:underline">
                {hidden} more on the search page
              </Link>
            </li>
          )}
        </ul>
      )}
    </section>
  );
}
