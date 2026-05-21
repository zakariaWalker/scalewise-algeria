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
  inverted?: boolean;
};

export const CATEGORIES: { key: CategoryKey; label: string; short: string; description: string }[] = [
  { key: "leadership", label: "الاعتماد على القيادة", short: "القيادة", description: "إلى أي مدى تعتمد الشركة على المؤسّس؟" },
  { key: "operations", label: "العمليات والتشغيل", short: "العمليات", description: "هل سير العمل موثّق وموحّد؟" },
  { key: "team", label: "هيكلة الفريق", short: "الفريق", description: "وضوح الأدوار والمسؤوليات والتفويض." },
  { key: "commercial", label: "النظام التجاري", short: "التجاري", description: "مبيعات متوقَّعة، CRM ومتابعة عملاء." },
  { key: "financial", label: "الرؤية المالية", short: "المالية", description: "لوحات قيادة، مؤشرات أداء وربحية واضحة." },
  { key: "scalability", label: "الجاهزية للتوسّع", short: "التوسّع", description: "نضج العمليات ووجود طبقة إدارية وسطى." },
];

export const QUESTIONS: Question[] = [
  { id: "L1", category: "leadership", text: "تتوقف القرارات في غياب المؤسّس.", inverted: true },
  { id: "L2", category: "leadership", text: "معظم القرارات الاستراتيجية والتشغيلية يتخذها المؤسّس وحده.", inverted: true },
  { id: "L3", category: "leadership", text: "المسؤولون لديهم صلاحية اتخاذ القرارات ضمن حدود واضحة." },
  { id: "L4", category: "leadership", text: "يستطيع المؤسّس أخذ إجازة لأسبوعين دون أن تتعطّل الشركة." },

  { id: "O1", category: "operations", text: "العمليات الأساسية موثّقة كإجراءات (SOPs) متاحة للفريق." },
  { id: "O2", category: "operations", text: "العمل موحّد — نفس المهمة تُنجز بنفس الطريقة من قبل الجميع." },
  { id: "O3", category: "operations", text: "تسليم الخدمة أو الإنتاج يعتمد على أشخاص بعينهم.", inverted: true },
  { id: "O4", category: "operations", text: "المشاكل المتكررة يتم رصدها وحلّها بشكل منهجي." },

  { id: "T1", category: "team", text: "كل دور لديه توصيف وظيفي مكتوب ومسؤوليات واضحة." },
  { id: "T2", category: "team", text: "خطوط التقارير وصلاحيات القرار واضحة لا لبس فيها." },
  { id: "T3", category: "team", text: "التنسيق بين الفرق يتم عبر طقوس منتظمة (اجتماعات يومية أو أسبوعية)." },
  { id: "T4", category: "team", text: "الفريق ينتظر المؤسّس لإزالة العقبات.", inverted: true },

  { id: "C1", category: "commercial", text: "خط المبيعات (Pipeline) متوقَّع من شهر لآخر." },
  { id: "C2", category: "commercial", text: "نستخدم CRM بانتظام لمتابعة العملاء المحتملين والحاليين." },
  { id: "C3", category: "commercial", text: "المبيعات تتبع عملية موثّقة من العميل المحتمل إلى الإغلاق." },
  { id: "C4", category: "commercial", text: "الاحتفاظ بالعملاء والمتابعة بعد البيع منظَّمان." },

  { id: "F1", category: "financial", text: "لدينا لوحات قيادة حيّة للإيرادات والسيولة والهامش." },
  { id: "F2", category: "financial", text: "المؤشرات الرئيسية تُراجَع في اجتماع إداري دوري." },
  { id: "F3", category: "financial", text: "الربحية لكل منتج / خدمة / عميل واضحة." },
  { id: "F4", category: "financial", text: "التقارير المالية ردّة فعل ومتأخرة.", inverted: true },

  { id: "S1", category: "scalability", text: "التوظيف يتبع عملية منظّمة مع برامج تأهيل." },
  { id: "S2", category: "scalability", text: "توجد طبقة إدارية وسطى بين المؤسّس والتنفيذ." },
  { id: "S3", category: "scalability", text: "العمليات قادرة على استيعاب ضعف الحجم الحالي دون أن تنهار." },
  { id: "S4", category: "scalability", text: "لدينا هيكل تنظيمي وخطة نمو واضحة للـ 12 شهراً القادمة." },
];

export type Answers = Record<string, number>;

