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
