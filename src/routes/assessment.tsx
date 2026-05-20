import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Nav } from "@/components/site/Nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, QUESTIONS, SCALE, type Answers, type CategoryKey } from "@/lib/assessment";
import { loadAssessment, loadProfile, saveAssessment, saveProfile } from "@/lib/store";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/assessment")({
  component: AssessmentPage,
});

type Step = { kind: "profile" } | { kind: "category"; cat: CategoryKey } | { kind: "review" };

function AssessmentPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ companyName: "", industry: "", employees: "" });
  const [answers, setAnswers] = useState<Answers>({});
  const [stepIdx, setStepIdx] = useState(0);

  const steps = useMemo<Step[]>(
    () => [
      { kind: "profile" },
      ...CATEGORIES.map<Step>((c) => ({ kind: "category", cat: c.key })),
      { kind: "review" },
    ],
    [],
  );

  useEffect(() => {
    const existing = loadAssessment();
    const p = loadProfile();
    if (p) setProfile(p);
    if (existing) setAnswers(existing.answers);
  }, []);

  const step = steps[stepIdx];
  const progress = Math.round(((stepIdx) / (steps.length - 1)) * 100);

  const canNext = (() => {
    if (step.kind === "profile") return profile.companyName.trim().length > 1 && profile.industry && profile.employees;
    if (step.kind === "category") return QUESTIONS.filter((q) => q.category === step.cat).every((q) => answers[q.id] !== undefined);
    return true;
  })();

  function next() {
    if (step.kind === "profile") saveProfile(profile);
    if (stepIdx === steps.length - 1) {
      saveAssessment({ ...profile, answers, completedAt: new Date().toISOString() });
      navigate({ to: "/results" });
      return;
    }
    setStepIdx((i) => i + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function back() {
    setStepIdx((i) => Math.max(0, i - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <div className="mx-auto max-w-3xl px-6 py-10 md:py-16">
        {/* Progress header */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground">
            <span>Step {stepIdx + 1} of {steps.length}</span>
            <span>{progress}% complete</span>
          </div>
          <Progress value={progress} className="mt-3 h-1.5" />
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 md:p-10 shadow-sm">
          {step.kind === "profile" && (
            <ProfileStep profile={profile} setProfile={setProfile} />
          )}
          {step.kind === "category" && (
            <CategoryStep cat={step.cat} answers={answers} setAnswers={setAnswers} />
          )}
          {step.kind === "review" && (
            <ReviewStep profile={profile} answers={answers} />
          )}

          <div className="mt-10 flex items-center justify-between">
            <Button variant="ghost" onClick={back} disabled={stepIdx === 0}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button onClick={next} disabled={!canNext} size="lg">
              {stepIdx === steps.length - 1 ? (
                <>Generate maturity report <Check className="ml-2 h-4 w-4" /></>
              ) : (
                <>Continue <ArrowRight className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileStep({
  profile,
  setProfile,
}: {
  profile: { companyName: string; industry: string; employees: string };
  setProfile: (p: { companyName: string; industry: string; employees: string }) => void;
}) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Company profile</div>
      <h1 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">Tell us about your company</h1>
      <p className="mt-2 text-sm text-muted-foreground">This helps us contextualize your maturity report.</p>

      <div className="mt-8 space-y-5">
        <div>
          <Label htmlFor="cn">Company name</Label>
          <Input id="cn" value={profile.companyName} onChange={(e) => setProfile({ ...profile, companyName: e.target.value })} placeholder="e.g. Atlas Industries" className="mt-2" />
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <Label>Industry</Label>
            <Select value={profile.industry} onValueChange={(v) => setProfile({ ...profile, industry: v })}>
              <SelectTrigger className="mt-2"><SelectValue placeholder="Select industry" /></SelectTrigger>
              <SelectContent>
                {["Manufacturing", "Distribution", "Services", "Construction", "Agribusiness", "Retail", "Technology", "Other"].map((i) => (
                  <SelectItem key={i} value={i}>{i}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Team size</Label>
            <Select value={profile.employees} onValueChange={(v) => setProfile({ ...profile, employees: v })}>
              <SelectTrigger className="mt-2"><SelectValue placeholder="Select size" /></SelectTrigger>
              <SelectContent>
                {["1–4", "5–19", "20–49", "50–99", "100–249", "250+"].map((i) => (
                  <SelectItem key={i} value={i}>{i} employees</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryStep({
  cat,
  answers,
  setAnswers,
}: {
  cat: CategoryKey;
  answers: Answers;
  setAnswers: (a: Answers) => void;
}) {
  const meta = CATEGORIES.find((c) => c.key === cat)!;
  const qs = QUESTIONS.filter((q) => q.category === cat);
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{meta.label}</div>
      <h1 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">{meta.description}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Answer honestly — there are no right answers, only insight.</p>

      <div className="mt-8 space-y-6">
        {qs.map((q, idx) => (
          <div key={q.id} className="rounded-2xl border border-border bg-background p-5">
            <div className="flex items-start gap-3">
              <div className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-primary/10 text-primary text-xs font-semibold">{idx + 1}</div>
              <div className="text-sm md:text-base font-medium">{q.text}</div>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {SCALE.map((opt) => {
                const active = answers[q.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setAnswers({ ...answers, [q.id]: opt.value })}
                    className={`group rounded-xl border px-2 py-3 text-xs font-medium transition ${
                      active
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-card hover:border-primary/40 hover:bg-primary/5"
                    }`}
                  >
                    <div className="text-base font-semibold">{opt.value + 1}</div>
                    <div className={`mt-1 leading-tight ${active ? "opacity-90" : "text-muted-foreground"}`}>{opt.label}</div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewStep({ profile, answers }: { profile: { companyName: string }; answers: Answers }) {
  const answered = Object.keys(answers).length;
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Ready</div>
      <h1 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">Generate your maturity report</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We'll analyze <span className="font-medium text-foreground">{profile.companyName || "your company"}</span> across {CATEGORIES.length} dimensions and build a tailored roadmap.
      </p>
      <div className="mt-8 grid gap-3 md:grid-cols-3">
        {[
          ["Questions answered", `${answered} / ${QUESTIONS.length}`],
          ["Categories analyzed", `${CATEGORIES.length}`],
          ["Estimated read time", "3 min"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-border bg-background p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{k}</div>
            <div className="mt-1 text-xl font-semibold">{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}