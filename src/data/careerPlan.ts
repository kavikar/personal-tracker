// Static reference content from Karthik's Career Upgrade Plan v2.
// This is a private planning tool, not a resume/portfolio artifact — the
// "don't use the name PLATE externally" rule applies to outward-facing
// materials, not to this internal tracker.

export interface CompStage {
  id: string;
  label: string;
  range: string;
  note: string;
}

export const profile = {
  currentCompLabel: '$120k',
  currentRole: 'Capgemini (Client: Inspire Brands) — QA Automation / SDET, IC on short-term projects',
  visaNote:
    "H-1B started May 2023. Capgemini has said they'll start filing PERM, but the timeline is unknown and out of your control.",
  urgency:
    'This is a real constraint, not a background detail. Start now, in parallel with skill-building — do not wait for PERM clarity.',
};

export const northStar = {
  primaryGoal:
    'Move from QA Automation / SDET consulting into a full-time product-company engineering role paying $175k+, while building skills that support $200k–$250k+ over time.',
  trajectory: 'Test Infrastructure → Developer Productivity / DevEx → AI Evaluation & Reliability',
  finalPrinciple:
    'The goal is not "become a better QA engineer." The goal is "become an engineer who specializes in reliability, test infrastructure, developer productivity, and AI evaluation."',
};

export const compLadder: CompStage[] = [
  { id: 'current', label: 'Current', range: '$120k', note: 'Capgemini baseline' },
  {
    id: 'next-immediate',
    label: 'Immediate next move',
    range: '$160k–$190k+',
    note: 'Leave consulting, move to product/FTE, increase engineering exposure — a 33–58% jump, but requires the positioning shift below to land.',
  },
  {
    id: 'next',
    label: 'Next move',
    range: '$190k–$230k+',
    note: 'After stronger infrastructure/engineering experience.',
  },
  {
    id: 'long-term',
    label: 'Longer term',
    range: '$230k–$300k+',
    note: 'Senior/Staff Test Infrastructure, Developer Productivity, Platform Engineering, AI Reliability, or Engineering Infrastructure.',
  },
];

export interface RoleTier {
  tier: number;
  title: string;
  description: string;
}

export const roleTiers: RoleTier[] = [
  {
    tier: 1,
    title: 'Software Engineer in Test / Senior SDET',
    description:
      'Best fit. Only target roles that are genuinely engineering-heavy: test infrastructure, test platforms, CI/CD, distributed systems, developer tooling, automation infrastructure, quality engineering. Avoid manual regression, basic Selenium scripting, test-case execution, or defect reporting roles.',
  },
  {
    tier: 2,
    title: 'Software Engineer — Test Infrastructure',
    description:
      'One of the strongest targets. Position as: "I build engineering systems that make software safer, faster, and easier to ship."',
  },
  {
    tier: 3,
    title: 'Developer Productivity / Developer Experience Engineer',
    description:
      'Longer-term target with strong compensation potential. Focus: CI/CD, internal developer tooling, build systems, test platforms, release automation, engineering productivity, observability.',
  },
  {
    tier: 4,
    title: 'AI Evaluation / AI Reliability / AI Quality Engineer',
    description:
      'Specialty to develop, not the immediate lead. Areas: LLM evaluation, model evaluation, agent reliability, RAG testing, tool-use evaluation, AI regression testing, evaluation infrastructure, AI observability.',
  },
  {
    tier: 5,
    title: 'General Software Engineer',
    description:
      "Apply selectively. Don't compete head-on with career backend engineers unless the role explicitly values testing/infrastructure experience.",
  },
];

export interface EvalStep {
  id: string;
  order: number;
  title: string;
  detail: string;
}

export const evaluationFramework: EvalStep[] = [
  {
    id: 'eval-hard-filters',
    order: 1,
    title: 'Hard filters first',
    detail:
      'Staffing-firm structure, comp opacity, lateral move disguised as growth, wrong title direction → auto-pass if any hit.',
  },
  {
    id: 'eval-domain-fit',
    order: 2,
    title: 'Domain fit',
    detail:
      'Mentions fleet/hardware/silicon/firmware/embedded? → auto-pass. Mentions services/APIs/CI-CD/developer tooling/product testing? → pursue.',
  },
  {
    id: 'eval-stack-gaps',
    order: 3,
    title: 'Stack gaps',
    detail: 'How far is this from current skillset — closeable in weeks or months?',
  },
  {
    id: 'eval-comp-band',
    order: 4,
    title: 'Compensation band',
    detail:
      '≥ $150k–$175k minimum bar. Titles like "Software Test Engineer" (e.g. at Google) span wildly different domains — review each posting individually, don\'t pattern-match on title alone.',
  },
];

