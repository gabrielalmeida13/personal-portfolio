export function ContactBlock() {
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-border/50 bg-card/20 p-5">
      <div>
        <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-foreground-muted">
          Contact
        </p>
        <h3 className="font-sans text-base font-semibold">Let&apos;s talk</h3>
        <p className="mt-2 text-xs leading-relaxed text-foreground-muted">
          Open for research collaboration, internships, and interesting projects.
        </p>
      </div>
      <div className="flex flex-col gap-2 pt-4">
        <a
          href="mailto:gabrielserens@gmail.com"
          className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-foreground-muted transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <span className="font-mono">✉</span> Email
        </a>
        <a
          href="https://linkedin.com/in/gabriel-almeida"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-foreground-muted transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <span className="font-mono">↗</span> LinkedIn
        </a>
      </div>
    </div>
  );
}
