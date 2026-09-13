import { Checkbox } from '../../components/form';
import { pillars } from '../../data/careerPlan';
import { usePillarSkills } from '../../db/hooks';
import { repository } from '../../db/repository';

export function PillarsSection() {
  const rows = usePillarSkills();
  const checkedById = new Map((rows ?? []).map((r) => [r.id, r.checked]));

  return (
    <div className="space-y-4">
      {pillars.map((pillar) => {
        const ids = pillar.skills.map((_, i) => `${pillar.id}__${i}`);
        const done = ids.filter((id) => checkedById.get(id)).length;

        return (
          <section
            key={pillar.id}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Pillar {pillar.order} — {pillar.name}
              </h3>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {pillar.priority}
              </span>
            </div>
            <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">{pillar.summary}</p>

            <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-violet-500 transition-[width]"
                style={{ width: `${ids.length ? (done / ids.length) * 100 : 0}%` }}
              />
            </div>

            <div className="grid gap-x-4 sm:grid-cols-2">
              {pillar.skills.map((skill, i) => {
                const id = ids[i];
                const checked = checkedById.get(id) ?? false;
                return (
                  <label
                    key={id}
                    className="flex items-start gap-2 py-1 text-sm text-slate-700 dark:text-slate-300"
                  >
                    <Checkbox
                      className="mt-0.5"
                      checked={checked}
                      onChange={(e) => repository.setPillarSkillChecked(id, e.target.checked)}
                    />
                    <span className={checked ? 'text-slate-400 line-through dark:text-slate-500' : ''}>
                      {skill}
                    </span>
                  </label>
                );
              })}
            </div>

            <p className="mt-3 text-xs text-slate-500 italic dark:text-slate-400">
              Goal: {pillar.goal}
            </p>
          </section>
        );
      })}
    </div>
  );
}
