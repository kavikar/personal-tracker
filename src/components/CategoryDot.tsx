import { getCategory } from '../categories/registry';
import type { CategoryKey } from '../categories/keys';

export function CategoryDot({
  category,
  className = '',
}: {
  category: CategoryKey;
  className?: string;
}) {
  const def = getCategory(category);
  const color = def?.color.dot ?? 'bg-slate-400';
  return (
    <span
      aria-hidden="true"
      className={`inline-block size-2 shrink-0 rounded-full ${color} ${className}`}
    />
  );
}
