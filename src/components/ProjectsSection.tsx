"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { Space_Grotesk } from "next/font/google";
import AmbientParticles from "@/components/AmbientParticles";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const BRONZE = "#8B7355";

type FeaturedProject = {
  title: string;
  description: string;
  highlights: string[];
  tech: string[];
  liveUrl?: string;
  githubUrl?: string;
  githubLinks?: { label: string; href: string }[];
};

type SupportingProject = {
  title: string;
  description: string;
  githubUrl: string;
};

const featuredProjects: FeaturedProject[] = [
  {
    title: "Yamuna Bhandar",
    description:
      "Production e-commerce platform built with React and modern deployment practices.",
    highlights: [
      "SEO optimized architecture",
      "CI/CD pipeline integration",
      "MVC structured backend",
      "Performance tuned frontend",
    ],
    tech: ["React", "Next.js", "Tailwind", "Node"],
    liveUrl: "https://www.yamunabhandar.in",
  },
  {
    title: "Systems Engineering Suite",
    description:
      "Low-level systems programming projects focused on memory management and concurrency.",
    highlights: [
      "Custom user-level threading",
      "Shared memory IPC",
      "Custom memory allocator",
      "Linux performance optimization (400s → 21s)",
    ],
    tech: ["C", "Concurrency", "Memory Management", "Linux"],
    githubLinks: [
      { label: "IPC-Shared-Memory", href: "https://github.com/Yashraj2911/IPC-Shared-Memory" },
      { label: "User-level-Memory-Management", href: "https://github.com/Yashraj2911/User-level-Memory-Management" },
      { label: "User-level-Thread-Library-and-Scheduler", href: "https://github.com/Yashraj2911/User-level-Thread-Library-and-Scheduler" },
    ],
  },
  {
    title: "CS2 Veto",
    description:
      "Interactive veto simulation tool with dynamic UI and match logic.",
    highlights: [
      "Custom veto logic",
      "Smooth animations",
      "Component-driven architecture",
    ],
    tech: ["React", "Framer Motion", "UI Design"],
    liveUrl: "https://cs2-veto-liart.vercel.app/",
  },
];

const supportingProjects: SupportingProject[] = [
  { title: "Pastebin", description: "OA backend app.", githubUrl: "https://github.com/Yashraj2911" },
  { title: "Chessfolio", description: "This portfolio.", githubUrl: "https://github.com/Yashraj2911/chessfolio" },
  { title: "IPC Shared Memory", description: "Shared memory IPC implementation.", githubUrl: "https://github.com/Yashraj2911/IPC-Shared-Memory" },
  { title: "User-level Memory Management", description: "Custom memory allocator.", githubUrl: "https://github.com/Yashraj2911/User-level-Memory-Management" },
  { title: "Thread Scheduler", description: "User-level thread library and scheduler.", githubUrl: "https://github.com/Yashraj2911/User-level-Thread-Library-and-Scheduler" },
];

const gridTexture = [
  "repeating-linear-gradient(0deg, rgba(139,115,85,0.03) 0px, rgba(139,115,85,0.03) 1px, transparent 1px, transparent 40px)",
  "repeating-linear-gradient(90deg, rgba(139,115,85,0.03) 0px, rgba(139,115,85,0.03) 1px, transparent 1px, transparent 40px)",
].join(", ");

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const transition = { duration: 0.5, ease: "easeOut" as const };

const CARD_PADDING = "px-6 py-8 sm:px-8 sm:py-10";
const CARD_RADIUS = "rounded-lg";
const CARD_MIN_HEIGHT = "min-h-[380px]";

const techPillContainerVariants = {
  idle: {},
  hover: { transition: { staggerChildren: 0.05 } },
};
const techPillVariants = {
  idle: { opacity: 0.85, scale: 0.98 },
  hover: { opacity: 1, scale: 1 },
};

const SPOTLIGHT_THROTTLE_MS = 32;

