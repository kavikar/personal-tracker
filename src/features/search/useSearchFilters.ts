import { useSearchParams } from 'react-router-dom';
import { isCategoryKey, type CategoryKey } from '../../categories/keys';
import { isValidDateKey } from '../../lib/dates';
import type { SearchFilters } from './filterEntries';

export function useSearchFilters(): [
  SearchFilters,
  (patch: Partial<SearchFilters>) => void,
  () => void,
] {
  const [params, setParams] = useSearchParams();

  const filters: SearchFilters = {
    query: params.get('q') ?? '',
    categories: (params.get('categories') ?? '').split(',').filter(isCategoryKey),
    from: validDate(params.get('from')),
    to: validDate(params.get('to')),
  };

  const update = (patch: Partial<SearchFilters>) =>
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        const merged = { ...filters, ...patch };
        setOrDelete(next, 'q', merged.query);
        setOrDelete(next, 'categories', merged.categories.join(','));
        setOrDelete(next, 'from', merged.from);
        setOrDelete(next, 'to', merged.to);
        return next;
      },
      { replace: true },
    );

  const clear = () => setParams(new URLSearchParams(), { replace: true });

  return [filters, update, clear];
}

function validDate(value: string | null): string | undefined {
  return value && isValidDateKey(value) ? value : undefined;
}

function setOrDelete(params: URLSearchParams, key: string, value: string | undefined) {
  if (value) params.set(key, value);
  else params.delete(key);
}

export type { CategoryKey };
