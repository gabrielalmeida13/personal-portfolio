# Dynamic Bento Box Portfolio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the section-by-section homepage with a dynamic bento grid where clicking any content block triggers a Framer Motion `layoutId` morph to a full-screen detail overlay, while the hero transitions to a compact sticky header.

**Architecture:** Blocks live in a 12-column CSS grid; each has a `layoutId`. Clicking a block mounts a `fixed inset-0` overlay with the same `layoutId` — Framer Motion interpolates the position/size change. All non-expanded, non-hero blocks animate to `opacity: 0.25`. The hero fades to 0 and a separate compact header slides in from the top. State is a single `expandedId: string | null` in `BentoGrid`.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript 5, Framer Motion (already installed), Tailwind CSS v4, existing `PinnedRepo` type and `fetchPinnedRepos()` server function.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `app/globals.css` | Modify | Add CSS rule to hide `<header>` and LiveBar when `data-bento-expanded` is on `<body>` |
| `app/page.tsx` | Modify | Fetch repos server-side, render `<BentoGrid>` |
| `components/bento/BentoGrid.tsx` | Create | Grid container; holds `expandedId` state; sets `data-bento-expanded` on body |
| `components/bento/CompactHero.tsx` | Create | Fixed header shown during expand (name + role + back button) |
| `components/bento/ExpandedOverlay.tsx` | Create | `fixed inset-0` overlay with `layoutId` morph + close logic |
| `components/bento/RetreatedStrip.tsx` | Create | Row of dimmed block-name chips; clicking one switches to that block |
| `components/bento/blocks/HeroBlock.tsx` | Create | Full hero card (name, avatar, status dot, CTAs) |
| `components/bento/blocks/ResearchBlock.tsx` | Create | Collapsed card + expanded detail view |
| `components/bento/blocks/CTFBlock.tsx` | Create | Collapsed card with skill bars + expanded detail |
| `components/bento/blocks/JeKnowledgeBlock.tsx` | Create | Collapsed card + expanded detail |
| `components/bento/blocks/GitHubBlock.tsx` | Create | Collapsed card showing live pinned-repo count + expanded repo list |
| `components/bento/blocks/SkillsBlock.tsx` | Create | Static chip-cloud card (non-expandable) |
| `components/bento/blocks/ContactBlock.tsx` | Create | Static contact links card (non-expandable) |

---

## Task 1: CSS foundation — hide Navbar + LiveBar on expand

**Files:**
- Modify: `app/globals.css`

**Context:** `Navbar` renders as `<header class="sticky top-0 z-50 ...">`. `LiveBar` renders as `<div class="fixed bottom-0 ... z-50 ...">`. Both need to disappear when `<body data-bento-expanded>` is set, because the expanded overlay and compact header take over the full viewport.

- [ ] **Add hide rules to `app/globals.css`** — append after the existing rehype block:

```css
/* Hide site chrome when a bento block is expanded */
body[data-bento-expanded] > * header,
body[data-bento-expanded] [role="complementary"] {
  display: none !important;
}
```

- [ ] **Verify the selectors target the right elements** — `header` inside the ThemeProvider tree, and `[role="complementary"]` matches LiveBar's `<div role="complementary">`.

- [ ] **Add `.superpowers/` to `.gitignore`** if not already present:

```
# brainstorm visual companion sessions
.superpowers/
```

- [ ] **Commit:**
```bash
git add app/globals.css .gitignore
git commit -m "chore: hide site chrome on bento expand + gitignore brainstorm dir"
```

---

## Task 2: Shared block types

**Files:**
- Create: `components/bento/types.ts`

- [ ] **Create `components/bento/types.ts`:**

```typescript
export type BlockId = "research" | "ctf" | "jeknowledge" | "github";

export const EXPANDABLE_IDS: BlockId[] = [
  "research",
  "ctf",
  "jeknowledge",
  "github",
];

export type BlockMeta = {
  id: BlockId;
  label: string;
  /** Tailwind col/row span classes for the grid (desktop). Mobile always col-span-12. */
  gridClass: string;
};

export const BLOCK_META: BlockMeta[] = [
  { id: "research",    label: "Research",     gridClass: "md:col-span-6 md:row-span-2" },
  { id: "ctf",         label: "CTF Lab",      gridClass: "md:col-span-4 md:row-span-2" },
  { id: "jeknowledge", label: "jeKnowledge",  gridClass: "md:col-span-6 md:row-span-2" },
  { id: "github",      label: "GitHub",       gridClass: "md:col-span-4 md:row-span-2" },
];
```

