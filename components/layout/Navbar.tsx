export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <a
          href="/"
          className="font-sans text-sm font-semibold tracking-tight text-foreground hover:text-primary transition-colors"
        >
          Gabriel Almeida
        </a>
        <nav className="flex items-center gap-4 text-sm">
          <a
            href="/blog"
            className="text-foreground-muted hover:text-foreground transition-colors"
          >
            Blog
          </a>
          <a
            href="https://github.com/gbasilioFCT"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="text-foreground-muted hover:text-foreground transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-background-secondary transition-colors"
          >
            Resume
          </a>
        </nav>
      </div>
    </header>
  );
}
