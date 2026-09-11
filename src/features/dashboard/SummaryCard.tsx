import type { AnyCategoryDefinition, SummaryStat } from '../../categories/types';
import { CategoryDot } from '../../components/CategoryDot';

interface SummaryCardProps {
  definition: AnyCategoryDefinition;
  stats: SummaryStat[];
}

export function SummaryCard({ definition, stats }: SummaryCardProps) {
  return (
    <section
      aria-labelledby={`summary-${definition.key}`}
      className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900"
    >
      <h2
        id={`summary-${definition.key}`}
        className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200"
      >
        <CategoryDot category={definition.key} />
        {definition.label}
      </h2>
      {stats.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Nothing to show yet.</p>
      ) : (
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</dt>
              <dd className="text-xl font-semibold text-slate-900 dark:text-white">
                {stat.value}
              </dd>
              {stat.hint && (
                <dd className="text-xs text-slate-500 dark:text-slate-400">{stat.hint}</dd>
              )}
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