export const evaluationAlsoRequired: string[] = [
  'FTE (not contract-to-hire disguised as FTE)',
  'H-1B compatibility confirmed',
  'Career growth path visible, not a dead-end QA silo',
];

export interface Pillar {
  id: string;
  order: number;
  name: string;
  priority: string;
  summary: string;
  skills: string[];
  goal: string;
}

export const pillars: Pillar[] = [
  {
    id: 'pillar-coding',
    order: 1,
    name: 'Coding',
    priority: 'Highest priority',
    summary:
      'Recover Java DSA fundamentals and rebuild clean software engineering practice. Target: solve typical LeetCode medium problems in ~45 minutes. Prep resource: NeetCode 150 in Java, starting from zero — no paid tier required.',
    skills: [
      'Arrays & strings',
      'Hash maps',
      'Stacks & queues',
      'Linked lists',
      'Trees',
      'Binary search',
      'Recursion',
      'Heaps',
      'Graphs',
      'Basic dynamic programming',
      'Clean code & OOP',
      'Design patterns where appropriate',
      'Concurrency',
      'Error handling',
      'API design',
      'Debugging',
    ],
    goal: "AI + Karthik > Karthik alone > AI alone. Don't stop using AI — change how it's used: ask for a critique of your architecture, or a problem to solve yourself, instead of a finished solution.",
  },
  {
    id: 'pillar-python',
    order: 2,
    name: 'Python',
    priority: 'High',
    summary:
      'Current: basic/scripting level. Target: engineering-capable. Goal: build an engineering tool in Python without AI generating the entire implementation.',
    skills: [
      'Fundamentals',
      'OOP',
      'Type hints',
      'pytest',
      'FastAPI',
      'requests / httpx',
      'asyncio',
      'Threading / multiprocessing concepts',
      'Logging',
      'Packaging',
      'Unit / integration testing',
    ],
    goal: 'Build an engineering tool in Python without AI generating the entire implementation.',
  },
  {
    id: 'pillar-cloud',
    order: 3,
    name: 'Cloud & Infrastructure',
    priority: 'Biggest current gap',
    summary: 'Progression: Linux → Docker → AWS → Kubernetes → CI/CD → Observability.',
    skills: [
      'Linux fundamentals',
      'Docker',
      'AWS: EC2, S3, IAM, VPC basics',
      'AWS: Lambda, ECS, ECR',
      'AWS: RDS, DynamoDB',
      'AWS: CloudWatch, SQS/SNS',
      'Kubernetes: Pods, Deployments, Services, Ingress',
      'Kubernetes: ConfigMaps, Secrets, Namespaces',
      'Kubernetes: resource limits, health checks, rolling deployments',
    ],
    goal: 'Hands-on fluency, not certs. Conceptual fluency on Kubernetes, not admin-level.',
  },
  {
    id: 'pillar-test-infra',
    order: 4,
    name: 'Test Infrastructure',
    priority: 'Major specialization',
    summary:
      'Understand: Developer → Pull Request → CI Pipeline → Test Orchestrator → Parallel Test Execution → Browser/Mobile/API → Results → Observability → Failure Analysis. Worth far more than another UI automation framework.',
    skills: [
      'Parallel execution',
      'Test sharding',
      'Retries',
      'Flaky-test detection',
      'Test selection',
      'Test environments',
      'Service virtualization',
      'Contract testing',
      'Test data management',
      'Artifact management',
      'CI optimization',
      'Failure triage',
    ],
    goal: 'Be able to explain and build the systems around test execution, not just write tests.',
  },
  {
    id: 'pillar-ai-eval',
    order: 5,
    name: 'AI Evaluation & Reliability',
    priority: 'Specialty layer',
    summary: 'A natural extension of a QA/testing mindset into AI systems.',
    skills: [
      'Tokens, embeddings, context windows',
      'Temperature, structured outputs, tool calling',
      'RAG, vector databases, agents',
      'Correctness & hallucination evaluation',
      'Relevance, toxicity, consistency',
      'Tool-use accuracy',
      'Regression, latency, cost evaluation',
    ],
    goal: 'Layer AI evaluation on top of the testing background — a specialization, not a replacement for the core path.',
  },
  {
    id: 'pillar-devex',
    order: 6,
    name: 'Developer Productivity / DevEx',
    priority: 'Long-term target',
    summary: 'Goal: make hundreds of engineers more productive.',
    skills: [
      'CI/CD',
      'Build systems',
      'Developer tooling',
      'Git internals',
      'Test infrastructure',
      'Release automation',
      'Observability',
      'Internal platforms',
      'Engineering metrics',
    ],
    goal: 'Make hundreds of engineers more productive.',
  },
];

