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
        <nav className="flex items-center gap-6 text-sm text-foreground-muted">
          <a href="/#about" className="hover:text-foreground transition-colors">About</a>
          <a href="/#projects" className="hover:text-foreground transition-colors">Projects</a>
          <a href="/blog" className="hover:text-foreground transition-colors">Blog</a>
          <a href="/#contact" className="hover:text-foreground transition-colors">Contact</a>
        </nav>
      </div>
    </header>
  );
}
