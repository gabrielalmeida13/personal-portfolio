const groups = [
  { label: "Frontend", skills: ["React", "Next.js", "TypeScript", "Tailwind"] },
  { label: "Backend",  skills: ["Node.js", "Python", "Django", "PostgreSQL"] },
  { label: "DevOps",   skills: ["Docker", "GitHub Actions", "Linux"] },
];

export function SkillsBlock() {
  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-border/50 bg-card/20 p-5">
      <p className="font-mono text-[10px] uppercase tracking-widest text-foreground-muted">
        Stack
      </p>
      <div className="flex flex-col gap-3">
        {groups.map(({ label, skills }) => (
          <div key={label}>
            <p className="mb-1.5 font-mono text-[9px] uppercase tracking-wider text-foreground-muted/60">
              {label}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span
                  key={s}
                  className="rounded-md border border-border bg-background-secondary px-2 py-0.5 font-mono text-[10px] text-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