- [ ] **Commit:**
```bash
git add components/bento/types.ts
git commit -m "feat: add bento block types and metadata"
```

---

## Task 3: HeroBlock — full grid card

**Files:**
- Create: `components/bento/blocks/HeroBlock.tsx`

- [ ] **Create `components/bento/blocks/HeroBlock.tsx`:**

```tsx
import { motion } from "framer-motion";

type Props = {
  isAnyExpanded: boolean;
};

export function HeroBlock({ isAnyExpanded }: Props) {
  return (
    <motion.div
      animate={{ opacity: isAnyExpanded ? 0 : 1 }}
      transition={{ duration: 0.25 }}
      className="col-span-12 md:col-span-8 md:row-span-2 min-h-[280px] flex flex-col justify-between rounded-2xl border border-border/50 bg-card/20 p-6"
    >
      {/* Status */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-foreground-muted">
          Available for opportunities
        </span>
      </div>

      {/* Name + role */}
      <div>
        <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-primary">
          Portfolio
        </p>
        <h1 className="font-sans text-4xl font-bold leading-none tracking-tight lg:text-5xl">
          Gabriel<br />Almeida
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
          BSc Informatics Engineering · University of Coimbra
          <br />
          Researcher · CTF Player · Software Developer
        </p>
      </div>

      {/* CTAs */}
      <div className="flex flex-wrap gap-2">
        <a
          href="/#contact"
          className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Contact
        </a>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-background-secondary transition-colors"
        >
          Resume ↗
        </a>
      </div>
    </motion.div>
  );
}
```

- [ ] **Commit:**
```bash
git add components/bento/blocks/HeroBlock.tsx
git commit -m "feat: add HeroBlock grid card"
```

---

## Task 4: CompactHero — sticky header during expand

**Files:**
- Create: `components/bento/CompactHero.tsx`

- [ ] **Create `components/bento/CompactHero.tsx`:**

```tsx
"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

type Props = {
  onBack: () => void;
};

export function CompactHero({ onBack }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-[60] flex h-14 items-center justify-between border-b border-border/50 bg-background/80 px-6 backdrop-blur-md"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          G
        </div>
        <div>
          <p className="text-sm font-semibold leading-none text-foreground">
            Gabriel Almeida
          </p>
          <p className="mt-0.5 font-mono text-[10px] text-foreground-muted">
            BSc Informatics Eng · UC
          </p>
        </div>
      </div>

      <button
        onClick={onBack}
        className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-foreground-muted transition-colors hover:border-border/80 hover:text-foreground"
        aria-label="Back to overview"
      >
        <ArrowLeft size={12} />
        Overview
      </button>
    </motion.div>
  );
}
```

- [ ] **Commit:**
```bash
git add components/bento/CompactHero.tsx
git commit -m "feat: add CompactHero sticky header for expand state"
```

---

## Task 5: RetreatedStrip — chip row for non-expanded blocks

**Files:**
- Create: `components/bento/RetreatedStrip.tsx`

- [ ] **Create `components/bento/RetreatedStrip.tsx`:**

```tsx
"use client";

import { motion } from "framer-motion";
import { BLOCK_META } from "@/components/bento/types";
import type { BlockId } from "@/components/bento/types";
import { cn } from "@/lib/utils";

type Props = {
  expandedId: BlockId;
  onSelect: (id: BlockId) => void;
};

export function RetreatedStrip({ expandedId, onSelect }: Props) {
  const others = BLOCK_META.filter((b) => b.id !== expandedId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.25 }}
      className="mb-3 flex flex-wrap gap-2"
    >
      {others.map((block) => (
        <button
          key={block.id}
          onClick={() => onSelect(block.id)}
          className={cn(
            "rounded-lg border border-border bg-background-secondary px-3 py-1.5",
            "font-mono text-[10px] uppercase tracking-widest text-foreground-muted",
            "opacity-40 transition-opacity hover:opacity-70"
          )}
        >
          {block.label}
        </button>
      ))}
    </motion.div>
  );
}
```

