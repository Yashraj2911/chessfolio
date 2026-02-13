"use client";

import { motion } from "framer-motion";
import { useRef, useEffect, useCallback } from "react";
import { Space_Grotesk } from "next/font/google";
import AmbientParticles from "@/components/AmbientParticles";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const BRONZE = "#8B7355";

const LINE_RANGES: [number, number][] = [
  [0.05, 0.25],
  [0.25, 0.45],
  [0.45, 0.65],
];

function getLineProgress(progress: number, lineIndex: number): number {
  const [start, end] = LINE_RANGES[lineIndex];
  const range = end - start;
  return Math.max(0, Math.min(1, (progress - start) / range));
}

function HighlightWord({ children }: { children: string }) {
  return (
    <span className="relative inline-block">
      {children}
      <motion.span
        className="absolute bottom-0 left-0 h-px origin-left"
        style={{
          backgroundColor: BRONZE,
          boxShadow: "0 0 8px rgba(139,115,85,0.4)",
        }}
        initial={{ width: "0%" }}
        whileInView={{ width: "100%" }}
        viewport={{ amount: 0.5, once: true }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
      />
    </span>
  );
}

const lines = [
  { text: "Systems before syntax.", align: "left" as const },
  {
    text: "Performance before convenience.",
    align: "right" as const,
    highlight: "Performance",
  },
  {
    text: "Trade-offs before trends.",
    align: "left" as const,
    highlight: "Trade-offs",
  },
];

type LineBlockProps = {
  line: (typeof lines)[number];
  lineRef: React.RefObject<HTMLDivElement | null>;
  index: number;
};

function LineBlock({ line, lineRef }: LineBlockProps) {
  const parts = line.highlight ? line.text.split(line.highlight) : [line.text];
  const hasHighlight = !!line.highlight;

  return (
    <div
      ref={lineRef}
      className={`${spaceGrotesk.className} w-full text-white`}
      style={{
        fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
        lineHeight: 1.3,
        textAlign: line.align,
        opacity: 0,
        transform: "translateY(40px)",
        ...(line.align === "right" && { marginLeft: "auto" }),
      }}
    >
      {hasHighlight ? (
        <>
          {parts[0]}
          <HighlightWord>{line.highlight}</HighlightWord>
          {parts[1]}
        </>
      ) : (
        line.text
      )}
    </div>
  );
}

export default function SectionIdentity() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollProgressRef = useRef(0);
  const lineRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  const onScroll = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const sectionHeight = rect.height;
    const progress =
      (windowHeight - rect.top) / (windowHeight + sectionHeight);
    scrollProgressRef.current = Math.max(0, Math.min(1, progress));
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let rafId: number | null = null;
    let running = true;

    const observer = new IntersectionObserver(
      (entries) => {
        running = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0, rootMargin: "50px" }
    );
    observer.observe(section);

    const tick = () => {
      if (!running) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const progress = scrollProgressRef.current;
      for (let i = 0; i < 3; i++) {
        const el = lineRefs[i].current;
        if (!el) continue;
        const t = getLineProgress(progress, i);
        el.style.opacity = String(t);
        el.style.transform = `translateY(${40 * (1 - t)}px)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black py-24"
    >
      <AmbientParticles opacityRange={[0.22, 0.35]} />
      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-8 sm:space-y-10">
          <p className="text-xs uppercase tracking-[0.35em] text-white/50 sm:text-sm">
            The Player
          </p>
          <div className="space-y-6 sm:space-y-8">
            {lines.map((line, index) => (
              <LineBlock
                key={index}
                line={line}
                lineRef={lineRefs[index]}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
