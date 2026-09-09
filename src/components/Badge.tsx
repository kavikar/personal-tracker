import { getCategory } from '../categories/registry';
import type { CategoryKey } from '../categories/keys';

export function CategoryBadge({ category }: { category: CategoryKey }) {
  const def = getCategory(category);
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        def?.color.badge ?? 'bg-slate-100 text-slate-700'
      }`}
    >
      {def?.label ?? category}
    </span>
  );
}
