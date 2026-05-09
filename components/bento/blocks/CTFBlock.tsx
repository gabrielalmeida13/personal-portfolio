const skills = [
  { label: "Rev. Eng", pct: 85, color: "#22c55e" },
  { label: "Pwn",      pct: 70, color: "#3b82f6" },
  { label: "Web",      pct: 78, color: "#f59e0b" },
  { label: "Crypto",   pct: 55, color: "#a855f7" },
];

function SkillBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 font-mono text-[10px] text-foreground-muted">{label}</span>
      <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

export function CTFBlockCollapsed() {
  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div>
        <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-green-400">
          Security
        </p>
        <h3 className="font-sans text-lg font-bold leading-snug">
          CTF & CyberSec<br />Lab @CISUC
        </h3>
      </div>
      <div className="flex flex-col gap-3">
        {skills.map((s) => (
          <SkillBar key={s.label} {...s} />
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        <span className="rounded-full border border-green-500/20 bg-green-500/5 px-2.5 py-0.5 font-mono text-[10px] text-green-400">CTF Creator</span>
        <span className="rounded-full border border-green-500/20 bg-green-500/5 px-2.5 py-0.5 font-mono text-[10px] text-green-400">Intl Competitions</span>
      </div>
    </div>
  );
}

export function CTFBlockExpanded() {
  return (
    <div className="p-8">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-green-400">
        Cybersecurity · @CISUC
      </p>
      <h2 className="font-sans text-3xl font-bold leading-tight tracking-tight">
        CTF Player &<br />Challenge Creator
      </h2>
      <p className="mt-2 text-sm text-foreground-muted">
        CyberSecurity Laboratory · CISUC · Universidade de Coimbra
      </p>

      <hr className="my-6 border-border" />

      <div className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">
        {[
          { label: "Period",     value: "Sep 2025 – Present" },
          { label: "Role",       value: "Member & CTF Player" },
          { label: "Scope",      value: "International Competitions" },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="mb-1 font-mono text-[9px] uppercase tracking-widest text-foreground-muted">{label}</p>
            <p className="text-sm font-medium text-foreground">{value}</p>
          </div>
        ))}
      </div>

      <hr className="my-6 border-border" />

      <p className="text-sm leading-relaxed text-foreground-muted">
        Developing technical challenges for Capture The Flag (CTF) competitions to
        foster security awareness across the academic community. Competing
        internationally in Reverse Engineering, Pwn, and Web security categories.
      </p>

      <div className="mt-8">
        <p className="mb-4 font-mono text-[9px] uppercase tracking-widest text-foreground-muted">Skill Profile</p>
        <div className="flex max-w-sm flex-col gap-4">
          {skills.map((s) => (
            <SkillBar key={s.label} {...s} />
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {["Reverse Engineering", "Binary Exploitation", "Web Security", "Cryptography", "CTF Design"].map((t) => (
          <span key={t} className="rounded-full border border-green-500/20 bg-green-500/5 px-2.5 py-0.5 font-mono text-[10px] text-green-400">{t}</span>
        ))}
      </div>
    </div>
  );
}
