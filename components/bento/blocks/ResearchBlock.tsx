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
        Research
      </p>
      <h2 className="font-sans text-3xl font-bold leading-tight tracking-tight">
        Research Projects
      </h2>

      <hr className="my-6 border-border" />

      {/* Project 1 */}
      <div>
        <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-primary">
          LLM-based Software Reliability
        </p>

        <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
          {[
            { label: "Period",      value: "Sep 2025 - Present" },
            { label: "Venue",       value: "ISSRE 2026 (under review)" },
            { label: "Organisation", value: "UC / DEI / CISUC" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="mb-1 font-mono text-[9px] uppercase tracking-widest text-foreground-muted">
                {label}
              </p>
              <p className="text-sm font-medium text-foreground">{value}</p>
            </div>
          ))}
        </div>

        <p className="mt-5 text-sm leading-relaxed text-foreground-muted">
          Conducting a large-scale empirical study on how to leverage Large Language
          Models (LLMs) to significantly enhance software reliability and system
          performance. Investigating human-AI collaboration strategies, demonstrating
          that pairing human developers with LLM-generated code effectively mitigates
          critical system failures.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-foreground-muted">
          The study evaluates 1-out-of-2 fault-tolerant configurations applying classical
          reliability models (Eckhardt-Lee and Littlewood-Miller). It analyzes failure
          overlap across three algorithmic specifications using 14 distinct LLMs and 4
          programming languages (C, C++, Java, Pascal).
        </p>

        <div className="mt-5">
          <p className="mb-3 font-mono text-[9px] uppercase tracking-widest text-foreground-muted">
            Topics
          </p>
          <div className="flex flex-wrap gap-2">
            {["Software Diversity", "Fault Tolerance", "LLMs", "Reliability Engineering"].map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
        </div>
      </div>

      <hr className="my-6 border-border" />

      {/* Project 2 */}
      <div>
        <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-primary">
          Talentos@DEI Scholarship Program
        </p>

        <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
          {[
            { label: "Period",       value: "Jan 2024 - Jul 2024" },
            { label: "Organisation", value: "UC / DEI" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="mb-1 font-mono text-[9px] uppercase tracking-widest text-foreground-muted">
                {label}
              </p>
              <p className="text-sm font-medium text-foreground">{value}</p>
            </div>
          ))}
        </div>

        <p className="mt-5 text-sm leading-relaxed text-foreground-muted">
          Awarded a Research Initiation Scholarship focused on implementing methods to
          recognize and identify anomalous patterns in complex datasets.
        </p>

        <div className="mt-5">
          <p className="mb-3 font-mono text-[9px] uppercase tracking-widest text-foreground-muted">
            Topics
          </p>
          <div className="flex flex-wrap gap-2">
            {["Anomaly Detection", "Data Analysis"].map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