export interface PortfolioItem {
  id: string;
  name: string;
  visibility: 'Private' | 'Public';
  description: string;
}

export const portfolio: PortfolioItem[] = [
  {
    id: 'plate',
    name: 'PLATE',
    visibility: 'Private',
    description:
      "Sole-developer, independently architected AI-assisted QA automation platform with genuine incremental history, real Jira/Xray + CI integrations, multi-brand scope (Arby's, Buffalo Wild Wings, Sonic within Inspire Brands). Keeps evolving as new needs surface. Never use the name \"PLATE\" externally — resume/portfolio materials should use a generic name like \"Unified QA Platform.\"",
  },
  {
    id: 'shuriken',
    name: 'shuriken',
    visibility: 'Public',
    description:
      "Sanitized, AI-assisted public rebuild of PLATE's core automation architecture on GitHub, built to demonstrate the framework design publicly.",
  },
  {
    id: 'play-left',
    name: 'play-left',
    visibility: 'Public',
    description:
      'Standalone, multi-brand Playwright web E2E framework on GitHub, split out of shuriken as a companion repo.',
  },
  {
    id: 'job-application-tracker',
    name: 'job-application-tracker',
    visibility: 'Public',
    description:
      'Standalone FastAPI + Postgres + Gmail-ingestion system with its own CI and design doc — a legitimate portfolio piece on its own, not folded into this tracker.',
  },
];

export const aiEvalExtension = {
  title: 'AI Test Evaluation extension (what to add next)',
  description:
    'Rather than a brand-new unrelated project, extend the existing PLATE/shuriken lineage toward AI evaluation.',
  flow: ['Test Prompts', 'Evaluation API', 'Multiple LLM Providers', 'Evaluators', 'Results / Dashboard'],
  stackNow: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'AWS', 'GitLab CI/CD'],
  stackLater: ['Kubernetes', 'Observability', 'LLM evaluation', 'Automated regression testing'],
  demonstrates:
    'Software engineering, APIs, databases, cloud, CI/CD, testing, architecture, AI, and reliability — while building on proven work instead of starting cold.',
  honestyRule:
    'Must stay honest and actually functional — no fabricated metrics, no invented adoption/user-count claims.',
};

export const resumeRules: string[] = [
  'Every employer line reads: "Capgemini (Client: [Company])"',
  'Do not use the name "PLATE" on resume/portfolio. Use a generic name instead (e.g., "Unified QA Platform")',
  'PLATE belongs in a personal/independent-projects section — not listed as an official Inspire Brands/Capgemini deliverable',
  'Do not cite specific commit counts (e.g., "113 of 117 commits") — instead describe having built the full architecture for the platform',
  'No fabricated adoption headcount or user-count claims, ever',
  'Technical-lead framing must stay honest: lead without formal HR authority, assigning work and setting direction for a 4–6 person offshore team',
  'LinkedIn headline should reflect engineering identity, not "Capgemini" or generic QA framing',
  'Avoid the phrase "vibe coder" entirely',
];

export const positioning = {
  avoid: 'Senior QA Automation Engineer',
  aim: 'Software Quality / Test Infrastructure Engineer, with growing specialization in Developer Productivity + AI Evaluation/Reliability',
  story:
    '"I build engineering systems that make software safer, faster, and easier to ship" — not "I automate test cases."',
  resumeSummary:
    "Alongside client delivery work, independently designs and builds a personal AI-assisted QA automation platform in personal time — closing tooling gaps the current engagement doesn't require, and keeping hands-on engineering skills sharp beyond day-to-day QA execution.",
  linkedinAbout:
    'My day-to-day client work is largely QA leadership and short-term project execution. To stay sharp as an engineer and keep pace with where testing is heading, I build and maintain my own AI-assisted QA platform on the side — real architecture, real integrations, evolving as I find new problems worth solving.',
  interviewAnswer:
    "My current role is mostly IC work on short-term projects and coordination — solid, but it doesn't stretch me technically the way I want. So I've been building my own thing outside of work: [Unified QA Platform], to keep learning and stay current instead of letting my skills plateau.",
  rule: 'Never open with "I\'m not challenged at my job" cold. Mention the scope gap only if asked why the platform exists on personal time — the platform itself is the headline. Lead with what was built, not with the scope complaint.',
};