function FeaturedCard({ project }: { project: FeaturedProject }) {
  const prefersReducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const throttleRef = useRef(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = cardRef.current;
      const spot = spotlightRef.current;
      if (!el || !spot) return;
      const now = Date.now();
      if (now - throttleRef.current < SPOTLIGHT_THROTTLE_MS) return;
      throttleRef.current = now;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      spot.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(139,115,85,0.15), transparent 60%)`;
    },
    []
  );

  return (
    <motion.article
      variants={itemVariants}
      transition={prefersReducedMotion ? { duration: 0 } : transition}
      className="group relative h-full"
    >
      <motion.div
        ref={cardRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        data-cursor-hover
        className={`relative flex h-full flex-col justify-between overflow-hidden border border-white/10 bg-black/40 ${CARD_RADIUS} ${CARD_PADDING} ${CARD_MIN_HEIGHT} transition-[box-shadow,border-color,transform] duration-300`}
        whileHover={{
          y: -6,
          scale: 1.02,
          boxShadow: "0 0 60px rgba(139,115,85,0.15)",
          borderColor: "rgba(139,115,85,0.5)",
        }}
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
      >
        {/* Cursor-following spotlight */}
        <div
          ref={spotlightRef}
          className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(139,115,85,0.15), transparent 60%)",
          }}
        />
        <div className="relative z-10 flex flex-1 flex-col">
          <h3 className={`${spaceGrotesk.className} text-2xl font-semibold text-white sm:text-3xl lg:text-4xl`}>
            {project.title}
          </h3>
          <p className="mt-3 text-base leading-relaxed text-white/70 sm:text-lg">
            {project.description}
          </p>
          <ul className="mt-4 list-inside space-y-1.5 text-sm text-white/80 sm:text-base">
            {project.highlights.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <motion.div
          className="relative z-10 mt-6 flex flex-wrap gap-3"
          variants={techPillContainerVariants}
          initial="idle"
          animate={isHovered ? "hover" : "idle"}
        >
          {project.tech.map((t) => (
            <motion.span
              key={t}
              variants={techPillVariants}
              transition={{ duration: 0.25 }}
              className="rounded-full border border-[#8B7355]/30 px-3 py-1 text-xs font-medium uppercase tracking-wide text-[#8B7355] opacity-85 sm:text-sm"
            >
              {t}
            </motion.span>
          ))}
        </motion.div>
        <div className="relative z-10 mt-6 flex flex-wrap gap-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[#8B7355] underline-offset-2 hover:underline"
            >
              GitHub
            </a>
          )}
          {project.githubLinks?.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[#8B7355] underline-offset-2 hover:underline"
            >
              {link.label}
            </a>
          ))}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[#8B7355] underline-offset-2 hover:underline"
            >
              Live
            </a>
          )}
        </div>
      </motion.div>
    </motion.article>
  );
}

function SupportingCard({ project }: { project: SupportingProject }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.article
      variants={itemVariants}
      transition={prefersReducedMotion ? { duration: 0 } : { ...transition, delay: 0.15 }}
      className="group relative h-full"
    >
      <a
        href={project.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor-hover
        className={`flex h-full flex-col justify-between border border-white/10 bg-black/40 ${CARD_RADIUS} ${CARD_PADDING} min-h-[200px] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-[#8B7355]/50 hover:shadow-[0_0_60px_rgba(139,115,85,0.15)]`}
      >
        <div>
          <h4 className={`${spaceGrotesk.className} text-lg font-semibold text-white sm:text-xl`}>
            {project.title}
          </h4>
          <p className="mt-2 text-sm text-white/60">{project.description}</p>
        </div>
        <span className="mt-4 inline-block text-sm font-medium text-[#8B7355] opacity-80 group-hover:underline">
          GitHub →
        </span>
      </a>
    </motion.article>
  );
}

export default function ProjectsSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className="relative bg-black py-24 md:py-32"
      style={{ backgroundImage: gridTexture }}
    >
      <AmbientParticles opacityRange={[0.18, 0.28]} />
      {/* Center guideline */}
      <div
        className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 lg:block"
        style={{ backgroundColor: `${BRONZE}18` }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Divider */}
        <div className="relative mb-16 w-full md:mb-20">
          <div className="h-px w-full bg-[#8B7355]/20" />
          <div
            className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8B7355]"
          />
        </div>

        {/* Section title — animated */}
        <motion.header
          className="mb-16 text-center md:mb-20"
          initial={prefersReducedMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ amount: 0.3, once: true }}
          variants={titleVariants}
          transition={prefersReducedMotion ? { duration: 0 } : transition}
        >
          <h2
            className={`${spaceGrotesk.className} text-4xl font-semibold text-white sm:text-5xl lg:text-6xl`}
          >
            Tactical <span style={{ color: BRONZE }}>Positions</span>
          </h2>
          <p className="mt-4 text-lg text-white/55 sm:text-xl">
            Selected positions. Engineered under constraints.
          </p>
        </motion.header>

        {/* Featured — 2-col grid, equal height */}
        <motion.div
          className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12"
          variants={containerVariants}
          initial={prefersReducedMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ amount: 0.2, once: true }}
        >
          <FeaturedCard project={featuredProjects[0]} />
          <FeaturedCard project={featuredProjects[1]} />
        </motion.div>

        {/* CS2 Veto — centered second row */}
        <motion.div
          className="mt-8 flex justify-center lg:mt-12"
          variants={itemVariants}
          initial={prefersReducedMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ amount: 0.2, once: true }}
          transition={prefersReducedMotion ? { duration: 0 } : transition}
        >
          <div className="w-full max-w-xl lg:max-w-2xl">
            <FeaturedCard project={featuredProjects[2]} />
          </div>
        </motion.div>

        {/* Supporting — 2-col grid, equal height cards */}
        <motion.div
          className="mt-20 grid grid-cols-1 gap-6 md:mt-24 md:grid-cols-2 md:gap-8"
          variants={containerVariants}
          initial={prefersReducedMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ amount: 0.15, once: true }}
        >
          {supportingProjects.map((project) => (
            <SupportingCard key={project.title} project={project} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
