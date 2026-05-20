import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import {
  ArrowRight,
  Activity,
  Compass,
  Gauge,
  LineChart as LineChartIcon,
  Layers,
  Network,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

const features = [
  { icon: Compass, title: "Organizational Diagnosis", desc: "A guided multi-step assessment across 6 dimensions of operational maturity." },
  { icon: Gauge, title: "Maturity Scoring Engine", desc: "From Artisan to Scalable Organization. A 0–100 score with radar visualization." },
  { icon: Activity, title: "Bottleneck Detection", desc: "Prioritized insights on what's slowing your company and why." },
  { icon: Target, title: "Strategic Roadmap", desc: "Immediate, 30-day, 90-day, 6-month and 1-year actions tailored to you." },
  { icon: LineChartIcon, title: "Founder Dashboard", desc: "Dependency, delegation, scalability and process scores at a glance." },
  { icon: Sparkles, title: "AI Advisor", desc: "Strategic answers to your hardest scaling questions, in plain language." },
];

const stages = [
  { label: "Artisan", value: "0–20", tone: "bg-muted text-foreground" },
  { label: "Founder-Centric", value: "21–40", tone: "bg-accent/30 text-foreground" },
  { label: "Structured SME", value: "41–60", tone: "bg-primary/15 text-primary" },
  { label: "Process-Driven", value: "61–80", tone: "bg-primary/30 text-primary" },
  { label: "Scalable Organization", value: "81–100", tone: "bg-primary text-primary-foreground" },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      {/* HERO */}
      <section className="relative overflow-hidden bg-mesh">
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-24 md:pt-24 md:pb-32 grid gap-12 md:grid-cols-12 items-center">
          <div className="md:col-span-7">
            <Badge variant="secondary" className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs">
              <ShieldCheck className="mr-1.5 h-3 w-3 text-primary" /> Built for Algerian SMEs
            </Badge>
            <h1 className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
              Transform your company from <span className="text-gradient">chaos to scalable operations.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
              WebScale DZ helps founders build systems, delegation, operational clarity and sustainable growth — so the business no longer depends on you being in every meeting.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 px-6">
                <Link to="/assessment">
                  Start Assessment <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6">
                <a href="#how">Book Consultation</a>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> 5–250 employees</div>
              <div className="flex items-center gap-2"><Layers className="h-4 w-4 text-primary" /> 6 maturity dimensions</div>
              <div className="flex items-center gap-2"><Network className="h-4 w-4 text-primary" /> Tailored roadmap</div>
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="md:col-span-5">
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* MATURITY STAGES */}
      <section className="border-y border-border/60 bg-card/40">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Maturity Framework</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Five stages of operational maturity</h2>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              Every SME progresses through five distinct stages. Knowing where you stand is the first step to scaling without breaking.
            </p>
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-5">
            {stages.map((s, i) => (
              <div key={s.label} className="relative rounded-2xl border border-border bg-card p-4">
                <div className="text-xs text-muted-foreground">Stage {i + 1}</div>
                <div className="mt-2 font-semibold">{s.label}</div>
                <div className={`mt-3 inline-flex rounded-full px-2 py-0.5 text-xs ${s.tone}`}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Platform</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">
            A strategic operating system for your SME.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Diagnose your business, find what's blocking growth, and execute a calm, structured roadmap — all in one place.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group rounded-2xl border border-border bg-card p-6 transition hover:shadow-sm hover:border-primary/30">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <div className="mt-5 font-semibold">{f.title}</div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="border-t border-border/60 bg-card/40">
        <div className="mx-auto max-w-7xl px-6 py-20 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">How it works</div>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">From diagnosis to scalable operations in 4 steps.</h2>
            <ol className="mt-8 space-y-5">
              {[
                ["Diagnose", "Complete a 24-question assessment across 6 operational dimensions."],
                ["Score", "Get a maturity score, category breakdown and visual radar."],
                ["Prioritize", "See your top bottlenecks ranked by severity and urgency."],
                ["Execute", "Follow a tailored roadmap from immediate actions to 1 year."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-4">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">{i + 1}</div>
                  <div>
                    <div className="font-semibold">{t}</div>
                    <div className="text-sm text-muted-foreground">{d}</div>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-8">
              <Button asChild size="lg"><Link to="/assessment">Start your diagnosis <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-background p-6 shadow-sm">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Sample insight</div>
            <div className="mt-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="text-sm font-semibold text-primary">Leadership Dependency · Critical</div>
              <div className="mt-1 text-sm text-foreground">Your business is highly dependent on founder decisions.</div>
              <div className="mt-3 text-xs text-muted-foreground">Recommendation</div>
              <div className="text-sm">Delegate 3 recurring decisions to managers with written criteria within 30 days.</div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                ["Severity", "Critical"],
                ["Impact", "High"],
                ["Urgency", "Now"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-border bg-card p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
                  <div className="mt-1 text-sm font-semibold">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-primary text-primary-foreground p-10 md:p-14">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
          <div className="relative max-w-2xl">
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">Is your company scalable — or still dependent on you?</h3>
            <p className="mt-4 text-primary-foreground/80">Take the 10-minute assessment and get your maturity score, bottlenecks and roadmap immediately.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary" className="h-12 px-6">
                <Link to="/assessment">Start Assessment <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/dashboard">View dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function DashboardPreview() {
  const scores = [
    { label: "Leadership", value: 32 },
    { label: "Operations", value: 48 },
    { label: "Team", value: 55 },
    { label: "Commercial", value: 62 },
    { label: "Financial", value: 41 },
    { label: "Scalability", value: 38 },
  ];
  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-primary/15 via-accent/10 to-transparent blur-2xl" />
      <div className="relative rounded-3xl border border-border bg-card shadow-xl overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border bg-background/60 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
            <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
            <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
          </div>
          <div className="ml-3 text-xs text-muted-foreground">webscale.dz / dashboard</div>
        </div>
        <div className="p-5">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Overall Maturity</div>
              <div className="mt-1 flex items-baseline gap-2">
                <div className="text-4xl font-semibold tracking-tight">46</div>
                <div className="text-sm text-muted-foreground">/ 100</div>
              </div>
              <div className="mt-2 inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                Structured SME
              </div>
            </div>
            <div className="grid h-16 w-16 place-items-center rounded-full border-4 border-primary/20 text-primary text-sm font-semibold">
              46%
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {scores.map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="font-medium">{s.value}</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60" style={{ width: `${s.value}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-border bg-background p-3">
            <div className="flex items-center gap-2 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" /> AI Insight
            </div>
            <div className="mt-1 text-sm">
              Operations are undocumented. Start with 5 SOPs for your most repeated workflows.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
