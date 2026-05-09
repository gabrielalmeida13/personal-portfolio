function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 font-mono text-[10px] text-primary">
      {children}
    </span>
  );
}

export function ResearchBlockCollapsed() {
  return (
    <div className="flex h-full flex-col justify-between p-6">
      <div>
        <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-primary">
          Research
        </p>
        <h3 className="font-sans text-lg font-bold leading-snug tracking-tight">
          ISSRE 2026<br />Research
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-foreground-muted">
          Software Diversity · LLM Integration
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5 pt-4">
        <Chip>UC · DEI</Chip>
        <Chip>2025–Present</Chip>
        <Chip>→ ISSRE 2026</Chip>
      </div>
    </div>
  );
}

export function ResearchBlockExpanded() {
  return (
    <div className="p-8">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-primary">
        Research · UC / DEI
      </p>
      <h2 className="font-sans text-3xl font-bold leading-tight tracking-tight">
        Software Diversity &<br />LLM Integration
      </h2>
      <p className="mt-2 text-sm text-foreground-muted">
        Departamento de Engenharia Informática · Universidade de Coimbra
      </p>

      <hr className="my-6 border-border" />

      <div className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
        {[
          { label: "Period",       value: "Sep 2025 – Present" },
          { label: "Venue",       value: "ISSRE 2026 (under review)" },
          { label: "Role",        value: "Undergraduate Researcher" },
          { label: "Institution", value: "UC / DEI / CISUC" },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="mb-1 font-mono text-[9px] uppercase tracking-widest text-foreground-muted">
              {label}
            </p>
            <p className="text-sm font-medium text-foreground">{value}</p>
          </div>
        ))}
      </div>

      <hr className="my-6 border-border" />

      <p className="text-sm leading-relaxed text-foreground-muted">
        Conducting a large-scale empirical study on how to leverage Large Language
        Models (LLMs) to significantly enhance software reliability and system
        performance. Investigating human-AI collaboration strategies, demonstrating
        that pairing human developers with LLM-generated code effectively mitigates
        critical system failures.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-foreground-muted">
        Authored a research paper detailing the exponential reliability gains
        achieved through these heterogeneous software pairings, currently under
        double-blind review for the 37th IEEE International Symposium on Software
        Reliability Engineering (ISSRE 2026).
      </p>

      <div className="mt-6">
        <p className="mb-3 font-mono text-[9px] uppercase tracking-widest text-foreground-muted">
          Topics
        </p>
        <div className="flex flex-wrap gap-2">
          {["Software Diversity", "LLM Capabilities", "Systems Architecture", "Fault Tolerance", "Performance Optimization"].map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>
      </div>
    </div>
  );
}
