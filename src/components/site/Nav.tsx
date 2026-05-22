import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useAuth, signOut } from "@/hooks/use-auth";
import { LogOut, User as UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Nav() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/" });
  }

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
          {isAuthenticated && (
            <Link to="/history" className="text-sm text-muted-foreground hover:text-foreground transition">الأرشيف</Link>
          )}
        </nav>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <div className="grid h-7 w-7 place-items-center rounded-full bg-primary/15 text-foreground">
                    <UserIcon className="h-3.5 w-3.5" />
                  </div>
                  <span className="hidden sm:inline max-w-[140px] truncate text-xs">{user?.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs text-muted-foreground">{user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/dashboard">لوحة التحكم</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/history">الأرشيف</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/assessment">تشخيص جديد</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                  <LogOut className="me-2 h-4 w-4" /> تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/auth">تسجيل الدخول</Link>
            </Button>
          )}
          <Button asChild size="sm">
            <Link to="/assessment">ابدأ التشخيص</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
