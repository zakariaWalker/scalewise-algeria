import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  CATEGORIES,
  categoryScore,
  detectBottlenecks,
  generateRoadmap,
  overallScore,
  stageFor,
} from "@/lib/assessment";
import { loadAssessment, type SavedAssessment } from "@/lib/store";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, PolarRadiusAxis } from "recharts";
import { ArrowRight, Send, Sparkles, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const [data, setData] = useState<SavedAssessment | null>(null);
  useEffect(() => setData(loadAssessment()), []);

  if (!data) return <EmptyState />;

  return <DashboardContent data={data} />;
}

function EmptyState() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Dashboard</div>
        <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">No diagnosis yet</h1>
        <p className="mt-3 text-muted-foreground">Complete the maturity assessment to unlock your founder dashboard, bottlenecks and roadmap.</p>
        <div className="mt-8">
          <Button asChild size="lg"><Link to="/assessment">Start assessment <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </div>
      </div>
    </div>
  );
}

function DashboardContent({ data }: { data: SavedAssessment }) {
  const score = overallScore(data.answers);
  const stage = stageFor(score);
  const leadership = categoryScore("leadership", data.answers);
  const operations = categoryScore("operations", data.answers);
  const team = categoryScore("team", data.answers);
  const scalability = categoryScore("scalability", data.answers);
  const bottlenecks = detectBottlenecks(data.answers);
  const roadmap = generateRoadmap(data.answers).slice(0, 4);

  const radar = useMemo(
    () =>
      CATEGORIES.map((c) => ({
        category: c.label.split(" ")[0],
        value: categoryScore(c.key, data.answers),
      })),
    [data],
  );

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Founder Dashboard</div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              {data.companyName || "Your company"}
              <Badge variant="secondary" className="ml-3 align-middle text-xs">{stage.label}</Badge>
            </h1>
            <div className="mt-1 text-sm text-muted-foreground">Updated {new Date(data.completedAt).toLocaleDateString()}</div>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline"><Link to="/assessment">Retake assessment</Link></Button>
            <Button asChild><Link to="/roadmap">Open roadmap <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </div>
        </div>

        {/* KPI widgets */}
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Kpi title="Overall maturity" value={score} suffix="/100" hint={stage.label} highlight />
          <Kpi title="Dependency score" value={100 - leadership} suffix="/100" hint="Lower is better" invert />
          <Kpi title="Delegation score" value={team} suffix="/100" hint="Role clarity & accountability" />
          <Kpi title="Scalability score" value={scalability} suffix="/100" hint="Ready for next stage" />
        </div>

        {/* Main grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Radar */}
          <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Operational maturity radar</div>
                <div className="text-xs text-muted-foreground">Across all six dimensions</div>
              </div>
              <Link to="/results" className="text-xs font-medium text-primary hover:underline">View report →</Link>
            </div>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radar} outerRadius="78%">
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="category" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                  <PolarRadiusAxis domain={[0, 100]} stroke="var(--border)" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
                  <Radar dataKey="value" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Advisor */}
          <AIAdvisor stage={stage.label} score={score} />
        </div>

        {/* Bottlenecks + Roadmap */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Top bottlenecks</div>
              <Link to="/results" className="text-xs font-medium text-primary hover:underline">All insights →</Link>
            </div>
            <div className="mt-4 space-y-3">
              {bottlenecks.slice(0, 4).map((b) => (
                <div key={b.title} className="rounded-2xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">{b.title}</div>
                    <Badge variant="outline" className="capitalize text-[10px]">{b.severity}</Badge>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{b.recommendation}</div>
                </div>
              ))}
              {bottlenecks.length === 0 && (
                <div className="text-sm text-muted-foreground">No critical bottlenecks. You're scaling well.</div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Next actions</div>
              <Link to="/roadmap" className="text-xs font-medium text-primary hover:underline">Full roadmap →</Link>
            </div>
            <div className="mt-4 space-y-3">
              {roadmap.map((r) => (
                <div key={r.title} className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                    {r.priority}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold truncate">{r.title}</div>
                      <Badge variant="secondary" className="shrink-0 text-[10px]">{r.horizon}</Badge>
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{r.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Kpi({
  title,
  value,
  suffix,
  hint,
  highlight,
  invert,
}: {
  title: string;
  value: number;
  suffix?: string;
  hint?: string;
  highlight?: boolean;
  invert?: boolean;
}) {
  const tone = invert
    ? value < 30
      ? "text-primary"
      : value < 60
        ? "text-foreground"
        : "text-destructive"
    : value > 70
      ? "text-primary"
      : value > 40
        ? "text-foreground"
        : "text-destructive";

  return (
    <div
      className={`rounded-2xl border p-5 ${
        highlight ? "border-primary/30 bg-primary/5" : "border-border bg-card"
      }`}
    >
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{title}</div>
      <div className="mt-2 flex items-baseline gap-1">
        <div className={`text-3xl font-semibold tracking-tight ${tone}`}>{value}</div>
        {suffix && <div className="text-xs text-muted-foreground">{suffix}</div>}
      </div>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, value)}%` }} />
      </div>
      {hint && (
        <div className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
          <TrendingUp className="h-3 w-3" /> {hint}
        </div>
      )}
    </div>
  );
}

/* ---------------- AI Advisor (lightweight, rules-based) ---------------- */

type Msg = { role: "user" | "assistant"; text: string };

const SUGGESTIONS = [
  "Why is my company dependent on me?",
  "How do I delegate operations?",
  "What should I structure first?",
  "How can I scale without chaos?",
];

function advisorAnswer(q: string, stage: string, score: number): string {
  const t = q.toLowerCase();
  if (t.includes("dependent") || t.includes("dependency") || t.includes("depend on me")) {
    return `Founder dependency typically comes from three places: (1) all decisions route through you, (2) no documented playbooks for recurring work, (3) no empowered middle layer. At your current stage (${stage}, score ${score}/100), start by listing the 10 decisions only you make this week, then transfer 3 with written criteria.`;
  }
  if (t.includes("delegate")) {
    return `Delegate by decision type, not by task. Document the decision rights matrix: who decides, who is consulted, who is informed. Begin with low-risk recurring decisions (pricing under X, approvals under Y, hiring up to level Z). Review weekly for 4 weeks before expanding scope.`;
  }
  if (t.includes("structure") || t.includes("first")) {
    return `Structure in this order: (1) Decision rights & org chart, (2) weekly leadership review, (3) 5 SOPs for the most repeated workflows, (4) a 1-page KPI dashboard, (5) hiring/onboarding playbook. Anything else is premature optimization.`;
  }
  if (t.includes("scale") || t.includes("chaos") || t.includes("grow")) {
    return `Scaling amplifies whatever you already have. Before adding revenue or headcount, install: a weekly KPI ritual, role clarity, documented core processes, and a middle-management layer. Otherwise growth multiplies the chaos by the same factor it multiplies revenue.`;
  }
  if (t.includes("hire") || t.includes("recruit")) {
    return `Hire against a written job spec with a 30-60-90 onboarding plan and clear scorecard. Your two best leverage hires today are likely: an Operations Manager (to own SOPs and rituals) and a Commercial Manager (to own pipeline and forecast).`;
  }
  return `At ${stage} (score ${score}/100), the highest-leverage move is to remove yourself from one recurring decision per week, while building the system that replaces you. Focus on rituals (weekly review), artifacts (SOPs, dashboards) and clarity (roles, decision rights) — in that order.`;
}

function AIAdvisor({ stage, score }: { stage: string; score: number }) {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", text: `I'm your strategic advisor. Ask me anything about scaling, delegation or structure. Your current stage is ${stage} (${score}/100).` },
  ]);
  const [input, setInput] = useState("");

  function ask(text: string) {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", text: advisorAnswer(text, stage, score) }]);
    }, 350);
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 flex flex-col">
      <div className="flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <div className="text-sm font-semibold">AI Strategic Advisor</div>
          <div className="text-xs text-muted-foreground">Operational coach · 24/7</div>
        </div>
      </div>

      <div className="mt-4 flex-1 space-y-3 max-h-72 overflow-y-auto pr-1">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${
              m.role === "user"
                ? "ml-6 bg-primary text-primary-foreground"
                : "mr-6 bg-background border border-border"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {SUGGESTIONS.map((s) => (
          <button key={s} onClick={() => ask(s)} className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] text-muted-foreground hover:border-primary/40 hover:text-foreground transition">
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="mt-3 flex gap-2"
      >
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask your advisor…" />
        <Button type="submit" size="icon" aria-label="Send"><Send className="h-4 w-4" /></Button>
      </form>
    </div>
  );
}