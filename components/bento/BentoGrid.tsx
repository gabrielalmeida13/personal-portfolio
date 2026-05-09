"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { BlockId } from "@/components/bento/types";
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

function ExpandedContent({ id, repos }: { id: BlockId; repos: PinnedRepo[] }): React.ReactElement {
  switch (id) {
    case "research":    return <ResearchBlockExpanded />;
    case "ctf":         return <CTFBlockExpanded />;
    case "jeknowledge": return <JeKnowledgeBlockExpanded />;
    case "github":      return <GitHubBlockExpanded repos={repos} />;
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

  // Escape key to close — only register listener when something is expanded
  useEffect(() => {
    if (!expandedId) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpandedId(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [expandedId]);

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
            <ExpandedContent id={expandedId} repos={repos} />
          </ExpandedOverlay>
        )}
      </AnimatePresence>

      {/* ── The grid (always rendered) ─────────────────────────── */}
      <div className="grid grid-cols-12 gap-3 [grid-auto-rows:minmax(140px,auto)]">

        {/* Hero — col-span-8 row-span-2 (class is inside HeroBlock itself) */}
        <HeroBlock isAnyExpanded={!!expandedId} />

        {/* CTF */}
        <motion.div
          layoutId="block-ctf"
          animate={{ opacity: expandedId && expandedId !== "ctf" ? 0.2 : 1 }}
          transition={{ duration: 0.3 }}
          onClick={() => !expandedId && expand("ctf")}
          className={cn(
            "col-span-12 md:col-span-4 md:row-span-2 min-h-[220px]",
            "rounded-2xl border border-border/50 bg-[#0d1117]",
            "transition-colors hover:border-green-500/30",
            expandedId ? "cursor-default" : "cursor-pointer"
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
            "rounded-2xl border border-primary/20 bg-card/20",
            "transition-colors hover:border-primary/40",
            expandedId ? "cursor-default" : "cursor-pointer"
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
            "rounded-2xl border border-border/50 bg-card/20",
            "transition-colors hover:border-amber-500/30",
            expandedId ? "cursor-default" : "cursor-pointer"
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
            "col-span-12 md:col-span-4 min-h-[140px]",
            "rounded-2xl border border-border/50 bg-card/20",
            "transition-colors hover:border-green-500/30",
            expandedId ? "cursor-default" : "cursor-pointer"
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