export const SCALE = [
  { value: 0, label: "أرفض بشدة" },
  { value: 1, label: "أرفض" },
  { value: 2, label: "محايد" },
  { value: 3, label: "أوافق" },
  { value: 4, label: "أوافق بشدة" },
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
  { key: "artisan", label: "حِرفيّة", range: [0, 20], blurb: "الشركة تعمل بالحدس والممارسة الفردية والحضور الدائم للمؤسّس." },
  { key: "founder", label: "متمحوِرة حول المؤسّس", range: [21, 40], blurb: "بدايات هيكلة، لكن كل شيء يمرّ عبر المؤسّس." },
  { key: "structured", label: "مؤسسة منظَّمة", range: [41, 60], blurb: "أدوار وإجراءات أساسية موجودة؛ التنسيق يتحسّن." },
  { key: "process", label: "موجَّهة بالعمليات", range: [61, 80], blurb: "إجراءات ومؤشرات وتفويض تجعل الشركة قادرة على الاستمرار دون المؤسّس." },
  { key: "scalable", label: "مؤسسة قابلة للتوسّع", range: [81, 100], blurb: "أنظمة وطبقات إدارية وبيانات تتيح نمواً متوقَّعاً." },
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
  urgency: "فوراً" | "خلال 30 يوماً" | "خلال 90 يوماً";
};

export const SEVERITY_LABELS: Record<Bottleneck["severity"], string> = {
  critical: "حرِج",
  high: "مرتفع",
  medium: "متوسط",
  low: "منخفض",
};

export function detectBottlenecks(answers: Answers): Bottleneck[] {
  const out: Bottleneck[] = [];
  const s = (k: CategoryKey) => categoryScore(k, answers);
  const sev = (score: number): Bottleneck["severity"] =>
    score < 25 ? "critical" : score < 45 ? "high" : score < 65 ? "medium" : "low";

  const lib: Record<CategoryKey, Omit<Bottleneck, "category" | "severity" | "urgency">> = {
    leadership: {
      title: "الشركة تعتمد بشكل مفرط على قرارات المؤسّس.",
      impact: "اختناق القرار يُبطئ التنفيذ ويجعل الشركة هشّة في غيابك.",
      recommendation: "حدّد صلاحيات القرار، وفوّض 3 قرارات متكررة لمسؤولين هذا الشهر.",
    },
    operations: {
      title: "العمليات غير موثّقة إلى حدٍ كبير.",
      impact: "الجودة تتفاوت من شخص لآخر، التأهيل بطيء، والتوسّع يضاعف الفوضى.",
      recommendation: "وثّق أكثر 5 عمليات تكراراً كإجراءات SOP من صفحة واحدة مع مسؤول لكل منها.",
    },
    team: {
      title: "تنسيق الفريق يفتقر إلى البنية.",
      impact: "تسقط المهام بين الأدوار، ويصبح المؤسّس وسيط التواصل البشري.",
      recommendation: "انشر مخطط الأدوار، وأقم مراجعة عمليات أسبوعية مدتها 30 دقيقة.",
    },
    commercial: {
      title: "العمليات التجارية ردّة فعل.",
      impact: "الإيرادات غير متوقَّعة، المتابعة غير منتظمة، والفرص تضيع.",
      recommendation: "اعتمد CRM بسيط وحدّد خط مبيعات من 5 مراحل هذا الشهر.",
    },
    financial: {
      title: "الرؤية المالية محدودة.",
      impact: "القرارات تُتخذ بالحدس؛ ربحية كل عميل/منتج غير واضحة.",
      recommendation: "ابنِ لوحة مؤشرات أسبوعية من صفحة واحدة: الإيراد، السيولة، الهامش، الذمم.",
    },
    scalability: {
      title: "المؤسسة غير جاهزة للتوسّع.",
      impact: "النمو سيُضخّم الفوضى الحالية والإرهاق.",
      recommendation: "صمّم الهيكل التنظيمي لـ 12 شهراً وحدّد التوظيفَيْن الأكثر أهمية.",
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
        urgency: severity === "critical" || severity === "high" ? "فوراً" : severity === "medium" ? "خلال 30 يوماً" : "خلال 90 يوماً",
      });
    }
  });

  return out.sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 } as const;
    return order[a.severity] - order[b.severity];
  });
}

export type RoadmapItem = {
  horizon: "فوري" | "30 يوم" | "90 يوم" | "6 أشهر" | "سنة";
  title: string;
  description: string;
  priority: "P0" | "P1" | "P2";
  impact: 1 | 2 | 3 | 4 | 5;
  complexity: 1 | 2 | 3 | 4 | 5;
  category: CategoryKey;
};

