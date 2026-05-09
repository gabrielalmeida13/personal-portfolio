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
