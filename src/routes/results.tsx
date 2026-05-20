import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CATEGORIES,
  categoryScore,
  detectBottlenecks,
  overallScore,
  stageFor,
  STAGES,
  type CategoryKey,
} from "@/lib/assessment";
import { loadAssessment, type SavedAssessment } from "@/lib/store";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis } from "recharts";
import { AlertTriangle, ArrowRight, Download, Sparkles } from "lucide-react";

export const Route = createFileRoute("/results")({
  component: ResultsPage,
});

const severityTone: Record<string, string> = {
  critical: "bg-destructive/15 text-destructive border-destructive/30",
  high: "bg-accent/30 text-foreground border-accent/40",
  medium: "bg-primary/10 text-primary border-primary/30",
  low: "bg-muted text-muted-foreground border-border",
};

function ResultsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<SavedAssessment | null>(null);

  useEffect(() => {
    const a = loadAssessment();
    if (!a) navigate({ to: "/assessment" });
    else setData(a);
  }, [navigate]);

  const score = useMemo(() => (data ? overallScore(data.answers) : 0), [data]);
  const stage = stageFor(score);
  const radar = useMemo(
    () =>
      data
        ? CATEGORIES.map((c) => ({
            category: c.label.split(" ")[0],
            value: categoryScore(c.key, data.answers),
            full: 100,
          }))
        : [],
    [data],
  );
  const bottlenecks = useMemo(() => (data ? detectBottlenecks(data.answers) : []), [data]);

  if (!data) return null;

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Maturity Report</div>
            <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">{data.companyName || "Your company"}</h1>
            <div className="mt-2 text-sm text-muted-foreground">
              {data.industry} · {data.employees} employees · {new Date(data.completedAt).toLocaleDateString()}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              <Download className="mr-2 h-4 w-4" /> Export PDF
            </Button>
            <Button asChild>
              <Link to="/roadmap">View roadmap <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>

        {/* Hero scorecard */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 rounded-3xl border border-border bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8 shadow-sm">
            <div className="text-xs uppercase tracking-wider opacity-80">Overall Maturity</div>
            <div className="mt-3 flex items-baseline gap-2">
              <div className="text-6xl font-semibold tracking-tight">{score}</div>
              <div className="text-sm opacity-80">/ 100</div>
            </div>
            <div className="mt-4 inline-flex items-center rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium">
              Stage: {stage.label}
            </div>
            <p className="mt-5 text-sm opacity-90 leading-relaxed">{stage.blurb}</p>

            {/* Stage strip */}
            <div className="mt-6">
              <div className="flex gap-1">
                {STAGES.map((s) => (
                  <div key={s.key} className={`h-1.5 flex-1 rounded-full ${s.key === stage.key ? "bg-accent" : "bg-primary-foreground/20"}`} />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wider opacity-70">
                <span>Artisan</span>
                <span>Scalable</span>
              </div>
            </div>
          </div>

          {/* Radar */}
          <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Operational maturity by dimension</div>
                <div className="text-xs text-muted-foreground">Higher is more mature.</div>
              </div>
              <Badge variant="secondary" className="text-xs">6 dimensions</Badge>
            </div>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radar} outerRadius="78%">
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="category" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} stroke="var(--border)" />
                  <Radar dataKey="value" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => {
            const v = categoryScore(c.key, data.answers);
            return (
              <div key={c.key} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">{c.label}</div>
                  <div className="text-sm font-semibold text-primary">{v}</div>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60" style={{ width: `${v}%` }} />
                </div>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{c.description}</p>
              </div>
            );
          })}
        </div>

        {/* Bottlenecks */}
        <div className="mt-12">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Bottleneck Analysis</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">What's holding your company back</h2>
            </div>
            <Badge variant="secondary" className="text-xs">{bottlenecks.length} detected</Badge>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {bottlenecks.map((b) => (
              <div key={b.title} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${severityTone[b.severity]}`}>
                    <AlertTriangle className="h-3 w-3" /> {b.severity}
                  </div>
                  <div className="text-xs text-muted-foreground">Urgency · {b.urgency}</div>
                </div>
                <div className="mt-3 font-semibold">{b.title}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Impact</div>
                <div className="text-sm">{b.impact}</div>
                <div className="mt-3 rounded-xl border border-primary/20 bg-primary/5 p-3">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
                    <Sparkles className="h-3.5 w-3.5" /> Recommendation
                  </div>
                  <div className="mt-1 text-sm">{b.recommendation}</div>
                </div>
              </div>
            ))}
            {bottlenecks.length === 0 && (
              <div className="md:col-span-2 rounded-2xl border border-border bg-card p-8 text-center">
                <div className="text-lg font-semibold">No critical bottlenecks detected</div>
                <div className="mt-1 text-sm text-muted-foreground">Your operations are mature across all dimensions. Focus on optimization and scale.</div>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-3xl border border-border bg-card p-8 md:p-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-lg font-semibold">Ready for your tailored roadmap?</div>
            <div className="text-sm text-muted-foreground">Concrete actions across immediate, 30, 90 days and beyond.</div>
          </div>
          <Button asChild size="lg">
            <Link to="/roadmap">Open strategic roadmap <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export type _CategoryKey = CategoryKey;