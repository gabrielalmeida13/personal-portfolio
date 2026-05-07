"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

type TimelineEntry = {
  period: string;
  role: string;
  company: string;
  description: string;
};

const timeline: TimelineEntry[] = [
  {
    period: "Sep 2025 - Present",
    role: "Undergraduate Student Researcher",
    company: "Departamento de Engenharia Informatica - Universidade de Coimbra",
    description:
      "Researching Software Diversity architecture to improve global system performance. Exploring the synergy between human-generated diversity and LLM capabilities to optimize software adaptability.",
  },
  {
    period: "Sep 2025 - Present",
    role: "Member & CTF Player",
    company: "CyberSecurity Laboratory @CISUC",
    description:
      "Developing technical challenges for Capture The Flag (CTF) competitions to foster security awareness. Competing internationally in Reverse Engineering, Pwn, and Web security.",
  },
  {
    period: "Mar 2025 - Oct 2025",
    role: "Junior Software Developer",
    company: "jeKnowledge",
    description:
      "Promoted from Trainee to Junior Developer. Worked in a dynamic junior enterprise environment, building and delivering software solutions.",
  },
  {
    period: "Jan 2024 - Jul 2024",
    role: "Researcher (Talentos DEI)",
    company: "Departamento de Engenharia Informatica - Universidade de Coimbra",
    description:
      "Awarded a Research Initiation Scholarship. Focused on implementing methods to recognize and identify anomalous patterns in complex datasets.",
  },
];

export function About() {
  const sectionRef = useScrollReveal<HTMLElement>({
    selector: "[data-reveal]",
    stagger: 0.12,
    start: "top 80%",
  });

  return (
    <section id="about" ref={sectionRef} className="py-24">
      <div className="mx-auto max-w-6xl px-4">

        {/* --- Header --- */}
        <div data-reveal className="mb-16">
          <p className="mb-2 font-mono text-xs tracking-widest uppercase text-primary">
            About
          </p>
          <h2 className="font-sans text-3xl font-bold tracking-tight sm:text-4xl">
            Who I am
          </h2>
        </div>

        {/* --- Bio + Photo --- */}
        <div className="mb-20 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_2fr] lg:items-start">

          {/* Photo placeholder */}
          <div
            data-reveal
            className="aspect-square w-full max-w-[320px] overflow-hidden rounded-lg border border-border bg-background-secondary"
          >
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-mono text-xs text-foreground-muted">
                [ photo ]
              </span>
            </div>
          </div>

          {/* Bio */}
          <div data-reveal className="flex flex-col gap-5">
            <p className="text-base leading-relaxed text-foreground-muted">
              I am an Informatics Engineering BSc student at the University of
              Coimbra (UC) with a strong foundation in systems architecture and
              security. My academic journey is driven by a deep curiosity for
              how systems work under the hood, and I intend to further this
              passion by pursuing a Master&apos;s in Software Engineering.
            </p>
            <p className="text-base leading-relaxed text-foreground-muted">
              I thrive in research and collaborative environments, blending
              theoretical knowledge with hands-on challenges in software
              optimization, AI integration, and cybersecurity.
            </p>
          </div>
        </div>

        {/* --- Experience Timeline --- */}
        <div data-reveal className="mb-8">
          <p className="mb-2 font-mono text-xs tracking-widest uppercase text-primary">
            Experience
          </p>
          <h3 className="font-sans text-2xl font-semibold tracking-tight">
            Experience &amp; Research
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {timeline.map((entry) => (
            <div
              key={entry.role}
              data-reveal
              className="flex flex-col gap-4 rounded-xl border border-border/50 bg-card/20 p-6 transition-colors hover:bg-card/50"
            >
              {/* Date badge */}
              <span className="font-mono text-xs text-primary">
                {entry.period}
              </span>

              {/* Role + company */}
              <div className="flex flex-col gap-1">
                <p className="font-sans text-base font-semibold leading-snug text-foreground">
                  {entry.role}
                </p>
                <p className="text-sm text-foreground-muted">{entry.company}</p>
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed text-foreground-muted">
                {entry.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