- [ ] **Commit:**
```bash
git add components/bento/RetreatedStrip.tsx
git commit -m "feat: add RetreatedStrip chip row for non-expanded blocks"
```

---

## Task 6: ExpandedOverlay — full-screen overlay with layoutId morph

**Files:**
- Create: `components/bento/ExpandedOverlay.tsx`

**Context:** This wraps each block's expanded view. The `layoutId` matches the collapsed card in the grid — Framer Motion morphs the block from its grid position to fill the overlay. `inset-4` (not `inset-0`) gives a 16px margin so the block looks "lifted" rather than covering the entire screen edge-to-edge.

- [ ] **Create `components/bento/ExpandedOverlay.tsx`:**

```tsx
"use client";

import { motion } from "framer-motion";
import type { BlockId } from "@/components/bento/types";

type Props = {
  id: BlockId;
  onClose: () => void;
  children: React.ReactNode;
};

export function ExpandedOverlay({ id, onClose, children }: Props) {
  return (
    <>
      {/* Scrim */}
      <motion.div
        key="scrim"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Expanded block — layoutId morphs from grid position */}
      <motion.div
        key={`expanded-${id}`}
        layoutId={`block-${id}`}
        transition={{ type: "spring", stiffness: 300, damping: 35 }}
        className="fixed inset-4 top-[72px] z-50 overflow-y-auto rounded-2xl border border-primary/20 bg-card shadow-[0_0_60px_rgba(59,130,246,0.08)]"
        style={{ originX: 0.5, originY: 0.5 }}
      >
        {children}
      </motion.div>
    </>
  );
}
```

**Note on `top-[72px]`:** This is `14px compact-header-height + 4px inset + ~54px header = ~72px`. Adjust to `top-[80px]` if the compact header is taller.

- [ ] **Commit:**
```bash
git add components/bento/ExpandedOverlay.tsx
git commit -m "feat: add ExpandedOverlay with layoutId morph and scrim"
```

---

## Task 7: ResearchBlock — collapsed + expanded

**Files:**
- Create: `components/bento/blocks/ResearchBlock.tsx`

- [ ] **Create `components/bento/blocks/ResearchBlock.tsx`:**

```tsx
import { ExternalLink } from "lucide-react";

/** Reusable chip for topic tags */
function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 font-mono text-[10px] text-primary">
      {children}
    </span>
  );
}

// ── Collapsed (grid card) ──────────────────────────────────────────────────

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

// ── Expanded (overlay) ─────────────────────────────────────────────────────

export function ResearchBlockExpanded({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-8">
      {/* Header */}
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

      {/* Metadata grid */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
        {[
          { label: "Period",       value: "Sep 2025 – Present" },
          { label: "Target Venue", value: "ISSRE 2026" },
          { label: "Role",         value: "Undergraduate Researcher" },
          { label: "Dept.",        value: "DEI · CISUC" },
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

      {/* Description */}
      <p className="text-sm leading-relaxed text-foreground-muted">
        Researching Software Diversity architecture to improve global system
        performance and resilience. The core hypothesis explores how intentional
        functional diversity — both human-designed and LLM-generated — can reduce
        correlated failures in distributed systems and make software more adaptable
        to novel conditions.
      </p>

      {/* Topics */}
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
```

- [ ] **Commit:**
```bash
git add components/bento/blocks/ResearchBlock.tsx
git commit -m "feat: add ResearchBlock collapsed and expanded views"
```

---

## Task 8: CTFBlock — skill bars + expanded

**Files:**
- Create: `components/bento/blocks/CTFBlock.tsx`

- [ ] **Create `components/bento/blocks/CTFBlock.tsx`:**

```tsx
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

// ── Collapsed ──────────────────────────────────────────────────────────────

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

// ── Expanded ───────────────────────────────────────────────────────────────

export function CTFBlockExpanded({ onClose }: { onClose: () => void }) {
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
```

- [ ] **Commit:**
```bash
git add components/bento/blocks/CTFBlock.tsx
git commit -m "feat: add CTFBlock with skill bars and expanded view"
```

