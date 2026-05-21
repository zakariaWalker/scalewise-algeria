import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground font-extrabold text-base shadow-sm">و</div>
          <div className="leading-tight">
            <div className="text-sm font-bold tracking-tight">WebScale DZ</div>
            <div className="text-[10px] tracking-wider text-muted-foreground">النضج التشغيلي</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" hash="features" className="text-sm text-muted-foreground hover:text-foreground transition">المنصة</Link>
          <Link to="/" hash="how" className="text-sm text-muted-foreground hover:text-foreground transition">كيف تعمل</Link>
          <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition">لوحة التحكم</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/dashboard">تسجيل الدخول</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/assessment">ابدأ التشخيص</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
