import { useState } from 'react';
import { Button } from '../../components/Button';
import { Skeleton } from '../../components/Skeleton';
import { useAllEntries } from '../../db/hooks';
import { repository } from '../../db/repository';
import { todayKey } from '../../lib/dates';
import {
  aiEvalExtension,
  avoidList,
  biggestRisk,
  channels,
  companyTiers,
  compLadder,
  dontAbandonQA,
  evaluationAlsoRequired,
  evaluationFramework,
  northStar,
  phaseMap,
  portfolio,
  positioning,
  profile,
  resumeRules,
  roleTiers,
  searchCombos,
  searchTitles,
} from '../../data/careerPlan';
import { CopyBlock } from './CopyBlock';
import { importCareerPlan, isCareerPlanImported } from './importCareerPlan';
import { PillarsSection } from './PillarsSection';

function Card({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      {title && (
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</h2>
      )}
      {subtitle && (
        <p className="mt-0.5 mb-3 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
      )}
      {children}
    </section>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border-l-4 border-amber-500 bg-amber-50 px-3 py-2.5 text-sm text-slate-800 dark:bg-amber-950/30 dark:text-slate-200">
      {children}
    </div>
  );
}

function ImportCareerPlanBanner() {
  const entriesRaw = useAllEntries();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  if (entriesRaw === undefined) return <Skeleton className="h-16" />;

  const imported = isCareerPlanImported(entriesRaw);

  if (imported) {
    return (
      <Card>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Weekly schedule, action list, and 90-day roadmap tasks are set up as admin tasks on the
          calendar. Edit or delete them there like any other task.
        </p>
      </Card>
    );
  }

  return (
    <Card
      title="Set up the schedule and roadmap"
      subtitle="Creates the weekly schedule, action list, and 90-day roadmap as admin tasks on your calendar (recurring where the plan calls for it), plus one goal for the weekly application target."
    >
      <Button
        variant="primary"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            const summary = await importCareerPlan(repository, todayKey());
            setResult(
              `Added ${summary.scheduleBlocks} recurring schedule blocks, ${summary.actionItems} action items, ${summary.roadmapItems} roadmap items, and ${summary.goals} goal.`,
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? 'Setting up…' : 'Set up schedule & roadmap'}
      </Button>
      {result && <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-400">{result}</p>}
    </Card>
  );
}

export function PlanPage() {
  return (
    <section aria-label="Plan" className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Career Plan</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {northStar.primaryGoal}
        </p>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          Trajectory: {northStar.trajectory}
        </p>
      </div>

      <Callout>
        <strong>Urgency:</strong> {profile.visaNote} {profile.urgency}
      </Callout>

      <ImportCareerPlanBanner />

      <Card title="Compensation ladder" subtitle={`Current: ${profile.currentCompLabel} at ${profile.currentRole}`}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {compLadder.map((stage, i) => (
            <div
              key={stage.id}
              className={`rounded-md border p-3 ${
                i === 0
                  ? 'border-slate-900 bg-slate-50 dark:border-white dark:bg-slate-800'
                  : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/40'
              }`}
            >
              <div className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                {stage.label}
              </div>
              <div className="mt-0.5 text-base font-bold text-slate-900 dark:text-slate-100">
                {stage.range}
              </div>
              <div className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{stage.note}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Target role tiers">
        <div className="space-y-3">
          {roleTiers.map((t) => (
            <div key={t.tier} className="flex gap-3">
              <span className="h-fit shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                Tier {t.tier}
              </span>
              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {t.title}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{t.description}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Job posting evaluation framework" subtitle="Screen every posting in this order before applying">
        <ol className="space-y-3">
          {evaluationFramework.map((step) => (
            <li key={step.id} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {step.order}
              </span>
              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {step.title}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{step.detail}</div>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
          <div className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            Also required for every role
          </div>
          <ul className="space-y-1">
            {evaluationAlsoRequired.map((r, i) => (
              <li key={i} className="text-sm text-slate-600 dark:text-slate-400">
                • {r}
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <Card title="Skill pillars" subtitle="Not dozens of technologies. Six high-value pillars.">
        <PillarsSection />
      </Card>

      <Card title="Portfolio strategy" subtitle="Don't build ten tutorial projects. Extend the strong one you already have.">
        <div className="grid gap-3 sm:grid-cols-2">
          {portfolio.map((p) => (
            <div key={p.id} className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {p.name}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    p.visibility === 'Public'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {p.visibility}
                </span>
              </div>
              <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400">{p.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
          <div className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            {aiEvalExtension.title}
          </div>
          <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
            {aiEvalExtension.description}
          </p>
          <div className="mb-3 flex flex-wrap items-center gap-1.5 text-xs">
            {aiEvalExtension.flow.map((step, i) => (
              <span key={step} className="flex items-center gap-1.5">
                <span className="rounded-md bg-violet-100 px-2 py-1 font-medium text-violet-800 dark:bg-violet-950/50 dark:text-violet-300">
                  {step}
                </span>
                {i < aiEvalExtension.flow.length - 1 && (
                  <span className="text-slate-400">→</span>
                )}
              </span>
            ))}
          </div>
          <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
            {aiEvalExtension.demonstrates}
          </p>
          <Callout>{aiEvalExtension.honestyRule}</Callout>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Tiered company targeting">
          <div className="space-y-3">
            {companyTiers.map((t) => (
              <div key={t.tier}>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Tier {t.tier} ({t.timeframe})
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {t.companies.map((c) => (
                    <span
                      key={c}
                      className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Channels">
          <ul className="space-y-2">
            {channels.map((c) => (
              <li key={c.name} className="text-sm">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{c.name}</span>
                <span className="text-slate-500 dark:text-slate-400"> — {c.note}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="Search titles & combos">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {searchTitles.map((t) => (
            <span
              key={t}
              className="rounded-full bg-sky-100 px-2 py-0.5 text-xs text-sky-800 dark:bg-sky-950/50 dark:text-sky-300"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="space-y-1">
          {searchCombos.map((c) => (
            <code
              key={c}
              className="block w-fit rounded bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400"
            >
              {c}
            </code>
          ))}
        </div>
      </Card>

      <Card title="Resume & positioning rules" subtitle="Locked conventions — follow them exactly.">
        <ul className="space-y-1.5">
          {resumeRules.map((r, i) => (
            <li key={i} className="text-sm text-slate-700 dark:text-slate-300">
              • {r}
            </li>
          ))}
        </ul>

        <div className="mt-4 space-y-1 border-t border-slate-200 pt-4 text-sm dark:border-slate-800">
          <div>
            <span className="text-red-600 dark:text-red-400">Avoid: </span>
            <span className="text-slate-700 dark:text-slate-300">"{positioning.avoid}"</span>
          </div>
          <div>
            <span className="text-emerald-700 dark:text-emerald-400">Aim for: </span>
            <span className="text-slate-700 dark:text-slate-300">{positioning.aim}</span>
          </div>
          <div className="pt-1">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Story: </span>
            <span className="text-slate-600 dark:text-slate-400">{positioning.story}</span>
          </div>
        </div>

        <div className="mt-4 space-y-3 border-t border-slate-200 pt-4 dark:border-slate-800">
          <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
            "Why the side project" framing — lead with what was built, not the scope complaint
          </p>
          <CopyBlock label="Resume / portfolio summary line" text={positioning.resumeSummary} />
          <CopyBlock label="LinkedIn about framing" text={positioning.linkedinAbout} />
          <CopyBlock label="Interview answer" text={positioning.interviewAnswer} />
          <Callout>{positioning.rule}</Callout>
        </div>
      </Card>

      <Card title="What NOT to do">
        <ul className="space-y-1.5">
          {avoidList.map((a, i) => (
            <li key={i} className="text-sm text-slate-700 dark:text-slate-300">
              • {a}
            </li>
          ))}
        </ul>
        <div className="mt-3">
          <Callout>{dontAbandonQA}</Callout>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Phase map">
          <ol className="space-y-1.5">
            {phaseMap.map((p, i) => (
              <li key={p.id} className="flex items-center gap-2.5 text-sm">
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                    i === 0 ? 'bg-slate-900 dark:bg-white' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                />
                <span className={i === 0 ? 'font-semibold text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}>
                  <span className="font-semibold">{p.phase}:</span> {p.title}
                </span>
              </li>
            ))}
          </ol>
        </Card>

        <Card title="Biggest career risk" subtitle={biggestRisk.title}>
          <p className="mb-2 text-sm text-slate-700 dark:text-slate-300">{biggestRisk.detail}</p>
          <p className="mb-2 text-sm text-slate-700 dark:text-slate-300">{biggestRisk.bottleneck}</p>
          <Callout>{biggestRisk.callToAction}</Callout>
        </Card>
      </div>
    </section>
  );
}