---

## Task 9: JeKnowledgeBlock — experience card

**Files:**
- Create: `components/bento/blocks/JeKnowledgeBlock.tsx`

- [ ] **Create `components/bento/blocks/JeKnowledgeBlock.tsx`:**

```tsx
// ── Collapsed ──────────────────────────────────────────────────────────────

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

// ── Expanded ───────────────────────────────────────────────────────────────

export function JeKnowledgeBlockExpanded({ onClose }: { onClose: () => void }) {
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

      <p className="text-sm leading-relaxed text-foreground-muted">
        Promoted from Trainee to Junior Developer within a dynamic junior enterprise
        environment. Worked in cross-functional teams to build and deliver real-world
        software solutions, gaining hands-on experience in a startup-like setting with
        professional engineering standards.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {["React", "Node.js", "TypeScript", "Agile", "Team Collaboration"].map((t) => (
          <span key={t} className="rounded-full border border-amber-500/20 bg-amber-500/5 px-2.5 py-0.5 font-mono text-[10px] text-amber-400">{t}</span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Commit:**
```bash
git add components/bento/blocks/JeKnowledgeBlock.tsx
git commit -m "feat: add JeKnowledgeBlock collapsed and expanded views"
```

---

## Task 10: GitHubBlock — live repo data

**Files:**
- Create: `components/bento/blocks/GitHubBlock.tsx`

**Context:** `PinnedRepo` from `types/index.ts`. The server passes `repos: PinnedRepo[]` through `BentoGrid` props. No client-side fetching needed.

- [ ] **Create `components/bento/blocks/GitHubBlock.tsx`:**

```tsx
import { Star, GitFork, ExternalLink } from "lucide-react";
import type { PinnedRepo } from "@/types";

type Props = { repos: PinnedRepo[] };

// ── Collapsed ──────────────────────────────────────────────────────────────

