export type CategoryKey =
  | "leadership"
  | "operations"
  | "team"
  | "commercial"
  | "financial"
  | "scalability";

export type Question = {
  id: string;
  category: CategoryKey;
  text: string;
  /** higher answer = more mature */
  inverted?: boolean;
};

export const CATEGORIES: { key: CategoryKey; label: string; description: string }[] = [
  { key: "leadership", label: "Leadership Dependency", description: "How much does the business rely on the founder?" },
  { key: "operations", label: "Operations", description: "Are workflows documented and standardized?" },
  { key: "team", label: "Team Structure", description: "Role clarity, accountability and delegation." },
  { key: "commercial", label: "Commercial System", description: "Predictable sales, CRM and customer tracking." },
  { key: "financial", label: "Financial Visibility", description: "Dashboards, KPIs and profitability clarity." },
  { key: "scalability", label: "Scalability Readiness", description: "Process maturity and management layers." },
];

export const QUESTIONS: Question[] = [
  // Leadership (inverted: high = founder-dependent => low maturity)
  { id: "L1", category: "leadership", text: "Decisions stop when the founder is absent.", inverted: true },
  { id: "L2", category: "leadership", text: "Most strategic & operational calls are made by the founder.", inverted: true },
  { id: "L3", category: "leadership", text: "Managers are empowered to decide within clear boundaries." },
  { id: "L4", category: "leadership", text: "The founder could take a 2-week disconnected vacation without disruption." },

  // Operations
  { id: "O1", category: "operations", text: "Core processes are documented as SOPs accessible to the team." },
  { id: "O2", category: "operations", text: "Work is standardized — the same task is done the same way by everyone." },
  { id: "O3", category: "operations", text: "Production / service delivery depends on specific individuals.", inverted: true },
  { id: "O4", category: "operations", text: "Recurring issues are tracked and resolved systemically." },

  // Team
  { id: "T1", category: "team", text: "Every role has a clear written job description and accountabilities." },
  { id: "T2", category: "team", text: "Reporting lines and decision rights are unambiguous." },
  { id: "T3", category: "team", text: "Coordination across teams happens through rituals (weekly, daily standups…)." },
  { id: "T4", category: "team", text: "The team waits for the founder to unblock tasks.", inverted: true },

  // Commercial
  { id: "C1", category: "commercial", text: "Sales pipeline is predictable month over month." },
  { id: "C2", category: "commercial", text: "A CRM is used consistently to track leads and customers." },
  { id: "C3", category: "commercial", text: "Sales follow a documented process from lead to close." },
  { id: "C4", category: "commercial", text: "Customer retention and follow-up are systematized." },

  // Financial
  { id: "F1", category: "financial", text: "We have live dashboards for revenue, cash and margins." },
  { id: "F2", category: "financial", text: "Key KPIs are reviewed in a recurring management meeting." },
  { id: "F3", category: "financial", text: "Profitability per product / service / client is visible." },
  { id: "F4", category: "financial", text: "Financial reporting is reactive and ad-hoc.", inverted: true },

  // Scalability
  { id: "S1", category: "scalability", text: "Hiring follows a structured process with onboarding playbooks." },
  { id: "S2", category: "scalability", text: "A middle-management layer exists between founder and execution." },
  { id: "S3", category: "scalability", text: "Processes can absorb 2× volume without breaking." },
  { id: "S4", category: "scalability", text: "Org chart and growth plan for the next 12 months exists." },
];

export type Answers = Record<string, number>; // 0..4 (Strongly disagree → Strongly agree)

export const SCALE = [
  { value: 0, label: "Strongly disagree" },
  { value: 1, label: "Disagree" },
  { value: 2, label: "Neutral" },
  { value: 3, label: "Agree" },
  { value: 4, label: "Strongly agree" },
];

export function scoreAnswer(q: Question, value: number): number {
  const v = q.inverted ? 4 - value : value;
  return (v / 4) * 100;
}

export function categoryScore(category: CategoryKey, answers: Answers): number {
  const qs = QUESTIONS.filter((q) => q.category === category);
  const answered = qs.filter((q) => answers[q.id] !== undefined);
  if (!answered.length) return 0;
  const sum = answered.reduce((acc, q) => acc + scoreAnswer(q, answers[q.id]), 0);
  return Math.round(sum / answered.length);
}

