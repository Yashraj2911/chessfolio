"use client";

import type { MouseEvent } from "react";
import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const projects = [
  {
    title: "Positioning Engine",
    description:
      "A systems-first workflow that aligns product intent, data signals, and execution.",
    tech: "Next.js, TypeScript, Postgres",
  },
  {
    title: "Tempo Analytics",
    description:
      "Operational insights that reveal momentum shifts and execution bottlenecks.",
    tech: "React, Node.js, Redis",
  },
  {
    title: "Endgame Ops",
    description:
      "A streamlined delivery pipeline built for resilience, traceability, and speed.",
    tech: "Go, Kafka, Kubernetes",
  },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

type Project = (typeof projects)[number];

function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const currentRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });

  const animate = () => {
    const card = cardRef.current;
    if (!card) {
      rafRef.current = null;
      return;
    }

    const current = currentRef.current;
    const target = targetRef.current;
    const nextX = current.x + (target.x - current.x) * 0.12;
    const nextY = current.y + (target.y - current.y) * 0.12;
    currentRef.current = { x: nextX, y: nextY };
    card.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`;

    if (Math.abs(target.x - nextX) > 0.1 || Math.abs(target.y - nextY) > 0.1) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      rafRef.current = null;
    }
  };

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) {
      return;
    }
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const dx = (x - rect.width / 2) / (rect.width / 2);
    const dy = (y - rect.height / 2) / (rect.height / 2);
    targetRef.current = {
      x: clamp(dx, -1, 1) * 6,
      y: clamp(dy, -1, 1) * 6,
    };
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(animate);
    }
  };

  const handleLeave = () => {
    targetRef.current = { x: 0, y: 0 };
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(animate);
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="flex flex-col gap-4 border border-neutral-800 p-8 transition-all duration-300 hover:border-[#8B7355]"
    >
      <h3
        className={`${spaceGrotesk.className} text-xl font-medium text-white sm:text-2xl`}
      >
        {project.title}
      </h3>
      <p className="text-base font-light leading-relaxed text-white/60">
        {project.description}
      </p>
      <p className="text-sm uppercase tracking-[0.2em] text-white/40">
        {project.tech}
      </p>
    </div>
  );
}

export default function SectionThree() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative min-h-screen overflow-hidden bg-neutral-950 py-20 sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
        <div className="h-full w-full bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.04)_0,rgba(255,255,255,0.04)_1px,transparent_1px,transparent_40px),repeating-linear-gradient(90deg,rgba(255,255,255,0.04)_0,rgba(255,255,255,0.04)_1px,transparent_1px,transparent_40px)]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={prefersReducedMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.8, ease: "easeOut" }
          }
          className="space-y-6 text-left"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-white/60 sm:text-sm">
            The Middle Game
          </p>
          <h2
            className={`${spaceGrotesk.className} text-3xl font-medium text-white sm:text-4xl lg:text-5xl`}
          >
            The <span className="text-[#8B7355]">Middle</span> Game
          </h2>
          <p className="max-w-2xl text-base font-light leading-relaxed text-white/60 sm:text-lg">
            Complex systems demand clarity under pressure. Each project balances
            structure, iteration, and precision to convert strategy into
            reliable execution.
          </p>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.7, ease: "easeOut" }
          }
          className="grid gap-16 lg:grid-cols-2"
        >
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
