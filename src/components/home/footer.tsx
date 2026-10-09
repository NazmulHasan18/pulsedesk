export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <div className="flex items-center gap-2.5">
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-signal" />
          <span className="font-display text-base font-semibold tracking-tight">PulseDesk</span>
          <span className="text-sm text-muted-foreground">— live chat that answers itself</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <a href="#how-it-works" className="hover:text-ink">
            How it works
          </a>
          <a href="#features" className="hover:text-ink">
            Features
          </a>
          <a href="#dashboard" className="hover:text-ink">
            Dashboard
          </a>
          <a href="#" className="hover:text-ink">
            Status
          </a>
        </div>
      </div>
    </footer>
  );
}