export function overallScore(answers: Answers): number {
  const scores = CATEGORIES.map((c) => categoryScore(c.key, answers));
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

export type MaturityStage = {
  key: string;
  label: string;
  range: [number, number];
  blurb: string;
};

export const STAGES: MaturityStage[] = [
  { key: "artisan", label: "Artisan", range: [0, 20], blurb: "The business runs on craft, intuition and constant founder presence." },
  { key: "founder", label: "Founder-Centric", range: [21, 40], blurb: "Early structure exists, but everything flows through the founder." },
  { key: "structured", label: "Structured SME", range: [41, 60], blurb: "Roles and basic processes are in place; coordination is improving." },
  { key: "process", label: "Process-Driven", range: [61, 80], blurb: "Workflows, KPIs and delegation make the company resilient without the founder." },
  { key: "scalable", label: "Scalable Organization", range: [81, 100], blurb: "Systems, management layers and data enable predictable scaling." },
];

export function stageFor(score: number): MaturityStage {
  return STAGES.find((s) => score >= s.range[0] && score <= s.range[1]) ?? STAGES[0];
}

export type Bottleneck = {
  category: CategoryKey;
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  impact: string;
  recommendation: string;
  urgency: "Now" | "30 days" | "90 days";
};

export function detectBottlenecks(answers: Answers): Bottleneck[] {
  const out: Bottleneck[] = [];
  const s = (k: CategoryKey) => categoryScore(k, answers);
  const sev = (score: number): Bottleneck["severity"] =>
    score < 25 ? "critical" : score < 45 ? "high" : score < 65 ? "medium" : "low";

  const lib: Record<CategoryKey, Omit<Bottleneck, "category" | "severity" | "urgency">> = {
    leadership: {
      title: "Your business is highly dependent on founder decisions.",
      impact: "Decision bottleneck slows execution and creates fragility when you're absent.",
      recommendation: "Define decision rights, delegate 3 recurring decisions to managers this month.",
    },
    operations: {
      title: "Operations are largely undocumented.",
      impact: "Quality varies by person, onboarding is slow, scaling multiplies chaos.",
      recommendation: "Document the 5 most repeated workflows as one-page SOPs with owners.",
    },
    team: {
      title: "Team coordination lacks structure.",
      impact: "Tasks fall between roles; founder becomes the human router.",
      recommendation: "Publish a role chart and install a weekly 30-min operations review.",
    },
    commercial: {
      title: "Commercial processes are reactive.",
      impact: "Revenue is unpredictable, follow-up is inconsistent, leads leak.",
      recommendation: "Adopt a lightweight CRM and define a 5-stage sales pipeline this month.",
    },
    financial: {
      title: "Financial visibility is limited.",
      impact: "Decisions rely on gut feel; profitability per client/product is unclear.",
      recommendation: "Build a 1-page weekly KPI dashboard: revenue, cash, margin, AR.",
    },
    scalability: {
      title: "Organization is not ready to scale.",
      impact: "Growth will magnify current inefficiencies and burnout.",
      recommendation: "Design the 12-month org chart and identify the 2 next critical hires.",
    },
  };

  (Object.keys(lib) as CategoryKey[]).forEach((k) => {
    const score = s(k);
    if (score < 70) {
      const severity = sev(score);
      out.push({
        category: k,
        ...lib[k],
        severity,
        urgency: severity === "critical" || severity === "high" ? "Now" : severity === "medium" ? "30 days" : "90 days",
      });
    }
  });

  return out.sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 } as const;
    return order[a.severity] - order[b.severity];
  });
}

export type RoadmapItem = {
  horizon: "Immediate" | "30 days" | "90 days" | "6 months" | "1 year";
  title: string;
  description: string;
  priority: "P0" | "P1" | "P2";
  impact: 1 | 2 | 3 | 4 | 5;
  complexity: 1 | 2 | 3 | 4 | 5;
  category: CategoryKey;
};

