# Design Document: Personal Calendar Tracker

Status: **draft for review**. No application code is written until this document is confirmed.

## 1. Goals and constraints

- A calendar-centric tracker used daily to log entries across several categories on the same date grid.
- A public portfolio repository that reads as professional engineering work: clear architecture, incremental commits, tests, CI, containerization, documentation.
- Local-first for the MVP. No paid services. Deployable to a free tier for live demos.
- The stack must be realistic to understand, extend, and defend in an interview by an engineer with moderate frontend and working backend/Python experience.

## 2. Tech stack

| Concern | Choice | Why |
| --- | --- | --- |
| Language | TypeScript (strict) | Required by the brief. Category schemas become typed contracts instead of loose JSON. |
| UI | React 19 + Vite | The most widely understood SPA setup. Vite gives fast builds, a trivial Docker image, and zero-config Vercel deploys. |
| Styling | Tailwind CSS | Utility classes keep component files self-contained and avoid a design-system dependency to learn. |
| Routing | React Router v6 | Three routes (calendar, dashboard, search). Nothing heavier is needed. |
| Persistence | Dexie.js over IndexedDB | Real database semantics in the browser (indexes, transactions, versioned migrations) rather than a JSON blob in localStorage. Its repository layer is the seam a future backend replaces. |
| Validation | Zod | One schema per category drives form validation, runtime checks on stored data, and TypeScript types. Adding a category is adding a schema. |
| Dates | date-fns | Small, tree-shakeable, pure functions. All dates are stored as local `YYYY-MM-DD` strings to avoid timezone drift in streaks. |
| Unit tests | Vitest + Testing Library | Vite-native, fast, same config as the build. |
| E2E tests | Playwright | One smoke test covering add, edit, delete, persistence across reload. |
| Lint and format | ESLint (flat config) + Prettier | Configured in the first commits so every later commit passes CI. |
| CI | GitHub Actions | Lint, typecheck, unit tests, build on every push and PR. E2E as a separate job. |
| Container | Multi-stage Dockerfile (Node build, nginx serve) + docker-compose | Runnable with one command: `docker compose up`. |
| Deploy | Vercel | Free tier, preview deployment per PR, no build config needed. |
| Runtime | Node 22 LTS, npm | Matches the current Vite and Vercel defaults. |

Why not a backend now: every MVP feature is single-user and single-device. A FastAPI + Postgres service would double the surface area without changing what a reviewer sees in the UI. The data layer is written as a repository interface so a REST or sync backend can be dropped in later, and the README says so explicitly.

Why not Next.js: there is no server rendering, no API route, and no auth in the MVP. A plain SPA is easier to explain and its build output is a static folder, which keeps the Docker image and the deploy trivial.

## 3. Data model

Two persisted tables and a code-level category registry.

### 3.1 `entries` table

Every logged item, regardless of category, is one row.

```ts
interface Entry<TData = unknown> {
  id: string;            // uuid v4
  date: string;          // local calendar day, "YYYY-MM-DD", indexed
  category: CategoryKey; // "jobSearch" | "dsa" | "admin" | "habit", indexed
  data: TData;           // category-specific payload, validated by that category's Zod schema
  createdAt: string;     // ISO timestamp
  updatedAt: string;     // ISO timestamp
}
```

Indexes: `id` (primary), `date`, `category`, compound `[category+date]`.

Because `data` is an opaque payload validated in application code, adding a new category never changes the Dexie schema version and never touches rows of other categories. That satisfies the extensibility requirement.

### 3.2 `habits` table

Habits need a definition that outlives any single day, so they get their own table.

```ts
interface Habit {
  id: string;
  name: string;               // "Exercise", "Read 20 pages"
  kind: "boolean" | "numeric";
  unit?: string;              // "pages", "minutes" (numeric only)
  dailyTarget?: number;       // numeric only; a day counts toward the streak when value >= target
  archived: boolean;
  createdAt: string;
}
```

### 3.3 Category payloads

Each category owns one Zod schema. Fields marked `?` are optional.

| Category | Payload |
| --- | --- |
| Job Search | `company`, `role`, `status` (applied, screening, interview, offer, rejected, withdrawn), `link?`, `nextActionDate?`, `notes?` |
| DSA / Study | `title`, `link?`, `topics: string[]` (tags such as "two-pointers"), `difficulty` (easy, medium, hard), `minutesSpent`, `solved: boolean` |
| Immigration / Admin | `title`, `dueDate?`, `completed: boolean`, `recurrence?: { every: number; unit: "day" \| "week" \| "month" }`, `notes?` |
| Habit | `habitId`, `value: boolean \| number` |

