export function JeKnowledgeBlockCollapsed() {
  return (
    <div className="flex h-full flex-col justify-between p-6">
      <div>
        <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-amber-400">
          Experience
        </p>
        <h3 className="font-sans text-lg font-bold leading-snug">
          jeKnowledge<br />Junior Dev
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-foreground-muted">
          Junior Enterprise · Software Development
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5 pt-4">
        <span className="rounded-full border border-amber-500/20 bg-amber-500/5 px-2.5 py-0.5 font-mono text-[10px] text-amber-400">Mar–Oct 2025</span>
        <span className="rounded-full border border-amber-500/20 bg-amber-500/5 px-2.5 py-0.5 font-mono text-[10px] text-amber-400">Full-Stack</span>
        <span className="rounded-full border border-amber-500/20 bg-amber-500/5 px-2.5 py-0.5 font-mono text-[10px] text-amber-400">Promoted</span>
      </div>
    </div>
  );
}

export function JeKnowledgeBlockExpanded() {
  return (
    <div className="p-8">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-amber-400">
        Experience · Junior Enterprise
      </p>
      <h2 className="font-sans text-3xl font-bold leading-tight tracking-tight">
        Junior Software Developer
      </h2>
      <p className="mt-2 text-sm text-foreground-muted">jeKnowledge</p>

      <hr className="my-6 border-border" />

      <div className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">
        {[
          { label: "Period",      value: "Mar 2025 – Oct 2025" },
          { label: "Role",        value: "Junior Software Developer" },
          { label: "Progression", value: "Promoted from Trainee" },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="mb-1 font-mono text-[9px] uppercase tracking-widest text-foreground-muted">{label}</p>
            <p className="text-sm font-medium text-foreground">{value}</p>
          </div>
        ))}
      </div>

      <hr className="my-6 border-border" />

      <ul className="space-y-4 text-sm text-foreground-muted">
        <li className="flex flex-col gap-1">
          <span className="leading-relaxed">
            Developed and maintained robust full-stack software solutions (React,
            Ruby on Rails) within a dynamic, student-led tech environment.
          </span>
        </li>
        <li className="flex flex-col gap-1">
          <span className="leading-relaxed">
            Promoted from Trainee to Junior Developer in under 3 months by rapidly
            acquiring skills and delivering critical features for team projects.
          </span>
        </li>
      </ul>

      <div className="mt-6 flex flex-wrap gap-2">
        {["React", "Node.js", "TypeScript", "Agile", "Team Collaboration"].map((t) => (
          <span key={t} className="rounded-full border border-amber-500/20 bg-amber-500/5 px-2.5 py-0.5 font-mono text-[10px] text-amber-400">{t}</span>
        ))}
      </div>
    </div>
  );
}
