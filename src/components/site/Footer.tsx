export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-10 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground text-xs font-bold">W</div>
            <span className="text-sm font-semibold">WebScale DZ</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Operational maturity diagnosis and roadmap for Algerian SMEs. From founder-dependent to scalable.
          </p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-foreground">Platform</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Diagnosis</li>
            <li>Maturity scoring</li>
            <li>Strategic roadmap</li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-foreground">Company</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Algiers, Algeria</li>
            <li>hello@webscale.dz</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} WebScale DZ. Built for Algerian SMEs.
        </div>
      </div>
    </footer>
  );
}