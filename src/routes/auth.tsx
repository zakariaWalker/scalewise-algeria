import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast.success("تم إنشاء الحساب — تم تسجيل دخولك.");
        navigate({ to: "/dashboard" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("مرحباً بعودتك.");
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/dashboard",
    });
    if (result.error) {
      toast.error("تعذّر تسجيل الدخول عبر Google");
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <div className="mx-auto max-w-md px-6 py-12 md:py-20">
        <div className="rounded-3xl border border-border bg-card p-6 md:p-10 shadow-sm">
          <div className="text-xs font-bold tracking-wider text-primary">{mode === "signin" ? "تسجيل الدخول" : "إنشاء حساب"}</div>
          <h1 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight">
            {mode === "signin" ? "أهلاً بعودتك" : "ابدأ رحلة شركتك"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signin" ? "ادخل لحفظ تشخيصاتك وخارطة طريقك." : "أنشئ حساباً مجانياً لحفظ تشخيصات شركتك."}
          </p>

          <Button type="button" variant="outline" className="mt-6 w-full" onClick={google} disabled={loading}>
            <svg className="me-2 h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1H12v3.2h5.35c-.23 1.4-1.74 4.1-5.35 4.1-3.22 0-5.85-2.66-5.85-5.95s2.63-5.95 5.85-5.95c1.83 0 3.06.78 3.76 1.45l2.57-2.47C16.94 4.06 14.7 3 12 3 6.95 3 2.85 7.06 2.85 12.1S6.95 21.2 12 21.2c6.93 0 9.5-4.85 9.5-7.35 0-.5-.05-.88-.15-1.25z"/></svg>
            تابع باستخدام Google
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-[10px] tracking-wider text-muted-foreground"><span className="bg-card px-2">أو بالبريد</span></div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <Label htmlFor="name">الاسم الكامل</Label>
                <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-2" />
              </div>
            )}
            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2" />
            </div>
            <div>
              <Label htmlFor="pw">كلمة المرور</Label>
              <Input id="pw" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2" />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
              {mode === "signin" ? "تسجيل الدخول" : "إنشاء الحساب"}
              <ArrowLeft className="ms-2 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "ليس لديك حساب؟ " : "لديك حساب؟ "}
            <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="font-bold text-primary hover:underline">
              {mode === "signin" ? "أنشئ حساباً" : "سجّل الدخول"}
            </button>
          </div>
          <div className="mt-4 text-center text-xs">
            <Link to="/" className="text-muted-foreground hover:text-foreground">العودة للرئيسية</Link>
          </div>
        </div>
      </div>
    </div>
  );
}