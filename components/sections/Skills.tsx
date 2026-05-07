"use client";

import type { LucideIcon } from "lucide-react";
import { Monitor, Server, Terminal } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type SkillCategory = {
  label: string;
  icon: LucideIcon;
  skills: string[];
};

const categories: SkillCategory[] = [
  {
    label: "Frontend",
    icon: Monitor,
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    label: "Backend",
    icon: Server,
    skills: ["Node.js", "Python", "Django", "Ruby on Rails", "PostgreSQL"],
  },
  {
    label: "Infrastructure & DevOps",
    icon: Terminal,
    skills: ["Docker", "GitHub Actions", "Git", "Linux"],
  },
];

export function Skills() {
  const sectionRef = useScrollReveal<HTMLElement>({
    selector: "[data-reveal]",
    stagger: 0.13,
    start: "top 82%",
  });

  return (
    <section id="skills" ref={sectionRef} className="py-24">
      <div className="mx-auto max-w-6xl px-4">

        {/* --- Header --- */}
        <div data-reveal className="mb-16">
          <p className="mb-2 font-mono text-xs tracking-widest uppercase text-primary">
            Skills
          </p>
          <h2 className="font-sans text-3xl font-bold tracking-tight sm:text-4xl">
            What I work with
          </h2>
        </div>

        {/* --- Category cards --- */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.label}
                data-reveal
                className="flex flex-col gap-5 rounded-xl border border-border/50 bg-card/20 p-6 transition-colors hover:bg-card/50"
              >
                {/* Category header */}
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-background-secondary">
                    <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="font-sans text-sm font-semibold tracking-wide text-foreground">
                    {cat.label}
                  </h3>
                </div>

                {/* Skill badges */}
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md border border-border bg-background-secondary px-2.5 py-1 font-mono text-xs text-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