Recurrence model for admin tasks: completing a task that has a recurrence creates the next occurrence with the due date advanced by the interval. There is no calendar rule engine. This is small enough to build, easy to explain, and covers "IELTS speaking practice every 2 days".

### 3.4 Category registry (code, not database)

```ts
interface CategoryDefinition<T> {
  key: CategoryKey;
  label: string;
  color: string;                                   // Tailwind token for calendar dots and badges
  schema: z.ZodType<T>;
  Form: React.ComponentType<FormProps<T>>;         // quick-entry and edit form
  summarize(entries: Entry<T>[], range: DateRange): SummaryCard; // dashboard rollup
  describe(entry: Entry<T>): string;               // one-line label in day panel and search
}
```

Registered in `src/categories/registry.ts`. Adding a category means adding one folder with a schema, a form, and a summarize function, then registering it.

### 3.5 Derived values (pure functions, unit tested)

- Streak: consecutive days ending today (or yesterday, if today has no entry yet) where the habit met its target.
- Weekly and monthly rollups: applications sent, interviews scheduled, follow-ups due in range, problems solved, minutes studied, admin tasks completed vs overdue, current and longest streak per habit.
- Week boundaries: Monday to Sunday.

## 4. Repository structure

```
personal-tracker/
├── .github/workflows/ci.yml
├── docs/
│   ├── DESIGN.md
│   └── screenshots/
├── e2e/                      # Playwright tests
├── public/
├── src/
│   ├── app/                  # router, providers, shell layout
│   ├── categories/           # one folder per category + registry.ts
│   │   ├── jobSearch/        # schema.ts, Form.tsx, summarize.ts, index.ts
│   │   ├── dsa/
│   │   ├── admin/
│   │   └── habits/
│   ├── db/                   # Dexie database, repository functions, migrations
│   ├── features/
│   │   ├── calendar/         # MonthView, WeekView, DayPanel
│   │   ├── dashboard/
│   │   └── search/
│   ├── lib/                  # dates.ts, streaks.ts, rollups.ts (pure, tested)
│   ├── components/           # shared UI primitives
│   └── test/                 # Vitest setup
├── Dockerfile
├── docker-compose.yml
├── vercel.json
├── eslint.config.js, .prettierrc, tsconfig.json, vite.config.ts, playwright.config.ts
├── LICENSE
└── README.md
```

## 5. Commit plan

Each commit is a working state that passes lint and tests once CI exists.

1. `docs: add design document and README skeleton`
2. `chore: scaffold Vite React TypeScript app`
3. `chore: configure ESLint, Prettier, and EditorConfig`
4. `test: add Vitest and Testing Library setup`
5. `ci: run lint, typecheck, tests, and build on push and PR`
6. `feat(db): add Dexie database with entries and habits tables`
7. `feat(lib): add date helpers with tests`
8. `feat(categories): add category registry and Zod schemas`
9. `feat(calendar): month view with per-day entry indicators`
10. `feat(calendar): week view and view switcher`
11. `feat(calendar): day panel with add, edit, and delete`
12. `feat(job-search): quick-entry form and summary`
13. `feat(dsa): quick-entry form and summary`
14. `feat(admin): task form with due date, completion, and recurrence`
15. `feat(habits): habit definitions, daily check-in, and streak calculation`
16. `feat(dashboard): weekly and monthly rollups per category`
17. `feat(search): filter entries by category, date range, and text`
18. `feat(app): navigation, empty states, and dev seed data`
19. `test(e2e): Playwright smoke test wired into CI`
20. `build: multi-stage Dockerfile and docker-compose`
21. `chore: add Vercel configuration`
22. `docs: complete README with screenshots and architecture overview`

## 6. Scope review: what is trimmed and why

| Brief item | Decision |
| --- | --- |
| Recurring admin tasks | Kept, but as "create next occurrence on completion", not a recurrence rule engine. |
| Search | Category + date range + case-insensitive text match on title, company, role, notes. No full-text index. |
| Follow-ups due | Modelled with `nextActionDate` and surfaced on the dashboard as "due this week". No notifications (stretch). |
| Screenshots | Generated with Playwright against seeded data so the README has them from day one. Replace with real ones later. |
| Integration tests | One Playwright smoke test. Deeper coverage stays at the unit level on the pure functions where the logic lives. |
| Edit forms | The same form component serves add and edit, so there is one form per category, not two. |

Everything else in the MVP list is in scope.

## 7. Stretch goals (out of scope for MVP)

- Auth and multi-device sync via a backend (FastAPI or a hosted Postgres) behind the existing repository interface.
- CSV and JSON export and import.
- Reminders for upcoming due items.
- Trend charts (applications per week, minutes studied per week).

## 8. Open assumptions to confirm

- Week starts on Monday.
- License: MIT.
- Commit author identity for the portfolio history (see review notes).
