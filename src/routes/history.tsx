import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { listCloudAssessments, type CloudAssessment, saveAssessment } from "@/lib/store";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
});

function HistoryPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CloudAssessment[] | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate({ to: "/auth" });
        return;
      }
      listCloudAssessments().then(setItems);
    });
  }, [navigate]);

  function open(a: CloudAssessment) {
    saveAssessment({
      companyName: a.company_name,
      industry: a.industry ?? "",
      employees: a.employees ?? "",
      answers: a.answers,
      completedAt: a.completed_at,
    });
    navigate({ to: "/results" });
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <div className="mx-auto max-w-5xl px-6 py-10 md:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold tracking-wider text-primary">الأرشيف</div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight">تشخيصاتك السابقة</h1>
            <p className="mt-1 text-sm text-muted-foreground">كل تشخيص تم حفظه في حسابك.</p>
          </div>
          <Button asChild><Link to="/assessment">تشخيص جديد <ArrowLeft className="ms-2 h-4 w-4" /></Link></Button>
        </div>

        <div className="mt-8">
          {items === null && (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="me-2 h-4 w-4 animate-spin" /> جارٍ التحميل…
            </div>
          )}
          {items && items.length === 0 && (
            <div className="rounded-3xl border border-border bg-card p-10 text-center">
              <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
              <div className="mt-3 text-lg font-bold">لا توجد تشخيصات بعد</div>
              <p className="mt-1 text-sm text-muted-foreground">ابدأ تشخيصك الأول لتحفظه في حسابك.</p>
              <Button asChild className="mt-6"><Link to="/assessment">ابدأ التشخيص</Link></Button>
            </div>
          )}
          {items && items.length > 0 && (
            <div className="grid gap-3">
              {items.map((a) => (
                <button
                  key={a.id}
                  onClick={() => open(a)}
                  className="w-full text-start rounded-2xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-sm transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-bold">{a.company_name}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {a.industry || "—"} · {a.employees || "—"} · {new Date(a.completed_at).toLocaleString("ar-DZ")}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{a.stage}</Badge>
                      <div className="text-2xl font-extrabold text-primary">{a.overall_score}</div>
                      <div className="text-xs text-muted-foreground">/100</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}