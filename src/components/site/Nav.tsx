import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground font-bold text-sm shadow-sm">W</div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">WebScale DZ</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Operational Maturity</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" hash="features" className="text-sm text-muted-foreground hover:text-foreground transition">Platform</Link>
          <Link to="/" hash="how" className="text-sm text-muted-foreground hover:text-foreground transition">How it works</Link>
          <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition">Dashboard</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/dashboard">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/assessment">Start Assessment</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}