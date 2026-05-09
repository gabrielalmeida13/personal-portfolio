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
