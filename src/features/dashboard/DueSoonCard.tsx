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

export function DueSoonCard({ items, context }: DueSoonCardProps) {
  return (
    <section
      aria-labelledby="due-heading"
      className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs"
    >
      <h2 id="due-heading" className="text-sm font-semibold text-slate-800">
        Due in the next 7 days
      </h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">Nothing due. Nice.</p>
      ) : (
        <ul className="mt-3 divide-y divide-slate-100">
          {items.map(({ entry, dueDate, overdue }) => (
            <li key={entry.id} className="py-2">
              <Link
                to={`/?date=${entry.date}&selected=${entry.date}`}
                className="flex items-start gap-2 text-sm hover:underline"
              >
                <CategoryDot category={entry.category} className="mt-1.5" />
                <span className="min-w-0 flex-1 truncate text-slate-800">
                  {describeEntry(entry, context)}
                </span>
                <span
                  className={`shrink-0 text-xs ${overdue ? 'font-semibold text-red-600' : 'text-slate-500'}`}
                >
                  {overdue ? 'overdue · ' : ''}
                  {formatShort(dueDate)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