export interface CompanyTier {
  tier: number;
  timeframe: string;
  companies: string[];
}

export const companyTiers: CompanyTier[] = [
  {
    tier: 1,
    timeframe: 'Now',
    companies: ['Confluent', 'Datadog', 'PagerDuty', 'Stripe', 'Twilio', 'Sauce Labs', 'BrowserStack', 'Tricentis'],
  },
  { tier: 2, timeframe: '~3–4 months, after NeetCode progress', companies: ['Amazon', 'Microsoft', 'Cloudflare', 'Atlassian'] },
  { tier: 3, timeframe: '~6–12 months', companies: ['Google', 'Meta'] },
];

export const channels: { name: string; note: string }[] = [
  { name: 'Direct company careers pages', note: 'Search "software engineer in test," not "QA"' },
  { name: 'LinkedIn', note: 'Job discovery, recruiters, referrals, hiring-manager networking — not just Easy Apply' },
  { name: 'levels.fyi', note: 'Compensation research, identify companies actually paying $175k+' },
  { name: 'Blind', note: 'Referral swaps' },
  { name: 'Greenhouse/Ashby', note: 'Startup postings' },
  { name: 'Wellfound', note: 'AI startups, infrastructure, dev tools, AI evaluation, SDET, platform engineering' },
  { name: 'Built In', note: 'Atlanta, remote, major tech hubs' },
  { name: 'Dice', note: 'Technical/infra/cloud/SDET (expect more consulting noise)' },
];

export const searchTitles: string[] = [
  'Software Engineer in Test',
  'Test Infrastructure Engineer',
  'Software Engineer — Test Infrastructure',
  'Developer Productivity Engineer',
  'Developer Infrastructure Engineer',
  'Quality Engineering Software Engineer',
  'AI Evaluation Engineer',
  'AI Reliability Engineer',
  'Software Engineer — Evaluation',
  'Test Systems Engineer',
];

export const searchCombos: string[] = [
  '"test infrastructure" Python CI/CD Kubernetes',
  '"developer productivity" CI/CD testing',
  '"AI evaluation" Python testing',
  '"test systems" distributed systems',
];

export const applicationVolumeTarget = '10–15 high-quality applications/week, each screened against the evaluation framework.';

export const avoidList: string[] = [
  'Get another generic QA certification — this is a documented avoidance pattern: the impulse to chase AI/AWS/Azure certs or credential tracks reliably shows up when higher-friction work (shipping code publicly, DSA practice, broad applications) stalls. Notice it and redirect to the actual work.',
  'Explore unrelated career pivots (pen testing, chip QE, product management, full relocation) as a substitute for executing the current plan — same avoidance pattern, different disguise',
  'Learn five new UI automation frameworks',
  'Become obsessed with Selenium',
  'Spend six months doing only LeetCode',
  'Try to become a generic SWE overnight',
  'Quit before having another offer',
  'Wait until "fully ready" to interview',
  'Let AI solve every coding exercise',
  'Apply indiscriminately to $200k jobs without the fit criteria above',
  'Fabricate anything on the resume — no invented metrics, no unverified tool claims, no scope inflation',
];

export const dontAbandonQA =
  'Most importantly: do not abandon QA. Your testing background is your moat. Add engineering depth on top of it.';

export interface PhaseStep {
  id: string;
  phase: string;
  title: string;
}

export const phaseMap: PhaseStep[] = [
  { id: 'phase-1', phase: 'Phase 1', title: 'Current QA/SDET (IC, short-term projects)' },
  { id: 'phase-2', phase: 'Phase 2', title: 'Senior SDET / Software Engineer in Test / Test Infrastructure' },
  { id: 'phase-3', phase: 'Phase 3', title: 'Test Infrastructure / Developer Productivity / Engineering Infrastructure' },
  { id: 'phase-4', phase: 'Phase 4', title: 'Senior / Staff Engineer' },
  { id: 'phase-5', phase: 'Phase 5', title: '$200k–$300k+ engineering career' },
];

export const biggestRisk = {
  title: "Career trajectory, compounded by a real visa timeline you don't control",
  detail:
    "Current trajectory: Automation → IC on short-term projects → coding rustiness compounding → harder engineering transition the longer it's deferred, made worse by PERM timeline uncertainty.",
  desired: '6+ years automation → Test Infrastructure → Engineering/DevEx → Senior/Staff Engineering.',
  bottleneck:
    'The real bottleneck, per prior analysis: positioning, not credentials. The resume currently reads as QA/SDET while target roles read as Platform/Infrastructure.',
  callToAction: 'Start the job search now while simultaneously rebuilding engineering skills. Do not wait until "ready."',
};