const ROADMAP_LIBRARY: Record<CategoryKey, RoadmapItem[]> = {
  leadership: [
    { horizon: "Immediate", title: "Map your decision bottlenecks", description: "List the 10 decisions only you make. Mark which can be delegated.", priority: "P0", impact: 5, complexity: 1, category: "leadership" },
    { horizon: "30 days", title: "Install a weekly leadership review", description: "60-minute weekly meeting: priorities, blockers, KPIs, decisions.", priority: "P0", impact: 5, complexity: 2, category: "leadership" },
    { horizon: "90 days", title: "Delegate 3 recurring decisions", description: "Transfer with written decision criteria and review cadence.", priority: "P1", impact: 4, complexity: 3, category: "leadership" },
  ],
  operations: [
    { horizon: "30 days", title: "Document the top 5 SOPs", description: "One-page SOPs for the most repeated workflows. Assign owners.", priority: "P0", impact: 5, complexity: 2, category: "operations" },
    { horizon: "90 days", title: "Standardize delivery workflow", description: "Single end-to-end process from order intake to delivery.", priority: "P1", impact: 4, complexity: 3, category: "operations" },
    { horizon: "6 months", title: "Quality control checkpoints", description: "Install 3 quality gates with measurable acceptance criteria.", priority: "P2", impact: 3, complexity: 3, category: "operations" },
  ],
  team: [
    { horizon: "Immediate", title: "Publish org chart & accountabilities", description: "Make roles, owners and reporting lines explicit and visible.", priority: "P0", impact: 4, complexity: 1, category: "team" },
    { horizon: "30 days", title: "Introduce a daily 15-min standup", description: "Sync blockers, priorities and dependencies across the team.", priority: "P1", impact: 3, complexity: 1, category: "team" },
    { horizon: "6 months", title: "Hire / promote middle management", description: "Add a layer between founder and execution.", priority: "P1", impact: 5, complexity: 4, category: "team" },
  ],
  commercial: [
    { horizon: "30 days", title: "Adopt a CRM and load active pipeline", description: "Pick one CRM. Migrate active deals. Define stages.", priority: "P0", impact: 5, complexity: 2, category: "commercial" },
    { horizon: "90 days", title: "Define a 5-stage sales process", description: "Lead → Qualify → Proposal → Negotiation → Close. With criteria.", priority: "P1", impact: 4, complexity: 2, category: "commercial" },
    { horizon: "6 months", title: "Customer retention playbook", description: "Post-sale check-ins, NPS, upsell cadence.", priority: "P2", impact: 3, complexity: 3, category: "commercial" },
  ],
  financial: [
    { horizon: "30 days", title: "Weekly 1-page KPI dashboard", description: "Revenue, cash, AR, margin. Reviewed every Monday.", priority: "P0", impact: 5, complexity: 2, category: "financial" },
    { horizon: "90 days", title: "Profitability per client / product", description: "Allocate costs and surface real margin contributors.", priority: "P1", impact: 4, complexity: 3, category: "financial" },
    { horizon: "1 year", title: "Rolling 12-month forecast", description: "Cash flow forecast updated monthly to drive decisions.", priority: "P2", impact: 4, complexity: 4, category: "financial" },
  ],
  scalability: [
    { horizon: "90 days", title: "Design the 12-month org chart", description: "Map the company you want in 12 months. Identify gaps.", priority: "P1", impact: 5, complexity: 2, category: "scalability" },
    { horizon: "6 months", title: "Structured hiring & onboarding", description: "Job specs, scorecards, 30-60-90 onboarding plans.", priority: "P1", impact: 4, complexity: 3, category: "scalability" },
    { horizon: "1 year", title: "Annual strategic planning ritual", description: "Yearly off-site → quarterly OKRs → weekly KPIs.", priority: "P2", impact: 5, complexity: 3, category: "scalability" },
  ],
};

export function generateRoadmap(answers: Answers): RoadmapItem[] {
  const items: RoadmapItem[] = [];
  CATEGORIES.forEach((c) => {
    const score = categoryScore(c.key, answers);
    const lib = ROADMAP_LIBRARY[c.key];
    if (score < 40) items.push(...lib);
    else if (score < 65) items.push(...lib.slice(0, 2));
    else items.push(lib[0]);
  });
  const horizonOrder: RoadmapItem["horizon"][] = ["Immediate", "30 days", "90 days", "6 months", "1 year"];
  return items.sort((a, b) => horizonOrder.indexOf(a.horizon) - horizonOrder.indexOf(b.horizon));
}