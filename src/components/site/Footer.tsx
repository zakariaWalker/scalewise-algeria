export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-10 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground text-sm font-extrabold">و</div>
            <span className="text-sm font-bold">WebScale DZ</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground leading-relaxed">
            تشخيص النضج التشغيلي وخارطة طريق استراتيجية للمؤسسات الجزائرية. من الاعتماد على المؤسّس إلى التوسّع المنظّم.
          </p>
        </div>
        <div>
          <div className="text-xs font-bold tracking-wider text-foreground">المنصة</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>التشخيص</li>
            <li>قياس النضج</li>
            <li>خارطة الطريق الاستراتيجية</li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-bold tracking-wider text-foreground">الشركة</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>الجزائر العاصمة، الجزائر</li>
            <li>hello@webscale.dz</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} WebScale DZ. مصمَّمة لمسيّري الشركات في الجزائر.
        </div>
      </div>
    </footer>
  );
}
