import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import {
  ArrowLeft,
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
  { icon: Compass, title: "تشخيص تنظيمي", desc: "تقييم موجَّه متعدد الخطوات عبر 6 أبعاد للنضج التشغيلي." },
  { icon: Gauge, title: "محرّك قياس النضج", desc: "من الحِرفيّة إلى المؤسسة القابلة للتوسّع. نتيجة من 0 إلى 100 مع تصوّر راداري." },
  { icon: Activity, title: "كشف الاختناقات", desc: "رؤى مرتّبة حول ما يُبطئ شركتك ولماذا." },
  { icon: Target, title: "خارطة الطريق", desc: "إجراءات فورية، 30 يوم، 90 يوم، 6 أشهر وسنة، مفصّلة على مقاسك." },
  { icon: LineChartIcon, title: "لوحة المؤسّس", desc: "مؤشرات الاعتماد والتفويض والقابلية للتوسّع في لمحة." },
  { icon: Sparkles, title: "مستشار ذكي", desc: "إجابات استراتيجية على أصعب أسئلة التوسّع، بلغة بسيطة." },
];

const stages = [
  { label: "حِرفيّة", value: "0–20", tone: "bg-muted text-foreground" },
  { label: "متمحوِرة حول المؤسّس", value: "21–40", tone: "bg-accent/40 text-foreground" },
  { label: "مؤسسة منظَّمة", value: "41–60", tone: "bg-primary/20 text-primary-foreground" },
  { label: "موجَّهة بالعمليات", value: "61–80", tone: "bg-primary/40 text-primary-foreground" },
  { label: "قابلة للتوسّع", value: "81–100", tone: "bg-primary text-primary-foreground" },
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
              <ShieldCheck className="ms-0 me-1.5 h-3 w-3 text-primary" /> مصمَّمة لمسيّري الشركات في الجزائر
            </Badge>
            <h1 className="mt-5 text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.15]">
              حوّل شركتك من <span className="text-gradient">الفوضى إلى مؤسسة قابلة للتوسّع.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
              منصة WebScale DZ تساعد مسيّري الشركات على بناء الأنظمة والتفويض والوضوح التشغيلي والنموّ المستدام — حتى لا تعتمد الشركة على وجودك في كل اجتماع.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 px-6">
                <Link to="/assessment">
                  ابدأ التشخيص <ArrowLeft className="ms-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6">
                <a href="#how">احجز استشارة</a>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> من 5 إلى 250 موظف</div>
              <div className="flex items-center gap-2"><Layers className="h-4 w-4 text-primary" /> 6 أبعاد للنضج</div>
              <div className="flex items-center gap-2"><Network className="h-4 w-4 text-primary" /> خارطة مخصّصة</div>
            </div>
          </div>

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
              <div className="text-xs font-bold tracking-wider text-primary">إطار النضج</div>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">خمس مراحل للنضج التشغيلي</h2>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              كل مؤسسة صغيرة أو متوسطة تمرّ بخمس مراحل واضحة. معرفة موقعك هي الخطوة الأولى للتوسّع دون أن تنهار الأنظمة.
            </p>
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-5">
            {stages.map((s, i) => (
              <div key={s.label} className="relative rounded-2xl border border-border bg-card p-4">
                <div className="text-xs text-muted-foreground">المرحلة {i + 1}</div>
                <div className="mt-2 font-bold">{s.label}</div>
                <div className={`mt-3 inline-flex rounded-full px-2 py-0.5 text-xs ${s.tone}`}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl">
          <div className="text-xs font-bold tracking-wider text-primary">المنصة</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
            نظام تشغيل استراتيجي لمؤسستك.
          </h2>
          <p className="mt-4 text-muted-foreground">
            شخّص أعمالك، اكتشف ما يعيق نموّك، ونفّذ خارطة طريق منظّمة وهادئة — كل ذلك في مكان واحد.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group rounded-2xl border border-border bg-card p-6 transition hover:shadow-sm hover:border-primary/40">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <div className="mt-5 font-bold">{f.title}</div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="border-t border-border/60 bg-card/40">
        <div className="mx-auto max-w-7xl px-6 py-20 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <div className="text-xs font-bold tracking-wider text-primary">كيف تعمل</div>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">من التشخيص إلى مؤسسة قابلة للتوسّع في 4 خطوات.</h2>
            <ol className="mt-8 space-y-5">
              {[
                ["تشخيص", "أكمل تقييماً من 24 سؤالاً عبر 6 أبعاد تشغيلية."],
                ["تقييم", "احصل على نتيجة النضج وتفصيل بالأبعاد ورسم راداري."],
                ["أولويات", "شاهد أهم اختناقاتك مرتّبة حسب الخطورة والاستعجال."],
                ["تنفيذ", "اتبع خارطة طريق مخصّصة من الإجراءات الفورية حتى السنة."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-4">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-bold">{i + 1}</div>
                  <div>
                    <div className="font-bold">{t}</div>
                    <div className="text-sm text-muted-foreground">{d}</div>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-8">
              <Button asChild size="lg"><Link to="/assessment">ابدأ التشخيص <ArrowLeft className="ms-2 h-4 w-4" /></Link></Button>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-background p-6 shadow-sm">
            <div className="text-xs tracking-wider text-muted-foreground">رؤية نموذجية</div>
            <div className="mt-3 rounded-xl border border-primary/30 bg-primary/10 p-4">
              <div className="text-sm font-bold text-foreground">الاعتماد على القيادة · حرِج</div>
              <div className="mt-1 text-sm text-foreground">شركتك تعتمد بشكل كبير على قرارات المؤسّس.</div>
              <div className="mt-3 text-xs text-muted-foreground">التوصية</div>
              <div className="text-sm">فوّض 3 قرارات متكررة لمسؤولين بمعايير مكتوبة خلال 30 يوماً.</div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                ["الخطورة", "حرِج"],
                ["الأثر", "مرتفع"],
                ["الاستعجال", "فوراً"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-border bg-card p-3">
                  <div className="text-[10px] tracking-wider text-muted-foreground">{k}</div>
                  <div className="mt-1 text-sm font-bold">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-primary text-primary-foreground p-10 md:p-14">
          <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-accent/40 blur-3xl" />
          <div className="relative max-w-2xl">
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight">هل شركتك قابلة للتوسّع — أم لا تزال تعتمد عليك؟</h3>
            <p className="mt-4 text-primary-foreground/80">خذ التقييم في 10 دقائق واحصل فوراً على نتيجة النضج والاختناقات وخارطة الطريق.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary" className="h-12 px-6">
                <Link to="/assessment">ابدأ التشخيص <ArrowLeft className="ms-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/dashboard">عرض اللوحة</Link>
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
    { label: "القيادة", value: 32 },
    { label: "العمليات", value: 48 },
    { label: "الفريق", value: 55 },
    { label: "التجاري", value: 62 },
    { label: "المالية", value: 41 },
    { label: "التوسّع", value: 38 },
  ];
  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-primary/25 via-accent/20 to-transparent blur-2xl" />
      <div className="relative rounded-3xl border border-border bg-card shadow-xl overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border bg-background/60 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
            <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
            <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
          </div>
          <div className="ms-3 text-xs text-muted-foreground" dir="ltr">webscale.dz / dashboard</div>
        </div>
        <div className="p-5">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs tracking-wider text-muted-foreground">النضج الإجمالي</div>
              <div className="mt-1 flex items-baseline gap-2">
                <div className="text-4xl font-extrabold tracking-tight">46</div>
                <div className="text-sm text-muted-foreground">/ 100</div>
              </div>
              <div className="mt-2 inline-flex rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-bold text-foreground">
                مؤسسة منظَّمة
              </div>
            </div>
            <div className="grid h-16 w-16 place-items-center rounded-full border-4 border-primary/30 text-foreground text-sm font-bold">
              46%
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {scores.map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="font-bold">{s.value}</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-gradient-to-l from-primary to-primary/60" style={{ width: `${s.value}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-border bg-background p-3">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> رؤية ذكية
            </div>
            <div className="mt-1 text-sm">
              العمليات غير موثّقة. ابدأ بـ 5 إجراءات SOP لأكثر سير العمل تكراراً.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
