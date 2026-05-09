const CORE_SKILLS = ["React", "TypeScript", "Python", "PostgreSQL", "Docker"];

const SKILL_GROUPS = [
  {
    label: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    label: "Backend",
    skills: ["Node.js", "Python", "Ruby on Rails", "Django", "PostgreSQL"],
  },
  {
    label: "Infrastructure / DevOps",
    skills: ["Docker", "GitHub Actions", "Linux"],
  },
  {
    label: "Security / Research",
    skills: ["Reverse Engineering", "Data Analysis", "LLM Prompting"],
  },
];

const TOTAL_SKILLS = SKILL_GROUPS.reduce((n, g) => n + g.skills.length, 0);

// -- Collapsed --

export function SkillsBlockCollapsed() {
  const extra = TOTAL_SKILLS - CORE_SKILLS.length;
  return (
    <div className="flex h-full flex-col justify-between p-5">
      <p className="font-mono text-[10px] uppercase tracking-widest text-foreground-muted">
        Stack
      </p>
      <div>
        <p className="mb-2 font-mono text-[9px] uppercase tracking-wider text-foreground-muted/60">
          Core
        </p>
        <div className="flex flex-wrap gap-1.5">
          {CORE_SKILLS.map((s) => (
            <span
              key={s}
              className="rounded-md border border-border bg-background-secondary px-2 py-0.5 font-mono text-[10px] text-foreground"
            >
              {s}
            </span>
          ))}
        </div>
        <p className="mt-3 font-mono text-[10px] text-foreground-muted/60">
          + {extra} more skills
        </p>
      </div>
    </div>
  );
}

// -- Expanded --

export function SkillsBlockExpanded() {
  return (
    <div className="p-8">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-foreground-muted">
        Stack
      </p>
      <h2 className="font-sans text-3xl font-bold leading-tight tracking-tight">
        Technical Skills
      </h2>

      <hr className="my-6 border-border" />

      <div className="grid gap-8 sm:grid-cols-2">
        {SKILL_GROUPS.map(({ label, skills }) => (
          <div key={label}>
            <p className="mb-3 font-mono text-[9px] uppercase tracking-widest text-foreground-muted">
              {label}
            </p>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span
                  key={s}
                  className="rounded-md border border-border bg-background-secondary px-2.5 py-1 font-mono text-xs text-foreground"
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
