"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGSAP, ScrollTrigger } from "@/lib/gsap";

type Options = {
  selector?: string;
  y?: number;
  duration?: number;
  stagger?: number;
  start?: string;
};

export function useScrollReveal<T extends HTMLElement>(opts: Options = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    registerGSAP();

    const container = ref.current;
    if (!container) return;

    const targets = opts.selector
      ? container.querySelectorAll<HTMLElement>(opts.selector)
      : [container];

    if (targets.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        y: opts.y ?? 36,
        opacity: 0,
        duration: opts.duration ?? 0.65,
        stagger: opts.stagger ?? 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container,
          start: opts.start ?? "top 82%",
          once: true,
        },
      });
    }, container);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [opts.selector, opts.y, opts.duration, opts.stagger, opts.start]);

  return ref;
}
