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