const ROADMAP_LIBRARY: Record<CategoryKey, RoadmapItem[]> = {
  leadership: [
    { horizon: "فوري", title: "ارسم خريطة اختناقات القرار", description: "اكتب أهم 10 قرارات تتخذها وحدك. حدّد ما يمكن تفويضه.", priority: "P0", impact: 5, complexity: 1, category: "leadership" },
    { horizon: "30 يوم", title: "أسّس مراجعة قيادية أسبوعية", description: "اجتماع 60 دقيقة أسبوعياً: الأولويات، العقبات، المؤشرات، القرارات.", priority: "P0", impact: 5, complexity: 2, category: "leadership" },
    { horizon: "90 يوم", title: "فوّض 3 قرارات متكررة", description: "انقلها بمعايير قرار مكتوبة ومراجعة دورية.", priority: "P1", impact: 4, complexity: 3, category: "leadership" },
  ],
  operations: [
    { horizon: "30 يوم", title: "وثّق أهم 5 إجراءات SOP", description: "إجراءات من صفحة واحدة لأكثر سير العمل تكراراً، مع مسؤول لكلٍ.", priority: "P0", impact: 5, complexity: 2, category: "operations" },
    { horizon: "90 يوم", title: "وحّد سير عملية التسليم", description: "عملية واحدة من استلام الطلب إلى التسليم.", priority: "P1", impact: 4, complexity: 3, category: "operations" },
    { horizon: "6 أشهر", title: "نقاط ضبط الجودة", description: "أنشئ 3 بوّابات جودة بمعايير قبول قابلة للقياس.", priority: "P2", impact: 3, complexity: 3, category: "operations" },
  ],
  team: [
    { horizon: "فوري", title: "انشر الهيكل التنظيمي والمسؤوليات", description: "اجعل الأدوار وخطوط التقارير صريحة ومرئية.", priority: "P0", impact: 4, complexity: 1, category: "team" },
    { horizon: "30 يوم", title: "اجتماع يومي قصير 15 دقيقة", description: "مزامنة العقبات والأولويات والترابطات.", priority: "P1", impact: 3, complexity: 1, category: "team" },
    { horizon: "6 أشهر", title: "وظّف أو رقّ إدارة وسطى", description: "أضف طبقة بين المؤسّس والتنفيذ.", priority: "P1", impact: 5, complexity: 4, category: "team" },
  ],
  commercial: [
    { horizon: "30 يوم", title: "اعتمد CRM وأدخل خط المبيعات النشط", description: "اختر CRM واحد. أدخل الصفقات النشطة. حدّد المراحل.", priority: "P0", impact: 5, complexity: 2, category: "commercial" },
    { horizon: "90 يوم", title: "صمّم عملية بيع من 5 مراحل", description: "عميل محتمل ← تأهيل ← عرض ← تفاوض ← إغلاق، بمعايير.", priority: "P1", impact: 4, complexity: 2, category: "commercial" },
    { horizon: "6 أشهر", title: "دليل الاحتفاظ بالعملاء", description: "متابعة بعد البيع، NPS، إيقاع البيع الإضافي.", priority: "P2", impact: 3, complexity: 3, category: "commercial" },
  ],
  financial: [
    { horizon: "30 يوم", title: "لوحة مؤشرات أسبوعية من صفحة واحدة", description: "الإيراد، السيولة، الذمم، الهامش. تُراجَع كل اثنين.", priority: "P0", impact: 5, complexity: 2, category: "financial" },
    { horizon: "90 يوم", title: "ربحية لكل عميل / منتج", description: "وزّع التكاليف واكشف من يساهم فعلياً في الهامش.", priority: "P1", impact: 4, complexity: 3, category: "financial" },
    { horizon: "سنة", title: "توقّعات متجدّدة لـ 12 شهراً", description: "توقّع تدفّق نقدي يُحدَّث شهرياً ويقود القرارات.", priority: "P2", impact: 4, complexity: 4, category: "financial" },
  ],
  scalability: [
    { horizon: "90 يوم", title: "صمّم الهيكل التنظيمي لـ 12 شهراً", description: "ارسم شكل الشركة بعد سنة. حدّد الفجوات.", priority: "P1", impact: 5, complexity: 2, category: "scalability" },
    { horizon: "6 أشهر", title: "توظيف وتأهيل منظّم", description: "توصيف وظيفي، بطاقات تقييم، خطة تأهيل 30-60-90.", priority: "P1", impact: 4, complexity: 3, category: "scalability" },
    { horizon: "سنة", title: "طقس تخطيط استراتيجي سنوي", description: "خلوة سنوية ← أهداف فصلية ← مؤشرات أسبوعية.", priority: "P2", impact: 5, complexity: 3, category: "scalability" },
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
  const horizonOrder: RoadmapItem["horizon"][] = ["فوري", "30 يوم", "90 يوم", "6 أشهر", "سنة"];
  return items.sort((a, b) => horizonOrder.indexOf(a.horizon) - horizonOrder.indexOf(b.horizon));
}
