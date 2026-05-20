import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, generateRoadmap, type RoadmapItem } from "@/lib/assessment";
import { loadAssessment, type SavedAssessment } from "@/lib/store";
import { ArrowRight, Calendar, Flag, Layers, Zap } from "lucide-react";

export const Route = createFileRoute("/roadmap")({
  component: RoadmapPage,
});

const HORIZONS: { key: RoadmapItem["horizon"]; label: string; icon: typeof Calendar }[] = [
  { key: "Immediate", label: "Immediate", icon: Zap },
  { key: "30 days", label: "30 days", icon: Calendar },
  { key: "90 days", label: "90 days", icon: Calendar },
  { key: "6 months", label: "6 months", icon: Layers },
  { key: "1 year", label: "1 year", icon: Flag },
];

const priorityTone: Record<string, string> = {
  P0: "bg-destructive/15 text-destructive border-destructive/30",
  P1: "bg-accent/30 text-foreground border-accent/40",
  P2: "bg-primary/10 text-primary border-primary/30",
};

function RoadmapPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<SavedAssessment | null>(null);

  useEffect(() => {
    const a = loadAssessment();
    if (!a) navigate({ to: "/assessment" });
    else setData(a);
  }, [navigate]);

  const items = useMemo(() => (data ? generateRoadmap(data.answers) : []), [data]);
  const grouped = useMemo(() => {
    const g: Record<string, RoadmapItem[]> = {};
    HORIZONS.forEach((h) => (g[h.key] = []));
    items.forEach((it) => g[it.horizon].push(it));
    return g;
  }, [items]);

  if (!data) return null;

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Strategic Roadmap</div>
            <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">
              {data.companyName || "Your"} growth plan
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              {items.length} prioritized actions across {HORIZONS.length} horizons — generated from your maturity diagnosis.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/results">Back to results</Link>
            </Button>
            <Button asChild>
              <Link to="/dashboard">Open dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-10 grid gap-8">
          {HORIZONS.map((h) => {
            const list = grouped[h.key];
            if (!list.length) return null;
            return (
              <section key={h.key}>
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                    <h.icon className="h-4 w-4" />
                  </div>
                  <h2 className="text-xl font-semibold tracking-tight">{h.label}</h2>
                  <Badge variant="secondary" className="text-xs">{list.length} action{list.length > 1 ? "s" : ""}</Badge>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {list.map((it) => {
                    const cat = CATEGORIES.find((c) => c.key === it.category)!;
                    return (
                      <div key={it.title} className="rounded-2xl border border-border bg-card p-5 transition hover:border-primary/30 hover:shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${priorityTone[it.priority]}`}>{it.priority}</div>
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{cat.label}</div>
                        </div>
                        <div className="mt-3 font-semibold leading-snug">{it.title}</div>
                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{it.description}</p>
                        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                          <Meter label="Impact" value={it.impact} tone="primary" />
                          <Meter label="Complexity" value={it.complexity} tone="muted" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Meter({ label, value, tone }: { label: string; value: number; tone: "primary" | "muted" }) {
  return (
    <div className="rounded-lg border border-border bg-background p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i < value ? (tone === "primary" ? "bg-primary" : "bg-foreground/60") : "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}