export function GitHubBlockCollapsed({ repos }: Props) {
  const totalStars = repos.reduce((s, r) => s + r.stargazerCount, 0);

  return (
    <div className="flex h-full flex-col justify-between p-6">
      <div>
        <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-green-400">
          Open Source
        </p>
        <h3 className="font-sans text-lg font-bold leading-snug">
          GitHub
        </h3>
        <p className="mt-1 font-mono text-xs text-foreground-muted">
          {repos.length} pinned repos · {totalStars} stars
        </p>
      </div>
      <div className="flex flex-col gap-2 pt-3">
        {repos.slice(0, 2).map((r) => (
          <div key={r.name} className="flex items-center justify-between gap-2">
            <span className="truncate font-mono text-[10px] text-foreground">{r.name}</span>
            <span className="shrink-0 flex items-center gap-1 font-mono text-[10px] text-foreground-muted">
              <Star size={9} /> {r.stargazerCount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Expanded ───────────────────────────────────────────────────────────────

export function GitHubBlockExpanded({ repos, onClose }: Props & { onClose: () => void }) {
  return (
    <div className="p-8">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-green-400">
        Open Source · GitHub
      </p>
      <h2 className="font-sans text-3xl font-bold leading-tight tracking-tight">
        Pinned Repositories
      </h2>

      <hr className="my-6 border-border" />

      {repos.length === 0 ? (
        <p className="text-sm text-foreground-muted">
          No repos found. Add <code className="font-mono text-xs">GITHUB_TOKEN</code> and{" "}
          <code className="font-mono text-xs">GITHUB_USERNAME</code> to <code className="font-mono text-xs">.env.local</code>.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {repos.map((repo) => (
            <a
              key={repo.name}
              href={repo.homepageUrl ?? repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-3 rounded-xl border border-border/50 bg-background-secondary p-4 transition-colors hover:border-primary/30"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-sans text-sm font-semibold text-foreground">{repo.name}</span>
                <ExternalLink size={12} className="mt-0.5 shrink-0 text-foreground-muted opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              {repo.description && (
                <p className="line-clamp-2 text-xs leading-relaxed text-foreground-muted">
                  {repo.description}
                </p>
              )}
              <div className="flex items-center justify-between text-xs text-foreground-muted">
                {repo.primaryLanguage ? (
                  <span className="flex items-center gap-1.5">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: repo.primaryLanguage.color ?? "#6b7280" }}
                    />
                    {repo.primaryLanguage.name}
                  </span>
                ) : <span />}
                <span className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Star size={10} /> {repo.stargazerCount}</span>
                  <span className="flex items-center gap-1"><GitFork size={10} /> {repo.forkCount}</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Commit:**
```bash
git add components/bento/blocks/GitHubBlock.tsx
git commit -m "feat: add GitHubBlock with live pinned repos"
```

---

## Task 11: SkillsBlock and ContactBlock — static cards

**Files:**
- Create: `components/bento/blocks/SkillsBlock.tsx`
- Create: `components/bento/blocks/ContactBlock.tsx`

- [ ] **Create `components/bento/blocks/SkillsBlock.tsx`:**

```tsx
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
```

- [ ] **Create `components/bento/blocks/ContactBlock.tsx`:**

```tsx
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
          href="https://linkedin.com/in/gabrielserensalmeida"
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
```

- [ ] **Commit:**
```bash
git add components/bento/blocks/SkillsBlock.tsx components/bento/blocks/ContactBlock.tsx
git commit -m "feat: add SkillsBlock and ContactBlock static cards"
```

---

## Task 12: BentoGrid — container with state and layout

**Files:**
- Create: `components/bento/BentoGrid.tsx`

**Context:** This is the single source of truth for `expandedId`. It sets `data-bento-expanded` on `<body>` to trigger the CSS that hides the Navbar and LiveBar. It renders the grid and, when expanded, mounts the `CompactHero`, `RetreatedStrip`, and `ExpandedOverlay`.

- [ ] **Create `components/bento/BentoGrid.tsx`:**

```tsx
"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { BlockId } from "@/components/bento/types";
import { BLOCK_META } from "@/components/bento/types";
import { CompactHero } from "@/components/bento/CompactHero";
import { RetreatedStrip } from "@/components/bento/RetreatedStrip";
import { ExpandedOverlay } from "@/components/bento/ExpandedOverlay";
import { HeroBlock } from "@/components/bento/blocks/HeroBlock";
import { ResearchBlockCollapsed, ResearchBlockExpanded } from "@/components/bento/blocks/ResearchBlock";
import { CTFBlockCollapsed, CTFBlockExpanded } from "@/components/bento/blocks/CTFBlock";
import { JeKnowledgeBlockCollapsed, JeKnowledgeBlockExpanded } from "@/components/bento/blocks/JeKnowledgeBlock";
import { GitHubBlockCollapsed, GitHubBlockExpanded } from "@/components/bento/blocks/GitHubBlock";
import { SkillsBlock } from "@/components/bento/blocks/SkillsBlock";
import { ContactBlock } from "@/components/bento/blocks/ContactBlock";
import type { PinnedRepo } from "@/types";

type Props = { repos: PinnedRepo[] };

function ExpandedContent({
  id,
  repos,
  onClose,
}: {
  id: BlockId;
  repos: PinnedRepo[];
  onClose: () => void;
}) {
  switch (id) {
    case "research":    return <ResearchBlockExpanded onClose={onClose} />;
    case "ctf":         return <CTFBlockExpanded onClose={onClose} />;
    case "jeknowledge": return <JeKnowledgeBlockExpanded onClose={onClose} />;
    case "github":      return <GitHubBlockExpanded repos={repos} onClose={onClose} />;
  }
}

export function BentoGrid({ repos }: Props) {
  const [expandedId, setExpandedId] = useState<BlockId | null>(null);

  // Sync body attribute for CSS navbar/livebar hide rule
  useEffect(() => {
    if (expandedId) {
      document.body.setAttribute("data-bento-expanded", "true");
    } else {
      document.body.removeAttribute("data-bento-expanded");
    }
    return () => document.body.removeAttribute("data-bento-expanded");
  }, [expandedId]);

  // Escape key to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpandedId(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const expand = (id: BlockId) => setExpandedId(id);
  const collapse = () => setExpandedId(null);

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-8">

      {/* Compact hero header — mounts when anything is expanded */}
      <AnimatePresence>
        {expandedId && <CompactHero onBack={collapse} />}
      </AnimatePresence>

      {/* Retreated block chips */}
      <AnimatePresence>
        {expandedId && (
          <RetreatedStrip expandedId={expandedId} onSelect={expand} />
        )}
      </AnimatePresence>

      {/* Expanded overlay (layoutId morph) */}
      <AnimatePresence>
        {expandedId && (
          <ExpandedOverlay id={expandedId} onClose={collapse}>
            <ExpandedContent id={expandedId} repos={repos} onClose={collapse} />
          </ExpandedOverlay>
        )}
      </AnimatePresence>

      {/* ── The grid (always rendered) ─────────────────────────── */}
      <div className="grid grid-cols-12 gap-3 [grid-auto-rows:minmax(140px,auto)]">

        {/* Hero — col-span-8, row-span-2 */}
        <HeroBlock isAnyExpanded={!!expandedId} />

        {/* CTF */}
        <motion.div
          layoutId="block-ctf"
          animate={{ opacity: expandedId && expandedId !== "ctf" ? 0.2 : 1 }}
          transition={{ duration: 0.3 }}
          onClick={() => !expandedId && expand("ctf")}
          className={cn(
            "col-span-12 md:col-span-4 md:row-span-2 min-h-[220px]",
            "cursor-pointer rounded-2xl border border-border/50 bg-[#0d1117]",
            "transition-colors hover:border-green-500/30"
          )}
        >
          <CTFBlockCollapsed />
        </motion.div>

        {/* Research */}
        <motion.div
          layoutId="block-research"
          animate={{ opacity: expandedId && expandedId !== "research" ? 0.2 : 1 }}
          transition={{ duration: 0.3 }}
          onClick={() => !expandedId && expand("research")}
          className={cn(
            "col-span-12 md:col-span-6 md:row-span-2 min-h-[220px]",
            "cursor-pointer rounded-2xl border border-primary/20 bg-card/20",
            "transition-colors hover:border-primary/40"
          )}
          style={{ background: "linear-gradient(135deg, hsl(var(--color-card)/0.2) 60%, rgba(59,130,246,0.04))" }}
        >
          <ResearchBlockCollapsed />
        </motion.div>

        {/* jeKnowledge */}
        <motion.div
          layoutId="block-jeknowledge"
          animate={{ opacity: expandedId && expandedId !== "jeknowledge" ? 0.2 : 1 }}
          transition={{ duration: 0.3 }}
          onClick={() => !expandedId && expand("jeknowledge")}
          className={cn(
            "col-span-12 md:col-span-6 md:row-span-2 min-h-[220px]",
            "cursor-pointer rounded-2xl border border-border/50 bg-card/20",
            "transition-colors hover:border-amber-500/30"
          )}
        >
          <JeKnowledgeBlockCollapsed />
        </motion.div>

        {/* GitHub */}
        <motion.div
          layoutId="block-github"
          animate={{ opacity: expandedId && expandedId !== "github" ? 0.2 : 1 }}
          transition={{ duration: 0.3 }}
          onClick={() => !expandedId && expand("github")}
          className={cn(
            "col-span-12 md:col-span-4 md:row-span-2 min-h-[220px]",
            "cursor-pointer rounded-2xl border border-border/50 bg-card/20",
            "transition-colors hover:border-green-500/30"
          )}
        >
          <GitHubBlockCollapsed repos={repos} />
        </motion.div>

        {/* Skills — non-expandable */}
        <div
          className={cn(
            "col-span-12 md:col-span-4 min-h-[140px]",
            "transition-opacity duration-300",
            expandedId ? "opacity-20" : "opacity-100"
          )}
        >
          <SkillsBlock />
        </div>

        {/* Contact — non-expandable */}
        <div
          className={cn(
            "col-span-12 md:col-span-4 min-h-[140px]",
            "transition-opacity duration-300",
            expandedId ? "opacity-20" : "opacity-100"
          )}
        >
          <ContactBlock />
        </div>

      </div>
    </div>
  );
}
```

**Note on `col-span-8 row-span-2` for hero:** The hero block has these classes inside `HeroBlock` itself (see Task 3). The remaining columns in row 1-2 are filled by CTF (col-span-4). Rows 3-4 are Research (col-span-6) + jeKnowledge (col-span-6). Row 5 starts with GitHub (col-span-4) then Skills (col-span-4) + Contact (col-span-4). Total: 12 + 12 + 12 = three full rows. ✓

- [ ] **Commit:**
```bash
git add components/bento/BentoGrid.tsx
git commit -m "feat: add BentoGrid container with expand/collapse state"
```

---

## Task 13: Wire up app/page.tsx

**Files:**
- Modify: `app/page.tsx`

- [ ] **Replace `app/page.tsx` with:**

```tsx
import { fetchPinnedRepos } from "@/lib/github";
import { BentoGrid } from "@/components/bento/BentoGrid";

export default async function Home() {
  const repos = await fetchPinnedRepos();
  return <BentoGrid repos={repos} />;
}
```

- [ ] **Commit:**
```bash
git add app/page.tsx
git commit -m "feat: wire BentoGrid into homepage, remove old section layout"
```

---

## Task 14: Visual verification checklist

No automated test infrastructure exists in this project. Verify these scenarios manually in the browser after running `pnpm dev`:

**Grid state (default)**
- [ ] All 7 blocks render in the expected 12-column layout on desktop (≥ 768px)
- [ ] On mobile (< 768px), all blocks stack to full width
- [ ] Hero block shows name, status dot, and CTA buttons
- [ ] CTF block shows skill bars with correct labels
- [ ] Research block shows title and topic chips
- [ ] GitHub block shows repo count and star count (or empty state if no token)

**Expand interaction**
- [ ] Clicking the Research block: other blocks fade to ~20% opacity; Research morphs to overlay; compact header slides in from top
- [ ] Clicking the CTF block: same behaviour with CTF content expanded
- [ ] Clicking the jeKnowledge block: amber colour scheme in expanded view
- [ ] Clicking the GitHub block: repo list renders in expanded view
- [ ] Expanded overlay is scrollable if content overflows the viewport
- [ ] Clicking the scrim (dark area behind overlay) closes the expanded state
- [ ] Pressing `Escape` closes the expanded state
- [ ] Clicking "Overview" in compact header closes the expanded state

**Chip strip navigation**
- [ ] While Research is expanded, the chip strip shows CTF Lab, jeKnowledge, GitHub chips
- [ ] Clicking a chip in the strip switches directly to that block's expanded view (no back-to-grid step)

**Layout chrome**
- [ ] The site Navbar is hidden when any block is expanded
- [ ] The Spotify LiveBar (bottom) is hidden when any block is expanded
- [ ] Both Navbar and LiveBar reappear when returning to grid state
- [ ] No layout shift when opening/closing the expanded state

**Reduced motion**
- [ ] With `prefers-reduced-motion: reduce` set in OS/browser, block expand still works but with no animation (Framer Motion respects this automatically)

- [ ] If all checks pass, commit a final cleanup commit:
```bash
git commit --allow-empty -m "chore: bento grid implementation complete"
```

---

## Self-Review Notes

- **Spec coverage check:**
  - Hero → compact header ✓ (Task 4 + 12)
  - Block expand with layoutId morph ✓ (Task 6 + 12)
  - Other blocks retreat to 0.2 opacity ✓ (Task 12)
  - RetreatedStrip with chip navigation ✓ (Task 5)
  - Escape key close ✓ (Task 12)
  - Scrim click to close ✓ (Task 6)
  - Navbar hide via `data-bento-expanded` CSS ✓ (Task 1)
  - LiveBar hide ✓ (Task 1 — `[role="complementary"]` selector matches LiveBar)
  - Mobile 1-column stacked ✓ (`col-span-12` default, `md:col-span-N` overrides)
  - Vertical scroll permitted ✓ (no forced above-fold constraint)

- **Type consistency:**
  - `BlockId` defined in `components/bento/types.ts`, used consistently across BentoGrid, RetreatedStrip, ExpandedOverlay
  - `onClose: () => void` prop naming consistent across all `*Expanded` components
  - `repos: PinnedRepo[]` passes from `page.tsx` → `BentoGrid` → `GitHubBlock*`

- **`ExpandedContent` switch**: covers all 4 `BlockId` values — TypeScript will error at compile time if a new value is added to `BlockId` without updating the switch. ✓
