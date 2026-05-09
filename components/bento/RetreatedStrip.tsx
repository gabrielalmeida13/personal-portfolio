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
