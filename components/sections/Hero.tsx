"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Scene = dynamic(
  () => import("@/components/three/Scene").then((m) => ({ default: m.Scene })),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full rounded-lg border border-border bg-background-secondary" />
    ),
  }
);

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const itemInstant = {
  hidden: { opacity: 1, y: 0 },
  show: { opacity: 1, y: 0 },
};

export function Hero() {
  const reducedMotion = useReducedMotion();

  /*
   * Gate the animation behind requestAnimationFrame so it fires after the
   * first browser paint, not after the full JS bundle (which includes the
   * Three.js dynamic chunk) has finished evaluating.
   */
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const animateState = ready ? "show" : "hidden";

  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100vh-4rem)] items-center"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-4 py-20 lg:grid-cols-2 lg:items-center">

        {/* --- Text column --- */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={animateState}
          className="flex flex-col gap-6"
        >
          <motion.p
            variants={reducedMotion ? itemInstant : item}
            className="font-mono text-xs tracking-widest uppercase text-primary"
          >
            BSc Student in Informatics Engineering @UC
          </motion.p>

          <motion.h1
            variants={reducedMotion ? itemInstant : item}
            className="font-sans text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
          >
            Informatics Engineering
            <br />
            <span className="text-primary">Student &amp; Researcher</span>
          </motion.h1>

          <motion.p
            variants={reducedMotion ? itemInstant : item}
            className="max-w-md text-base leading-relaxed text-foreground-muted"
          >
            Bridging academic theory and practical engineering. Focused on
            software diversity, cybersecurity, and optimizing system
            performance.
          </motion.p>

          <motion.div
            variants={reducedMotion ? itemInstant : item}
            className="flex flex-wrap gap-3"
          >
            <Button asChild size="lg">
              <a href="/#projects">View Projects</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="/#contact">Contact Me</a>
            </Button>
          </motion.div>
        </motion.div>

        {/* --- 3D column (loads independently, never blocks text animation) --- */}
        <div className="h-[380px] w-full lg:h-[540px]">
          {reducedMotion ? (
            <div className="h-full w-full rounded-lg border border-border bg-background-secondary" />
          ) : (
            <Scene />
          )}
        </div>

      </div>
    </section>
  );
}