/** Weekly schedule blocks, seeded as recurring admin tasks. Friday is deliberately unscheduled (rest/buffer). */
export const weeklyScheduleBlocks: { weekday: number; title: string; notes: string }[] = [
  { weekday: 1, title: 'Study block: DSA / Java (1.5 hrs)', notes: 'NeetCode 150 in Java. Target: ~45 min per medium problem.' },
  { weekday: 2, title: 'Study block: Python / software engineering (1.5 hrs)', notes: 'Fundamentals, FastAPI, pytest, type hints, asyncio.' },
  { weekday: 3, title: 'Study block: AWS / Linux / Docker / Kubernetes (1.5 hrs)', notes: 'Hands-on, not certs.' },
  {
    weekday: 4,
    title: 'Study block: System design (1.5 hrs)',
    notes: 'Start with e.g. "design a distributed test execution platform."',
  },
  { weekday: 6, title: 'Portfolio project block (3 hrs)', notes: 'PLATE/shuriken AI-evaluation extension.' },
  { weekday: 0, title: 'Interview prep block (1 hr)', notes: 'Behavioral, coding, system design.' },
];

export interface RoadmapMonth {
  id: string;
  month: string;
  title: string;
  monthsFromNow: number;
  items: string[];
}

export const roadmap90: RoadmapMonth[] = [
  {
    id: 'month-1',
    month: 'Month 1',
    title: 'Reactivate',
    monthsFromNow: 1,
    items: [
      'Java: DSA, OOP, collections, concurrency basics',
      'Python: fundamentals, FastAPI, pytest',
      'Infrastructure: Linux, Docker, AWS fundamentals',
      'Career: update resume/LinkedIn per positioning rules, start applications, start low-stakes interviews for reps',
    ],
  },
  {
    id: 'month-2',
    month: 'Month 2',
    title: 'Build',
    monthsFromNow: 2,
    items: [
      'Extend PLATE/shuriken toward the AI evaluation project: Python → FastAPI → Database → Docker → CI/CD → AWS',
      'Continue DSA, system design, interviews',
    ],
  },
  {
    id: 'month-3',
    month: 'Month 3',
    title: 'Differentiate',
    monthsFromNow: 3,
    items: [
      'Add Kubernetes, observability, LLM evaluation',
      'Aggressively target Test Infrastructure, Developer Productivity, AI Reliability, Software Quality Engineering, Software Engineer in Test roles',
    ],
  },
];

export interface ActionGroup {
  id: string;
  title: string;
  daysFromNow: number;
  items: string[];
}

export const actionList: ActionGroup[] = [
  {
    id: 'this-week',
    title: 'This week',
    daysFromNow: 7,
    items: [
      'Update LinkedIn positioning (no Capgemini in headline, engineering-first framing)',
      'Create job alerts for the 10 target titles',
      'Update resume toward engineering/infrastructure framing — apply the PLATE naming rules exactly',
      'Apply to 10–15 carefully selected roles against the evaluation framework',
      'Start Java/DSA refresh (NeetCode 150)',
      'Start Python fundamentals',
      'Start Docker/AWS hands-on work',
      'Confirm current PERM filing status/timeline with Capgemini HR if possible',
      'Identify 5–10 target companies from the Tier 1 list',
    ],
  },
  {
    id: 'this-month',
    title: 'This month',
    daysFromNow: 30,
    items: [
      'Push PLATE/shuriken toward the AI-evaluation extension (foundation stage)',
      'Comfortable with Java mediums again',
      'Build a small Python API',
      'Containerize it with Docker',
      'Deploy something to AWS',
      'Start system-design practice',
      'Complete several real interviews (Tier 1 companies, treat as reps)',
    ],
  },
  {
    id: 'next-3-months',
    title: 'Next 3 months',
    daysFromNow: 90,
    items: [
      'Stronger Java, engineering-capable Python',
      'Practical AWS, Docker, Kubernetes fundamentals',
      'CI/CD depth, system-design foundation',
      'AI evaluation knowledge',
      'One strong, extended portfolio project (not a new one — the PLATE/shuriken lineage)',
      'Active interview experience across Tier 1 companies',
      'A materially stronger, honestly-positioned resume',
      'Applications focused on $175k+ engineering-oriented roles',
    ],
  },
];

/** The only quantitative goal seeding uses — explicitly stated in the plan, not invented. */
export const weeklyApplicationTarget = 12; // midpoint of the plan's stated "10-15 high-quality applications/week"

export const CAREER_PLAN_MARKER = '[career-plan]';
