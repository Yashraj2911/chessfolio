"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { Space_Grotesk } from "next/font/google";
import AmbientParticles from "@/components/AmbientParticles";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const BRONZE = "#8B7355";

const entries = [
  {
    year: "2025",
    role: "Software Engineer",
    company: "Hiba Inc",
    tech: ["Stripe", "GitHub Actions", "Flutter Web", "CI/CD"],
    bullets: [
      "Stripe payment integration",
      "CI/CD automation with GitHub Actions",
      "SEO optimization for Flutter web",
      "Production web application deployment",
    ],
  },
  {
    year: "2021–2022",
    role: "Full Stack Developer",
    company: "Anita Software Consultancy",
    tech: ["React", "Node", "Postgres", "REST APIs"],
    bullets: [
      "ERP systems (School, Hospital)",
      "React/Node/Postgres",
      "REST APIs",
      "System testing & debugging",
    ],
  },
  {
    year: "2019",
    role: "Embedded Software Intern",
    company: "Shree Vighnaharta Associates",
    tech: ["Flutter", "UI Design", "Debugging"],
    bullets: [
      "Dynamic shopping portal",
      "UI implementation",
      "Debugging and system validation",
    ],
  },
];

type Entry = (typeof entries)[number];

const motionTransition = {
  duration: 0.8,
  ease: "easeOut" as const,
};

const techContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const techPillVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

function TimelineEntry({
  entry,
  side,
  index,
}: {
  entry: Entry;
  side: "left" | "right";
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const prefersReducedMotion = useReducedMotion();
  const initialX = side === "left" ? -60 : 60;

  return (
    <div
      className="relative flex min-h-[85vh] w-full items-center lg:min-h-screen"
      style={{
        justifyContent: index % 2 === 0 ? "flex-start" : "flex-end",
      }}
    >
      {/* Timeline marker at center line */}
      <div
        className="absolute left-1/2 top-1/2 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ backgroundColor: BRONZE }}
      />
      <div
        ref={ref}
        className="relative max-w-xl"
      >
        {/* Active entry glow */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-[700ms]"
          style={{
            background:
              "radial-gradient(circle at center, rgba(139,115,85,0.12), transparent 70%)",
            opacity: inView ? 1 : 0,
          }}
        />
        <motion.div
          initial={
            prefersReducedMotion
              ? { opacity: 1, x: 0, y: 0 }
              : { opacity: 0, x: initialX, y: 40 }
          }
          whileInView="visible"
          viewport={{ amount: 0.5 }}
          variants={{
            visible: { opacity: 1, x: 0, y: 0 },
          }}
          transition={
            prefersReducedMotion ? { duration: 0 } : motionTransition
          }
          className={`relative px-6 py-4 sm:px-8 ${side === "left" ? "text-left" : "text-right"} transition-transform duration-300 transition-shadow duration-300 hover:-translate-y-1 hover:shadow-[0_10px_15px_-3px_rgba(139,115,85,0.15)]`}
        >
          <p
            className="text-sm font-medium tracking-wide"
            style={{ color: BRONZE }}
          >
            {entry.year}
          </p>
          <h3
            className={`${spaceGrotesk.className} mt-1 text-2xl font-semibold text-white sm:text-3xl lg:text-4xl xl:text-5xl`}
          >
            {entry.role}
          </h3>
          <p className="mt-0.5 text-lg text-white/70 sm:text-xl lg:text-2xl">
            {entry.company}
          </p>
          <motion.div
            className={`mt-6 flex flex-wrap gap-3 ${side === "right" ? "justify-end" : ""}`}
            variants={techContainerVariants}
            initial="hidden"
            animate={
              prefersReducedMotion ? "visible" : inView ? "visible" : "hidden"
            }
          >
            {entry.tech.map((label) => (
              <motion.span
                key={label}
                variants={techPillVariants}
                transition={
                  prefersReducedMotion ? { duration: 0 } : { duration: 0.4 }
                }
                className="rounded-full border border-[#8B7355]/30 px-3 py-1 text-xs font-medium uppercase tracking-wide text-[#8B7355] opacity-80 sm:text-sm"
              >
                {label}
              </motion.span>
            ))}
          </motion.div>
          <ul
            className={`mt-4 space-y-1.5 text-sm leading-relaxed text-white/80 sm:text-base ${
              side === "left"
                ? "list-inside list-disc pl-0 text-left"
                : "list-inside list-disc pl-0 text-right"
            }`}
          >
            {entry.bullets.map((bullet, i) => (
              <li key={i}>{bullet}</li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

export default function ExperienceTimeline() {
  return (
    <section className="relative bg-gradient-to-b from-neutral-950 via-neutral-950 to-black py-24 md:py-32">
      <AmbientParticles opacityRange={[0.2, 0.32]} />
      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139,115,85,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,115,85,0.4) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      {/* Vertical vignette */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40"
      />
      {/* Heading — centered only */}
      <header className="relative text-center">
        <h2
          className={`${spaceGrotesk.className} text-4xl font-semibold text-white sm:text-5xl lg:text-6xl`}
        >
          Played <span style={{ color: BRONZE }}>Moves</span>
        </h2>
        <p className="mt-4 text-lg text-white/55 sm:text-xl">
          Each move shaped the position.
        </p>
      </header>

      {/* Timeline container */}
      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Center vertical line */}
        <div
          className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
          style={{ backgroundColor: `${BRONZE}20` }}
        />

        {entries.map((entry, index) => (
          <TimelineEntry
            key={`${entry.year}-${entry.company}`}
            entry={entry}
            side={index % 2 === 0 ? "left" : "right"}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
