import { useMemo } from 'react';
import { useHabits } from '../db/hooks';
import { todayKey } from '../lib/dates';
import type { CategoryContext } from './types';

/** Shared context categories need to describe and summarise entries. */
export function useCategoryContext(): CategoryContext {
  const habits = useHabits(true);
  return useMemo(() => ({ today: todayKey(), habits: habits ?? [] }), [habits]);
}
