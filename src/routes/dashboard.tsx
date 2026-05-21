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
  SEVERITY_LABELS,
  stageFor,
} from "@/lib/assessment";
import { loadAssessment, type SavedAssessment } from "@/lib/store";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, PolarRadiusAxis } from "recharts";
import { ArrowLeft, Send, Sparkles, TrendingUp } from "lucide-react";

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
        <div className="text-xs font-bold tracking-wider text-primary">لوحة التحكم</div>
        <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">لم يتم التشخيص بعد</h1>
        <p className="mt-3 text-muted-foreground">أكمل تقييم النضج لتفتح لوحة المؤسّس والاختناقات وخارطة الطريق.</p>
        <div className="mt-8">
          <Button asChild size="lg"><Link to="/assessment">ابدأ التشخيص <ArrowLeft className="ms-2 h-4 w-4" /></Link></Button>
        </div>
      </div>
    </div>
  );
}

function DashboardContent({ data }: { data: SavedAssessment }) {
  const score = overallScore(data.answers);
  const stage = stageFor(score);
  const leadership = categoryScore("leadership", data.answers);
  const team = categoryScore("team", data.answers);
  const scalability = categoryScore("scalability", data.answers);
  const bottlenecks = detectBottlenecks(data.answers);
  const roadmap = generateRoadmap(data.answers).slice(0, 4);

  const radar = useMemo(
    () =>
      CATEGORIES.map((c) => ({
        category: c.short,
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
            <div className="text-xs font-bold tracking-wider text-primary">لوحة المؤسّس</div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
              {data.companyName || "شركتك"}
              <Badge variant="secondary" className="ms-3 align-middle text-xs">{stage.label}</Badge>
            </h1>
            <div className="mt-1 text-sm text-muted-foreground">آخر تحديث {new Date(data.completedAt).toLocaleDateString("ar-DZ")}</div>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline"><Link to="/assessment">إعادة التشخيص</Link></Button>
            <Button asChild><Link to="/roadmap">افتح خارطة الطريق <ArrowLeft className="ms-2 h-4 w-4" /></Link></Button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Kpi title="النضج الإجمالي" value={score} suffix="/100" hint={stage.label} highlight />
          <Kpi title="مؤشر الاعتماد" value={100 - leadership} suffix="/100" hint="كلما انخفض كان أفضل" invert />
          <Kpi title="مؤشر التفويض" value={team} suffix="/100" hint="وضوح الأدوار والمساءلة" />
          <Kpi title="مؤشر التوسّع" value={scalability} suffix="/100" hint="الجاهزية للمرحلة التالية" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold">رادار النضج التشغيلي</div>
                <div className="text-xs text-muted-foreground">عبر الأبعاد الستة</div>
              </div>
              <Link to="/results" className="text-xs font-bold text-foreground hover:text-primary">عرض التقرير ←</Link>
            </div>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radar} outerRadius="78%">
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="category" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                  <PolarRadiusAxis domain={[0, 100]} stroke="var(--border)" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
                  <Radar dataKey="value" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.35} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <AIAdvisor stage={stage.label} score={score} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold">أهم الاختناقات</div>
              <Link to="/results" className="text-xs font-bold text-foreground hover:text-primary">كل الرؤى ←</Link>
            </div>
            <div className="mt-4 space-y-3">
              {bottlenecks.slice(0, 4).map((b) => (
                <div key={b.title} className="rounded-2xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-bold">{b.title}</div>
                    <Badge variant="outline" className="text-[10px] shrink-0">{SEVERITY_LABELS[b.severity]}</Badge>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{b.recommendation}</div>
                </div>
              ))}
              {bottlenecks.length === 0 && (
                <div className="text-sm text-muted-foreground">لا توجد اختناقات حرجة. أنت تتوسّع بشكل جيد.</div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold">الإجراءات القادمة</div>
              <Link to="/roadmap" className="text-xs font-bold text-foreground hover:text-primary">خارطة كاملة ←</Link>
            </div>
            <div className="mt-4 space-y-3">
              {roadmap.map((r) => (
                <div key={r.title} className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/15 text-foreground text-xs font-extrabold">
                    {r.priority}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-bold truncate">{r.title}</div>
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
    ? value < 30 ? "text-primary" : value < 60 ? "text-foreground" : "text-destructive"
    : value > 70 ? "text-primary" : value > 40 ? "text-foreground" : "text-destructive";

  return (
    <div className={`rounded-2xl border p-5 ${highlight ? "border-primary/40 bg-primary/10" : "border-border bg-card"}`}>
      <div className="text-xs tracking-wider text-muted-foreground">{title}</div>
      <div className="mt-2 flex items-baseline gap-1">
        <div className={`text-3xl font-extrabold tracking-tight ${tone}`}>{value}</div>
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

type Msg = { role: "user" | "assistant"; text: string };

const SUGGESTIONS = [
  "لماذا تعتمد شركتي عليّ؟",
  "كيف أفوّض العمليات؟",
  "بماذا أبدأ الهيكلة؟",
  "كيف أتوسّع دون فوضى؟",
];

function advisorAnswer(q: string, stage: string, score: number): string {
  const t = q.toLowerCase();
  if (q.includes("تعتمد") || q.includes("اعتماد") || t.includes("dependent")) {
    return `الاعتماد على المؤسّس يأتي عادةً من ثلاثة مصادر: (1) كل القرارات تمرّ عبرك، (2) لا توجد إجراءات موثّقة للعمل المتكرر، (3) لا توجد طبقة إدارية وسطى مفوَّضة. في مرحلتك الحالية (${stage}، ${score}/100)، ابدأ بكتابة 10 قرارات تتخذها وحدك هذا الأسبوع، ثم انقل 3 منها بمعايير مكتوبة.`;
  }
  if (q.includes("فوّض") || q.includes("فوض") || q.includes("تفويض")) {
    return `فوّض حسب نوع القرار لا حسب المهمة. وثّق مصفوفة صلاحيات القرار: من يقرّر، من يُستشار، من يُعلَم. ابدأ بقرارات متكررة منخفضة المخاطر (تسعير تحت X، موافقات تحت Y، توظيف حتى مستوى Z). راجع أسبوعياً لمدة 4 أسابيع قبل التوسيع.`;
  }
  if (q.includes("هيكل") || q.includes("بداي") || q.includes("ابدأ")) {
    return `الهيكلة بهذا الترتيب: (1) صلاحيات القرار والهيكل التنظيمي، (2) مراجعة قيادية أسبوعية، (3) 5 إجراءات SOP لأكثر الأعمال تكراراً، (4) لوحة مؤشرات من صفحة واحدة، (5) دليل توظيف وتأهيل. ما عدا ذلك تحسين سابق لأوانه.`;
  }
  if (q.includes("توسّع") || q.includes("توسع") || q.includes("نمو") || q.includes("فوضى")) {
    return `التوسّع يُضخّم ما تملكه أصلاً. قبل إضافة إيرادات أو موظفين، ركّب: طقساً أسبوعياً للمؤشرات، وضوحاً للأدوار، توثيق العمليات الأساسية، وطبقة إدارية وسطى. وإلا فإن النمو يضاعف الفوضى بنفس النسبة التي يضاعف بها الإيرادات.`;
  }
  if (q.includes("توظيف") || q.includes("وظف")) {
    return `وظّف بناءً على توصيف وظيفي مكتوب مع خطة تأهيل 30-60-90 وبطاقة تقييم واضحة. توظيفان أكثر رافعةً اليوم: مدير عمليات (يملك الإجراءات والطقوس) ومدير تجاري (يملك خط المبيعات والتوقّع).`;
  }
  return `في مرحلة ${stage} (${score}/100)، أعلى رافعة هي إخراج نفسك من قرار متكرر واحد كل أسبوع، مع بناء النظام الذي يحلّ محلّك. ركّز على الطقوس (مراجعة أسبوعية)، المخرجات (إجراءات، لوحات مؤشرات)، والوضوح (أدوار، صلاحيات قرار) — بهذا الترتيب.`;
}

function AIAdvisor({ stage, score }: { stage: string; score: number }) {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", text: `أنا مستشارك الاستراتيجي. اسألني عن التوسّع والتفويض والهيكلة. مرحلتك الحالية: ${stage} (${score}/100).` },
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
          <div className="text-sm font-bold">المستشار الذكي</div>
          <div className="text-xs text-muted-foreground">مدرّب تشغيلي · 24/7</div>
        </div>
      </div>

      <div className="mt-4 flex-1 space-y-3 max-h-72 overflow-y-auto pe-1">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${
              m.role === "user"
                ? "ms-6 bg-primary text-primary-foreground"
                : "me-6 bg-background border border-border"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {SUGGESTIONS.map((s) => (
          <button key={s} onClick={() => ask(s)} className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] text-muted-foreground hover:border-primary/50 hover:text-foreground transition">
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); ask(input); }}
        className="mt-3 flex gap-2"
      >
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="اسأل مستشارك…" />
        <Button type="submit" size="icon" aria-label="إرسال"><Send className="h-4 w-4" /></Button>
      </form>
    </div>
  );
}
