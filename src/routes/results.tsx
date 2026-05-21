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
  SEVERITY_LABELS,
  stageFor,
  STAGES,
  type CategoryKey,
} from "@/lib/assessment";
import { loadAssessment, type SavedAssessment } from "@/lib/store";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis } from "recharts";
import { AlertTriangle, ArrowLeft, Download, Sparkles } from "lucide-react";

export const Route = createFileRoute("/results")({
  component: ResultsPage,
});

const severityTone: Record<string, string> = {
  critical: "bg-destructive/15 text-destructive border-destructive/30",
  high: "bg-accent/40 text-foreground border-accent/50",
  medium: "bg-primary/15 text-foreground border-primary/30",
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
            category: c.short,
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
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold tracking-wider text-primary">تقرير النضج</div>
            <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">{data.companyName || "شركتك"}</h1>
            <div className="mt-2 text-sm text-muted-foreground">
              {data.industry} · {data.employees} موظف · {new Date(data.completedAt).toLocaleDateString("ar-DZ")}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              <Download className="me-2 h-4 w-4" /> تصدير PDF
            </Button>
            <Button asChild>
              <Link to="/roadmap">عرض خارطة الطريق <ArrowLeft className="ms-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 rounded-3xl border border-border bg-gradient-to-br from-primary to-primary/70 text-primary-foreground p-8 shadow-sm">
            <div className="text-xs tracking-wider opacity-80">النضج الإجمالي</div>
            <div className="mt-3 flex items-baseline gap-2">
              <div className="text-6xl font-extrabold tracking-tight">{score}</div>
              <div className="text-sm opacity-80">/ 100</div>
            </div>
            <div className="mt-4 inline-flex items-center rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-bold">
              المرحلة: {stage.label}
            </div>
            <p className="mt-5 text-sm opacity-90 leading-relaxed">{stage.blurb}</p>

            <div className="mt-6">
              <div className="flex gap-1">
                {STAGES.map((s) => (
                  <div key={s.key} className={`h-1.5 flex-1 rounded-full ${s.key === stage.key ? "bg-primary-foreground" : "bg-primary-foreground/25"}`} />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[10px] tracking-wider opacity-70">
                <span>حِرفيّة</span>
                <span>قابلة للتوسّع</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold">النضج التشغيلي حسب البُعد</div>
                <div className="text-xs text-muted-foreground">كلما ارتفع المؤشر زاد النضج.</div>
              </div>
              <Badge variant="secondary" className="text-xs">6 أبعاد</Badge>
            </div>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radar} outerRadius="78%">
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="category" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} stroke="var(--border)" />
                  <Radar dataKey="value" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.35} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => {
            const v = categoryScore(c.key, data.answers);
            return (
              <div key={c.key} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold">{c.label}</div>
                  <div className="text-sm font-extrabold text-foreground">{v}</div>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-gradient-to-l from-primary to-primary/60" style={{ width: `${v}%` }} />
                </div>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{c.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs font-bold tracking-wider text-primary">تحليل الاختناقات</div>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight">ما الذي يُعيق شركتك</h2>
            </div>
            <Badge variant="secondary" className="text-xs">{bottlenecks.length} اختناق</Badge>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {bottlenecks.map((b) => (
              <div key={b.title} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${severityTone[b.severity]}`}>
                    <AlertTriangle className="h-3 w-3" /> {SEVERITY_LABELS[b.severity]}
                  </div>
                  <div className="text-xs text-muted-foreground">الاستعجال · {b.urgency}</div>
                </div>
                <div className="mt-3 font-bold">{b.title}</div>
                <div className="mt-1 text-xs tracking-wider text-muted-foreground">الأثر</div>
                <div className="text-sm">{b.impact}</div>
                <div className="mt-3 rounded-xl border border-primary/30 bg-primary/10 p-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <Sparkles className="h-3.5 w-3.5 text-primary" /> التوصية
                  </div>
                  <div className="mt-1 text-sm">{b.recommendation}</div>
                </div>
              </div>
            ))}
            {bottlenecks.length === 0 && (
              <div className="md:col-span-2 rounded-2xl border border-border bg-card p-8 text-center">
                <div className="text-lg font-bold">لا توجد اختناقات حرجة</div>
                <div className="mt-1 text-sm text-muted-foreground">عملياتك ناضجة عبر كل الأبعاد. ركّز على التحسين والتوسّع.</div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 rounded-3xl border border-border bg-card p-8 md:p-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-lg font-bold">جاهز لخارطة الطريق المخصّصة؟</div>
            <div className="text-sm text-muted-foreground">إجراءات ملموسة عبر الفوري و30 و90 يوماً وما بعدها.</div>
          </div>
          <Button asChild size="lg">
            <Link to="/roadmap">افتح خارطة الطريق <ArrowLeft className="ms-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export type _CategoryKey = CategoryKey;
