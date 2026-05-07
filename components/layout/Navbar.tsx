export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <span className="font-sans text-sm font-semibold tracking-tight">
          Gabriel Serens
        </span>
        <nav className="flex items-center gap-6 text-sm text-foreground-muted">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#blog">Blog</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}
