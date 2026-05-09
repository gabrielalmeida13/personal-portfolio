# Dynamic Bento Box Portfolio — Design Spec
**Date:** 2026-05-09  
**Status:** Approved for implementation

---

## 1. Goal

Replace the current section-by-section scrolling homepage with a **Dynamic Bento Box** layout. The surface aesthetic mirrors Stripe/Vercel (clean, dark, high contrast), but the interaction layer is powered by Framer Motion `layoutId` animations. Recruiters should immediately sense technical depth — the complexity lives in the interactions, not the decoration.

---

## 2. Core Interaction Model

### Default grid state
- A CSS Grid of heterogeneous blocks (different column/row spans) displayed on screen.
- Grid is a 12-column layout. Blocks vary from 4-column (small) to 8-column (large).
- The grid may scroll vertically — no requirement to force everything above the fold.
- Each block has a hover affordance (subtle border glow + micro-scale).

### Expand interaction
1. User clicks a content block.
2. Framer Motion `layoutId` drives a smooth shared-element transition: the clicked block expands to fill the content area.
3. All other content blocks **smoothly shrink and fade** to ~35% opacity, rendered as compact labeled chips in a row at the top.
4. The hero block does **not** fade — instead it transitions via its own `layoutId` into a compact sticky header anchored at the top of the screen (shows name + role, plus a "back" affordance).
5. The expanded block reveals full detail: title, organisation, period, role, description, topic chips.
6. Clicking "Back to overview" or pressing `Escape` reverses the animation back to the full grid.

### Mobile (< 768px)
- Single-column stacked layout. No grid spans.
- Each block is a full-width card. Tap to expand works identically.
- Hero compact header on expand is the same behaviour.

---

## 3. Blocks (Content Units)

| Block ID      | Grid span (col × row) | Content                                                  | Accent    |
|---------------|----------------------|----------------------------------------------------------|-----------|
| `hero`        | 8 × 2               | Name, role, status dot, CTA buttons                      | —         |
| `ctf`         | 4 × 2               | CTF & CyberSec Lab @CISUC, skill bars (Rev/Pwn/Web/Crypto) | green     |
| `research`    | 6 × 2               | ISSRE 2026 / Software Diversity + LLM research            | blue      |
| `jeknowledge` | 6 × 2               | jeKnowledge Junior Dev experience                         | amber     |
| `skills`      | 4 × 1               | Tech stack chip cloud                                     | —         |
| `github`      | 4 × 1               | Live GitHub stats (pinned repos via API)                  | green     |
| `contact`     | 4 × 1               | Short CTA + email/LinkedIn links                          | —         |

Blocks that are expandable: `ctf`, `research`, `jeknowledge`, `github`. The `hero`, `skills`, and `contact` blocks are non-expandable (hero transitions to compact header; skills/contact are utility blocks with no expanded detail view).

---

## 4. Hero → Compact Header Transition

When any block is expanded:
- The hero block uses a shared `layoutId="hero"` to animate from its grid position into a fixed header bar at `top: 0`.
- The compact header shows: avatar circle + "Gabriel Almeida" + role text + a `←` back button.
- Uses `AnimatePresence` to swap between the grid hero and the compact header.
- The compact header has `position: fixed`, `z-index: 50`, with a `backdrop-blur` background.

---

## 5. Retreated Blocks Strip

When a block expands, the non-expanded, non-hero blocks render as a horizontal strip of small labeled chips below the compact header:
- Each chip shows the block label (e.g. "CTF Lab", "jeKnowledge", "Skills").
- The currently expanded block's chip is hidden (it's what's showing).
- Clicking a chip from the strip transitions directly to that block's expanded view (no back-to-grid step needed).
- Chips are `opacity: 0.4` with `pointer-events` active.

---

## 6. Component Architecture

```
app/page.tsx
  └── <BentoGrid>           — grid container, manages expandedId state
        ├── <HeroBlock>     — hero content OR compact header (layoutId="hero")
        ├── <BentoBlock>    — generic expandable block wrapper
        │     ├── collapsed view (grid card)
        │     └── expanded view (full detail panel)
        └── <RetreatedStrip> — shown only when expandedId is set
```

### State
- Single `expandedId: string | null` in `BentoGrid` (useState).
- All animation logic driven by this one value — no complex state machine needed.
- `useEffect` adds/removes `keydown` listener for `Escape` to close.

### Key Framer Motion patterns
- `layoutId` on each block's outer `motion.div` for position/size transition.
- `layout` prop on the grid container so siblings reflow smoothly.
- `AnimatePresence` wrapping expanded content so it fades in after the layout transition settles.
- `initial/animate/exit` variants on the retreated chips strip.

---

## 7. Styling & Aesthetic

- **Theme:** Dark-first (`#0a0a0a` bg, `#111` surface). Light mode toggle preserved via `next-themes` but dark is the primary experience.
- **Font:** Geist for headings/UI (already in project). JetBrains Mono for tags/chips.
- **Accent colour:** Blue `#3B82F6` (primary), green `#22c55e` (security/open-source), amber `#f59e0b` (experience).
- **Card surface:** `bg-card/20` with `border border-border/50` — same tokens already in globals.css.
- **Expanded block:** `border-primary/25` + `shadow-[0_0_40px_rgba(59,130,246,0.06)]` subtle glow.
- **No new CSS files** — all via Tailwind utility classes + existing CSS variables.

---

## 8. What is NOT Changing

- All API routes (`/api/github`, `/api/spotify`, `/api/contact`) — unchanged.
- Blog pages — unchanged.
- `globals.css` CSS variables — unchanged.
- `Navbar.tsx` — the root navbar is hidden **only on the homepage** when a block is expanded. Mechanism: `BentoGrid` sets a `data-bento-expanded` attribute on `<body>` via `useEffect`; a CSS rule in `globals.css` targets `body[data-bento-expanded] header` with `display: none`. No changes to `Navbar.tsx` itself; no changes to `app/layout.tsx`.
- `Footer.tsx` — unchanged and always visible.

---

## 9. Files to Create / Modify

| File | Action |
|------|--------|
| `app/page.tsx` | Replace section imports with `<BentoGrid>` |
| `components/bento/BentoGrid.tsx` | New — grid container + state |
| `components/bento/HeroBlock.tsx` | New — hero + compact header (replaces `components/sections/Hero.tsx` for homepage) |
| `components/bento/BentoBlock.tsx` | New — generic expandable block |
| `components/bento/RetreatedStrip.tsx` | New — dimmed chips row |
| `components/bento/blocks/ResearchBlock.tsx` | New — expanded content for research |
| `components/bento/blocks/CTFBlock.tsx` | New — expanded content for CTF |
| `components/bento/blocks/JeKnowledgeBlock.tsx` | New — expanded content for jeKnowledge |
| `components/bento/blocks/GitHubBlock.tsx` | New — live GitHub stats card |
| `components/sections/Hero.tsx` | Kept as-is (used nowhere after this, can be deleted later) |

---

## 10. Out of Scope

- Drag-to-reorder blocks.
- Persisting expanded state in the URL (future enhancement).
- Any changes to the blog, contact API, or Spotify widget.
- Adding new API integrations beyond what already exists.
