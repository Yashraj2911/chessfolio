"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

type TextBlock = {
  start: number;
  end: number;
  lines: string[];
};

const textBlocks: TextBlock[] = [
  {
    start: 0,
    end: 0.2,
    lines: ["I don't just build features.", "I think in systems."],
  },
  {
    start: 0.2,
    end: 0.5,
    lines: ["Strategy.", "Precision.", "Optimization."],
  },
  {
    start: 0.5,
    end: 0.8,
    lines: ["Trade-offs are inevitable.", "Execution decides outcomes."],
  },
  {
    start: 0.8,
    end: 1,
    lines: ["Engineering. Every move."],
  },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const scrollProgressRef = useRef(0);
  const progressRef = useRef(0);
  const currentFrameRef = useRef(-1);
  const prefersReducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);

  const transitions = useMemo(
    () => ({
      hidden: { opacity: 0, y: 12 },
      visible: { opacity: 1, y: 0 },
    }),
    []
  );

  useEffect(() => {
    const preloadCount =
      "ontouchstart" in window || navigator.maxTouchPoints > 0 ? 10 : 20;
    for (let i = 0; i < preloadCount; i += 1) {
      const img = new Image();
      img.src = `/frames/frame_${String(i).padStart(4, "0")}.webp`;
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setProgress(0);
      scrollProgressRef.current = 0;
      progressRef.current = 0;
      currentFrameRef.current = 0;
      const image = imageRef.current;
      if (image) {
        image.src = "/frames/frame_0000.webp";
      }
      return;
    }

    const totalFrames = 192;
    let rafId = 0;
    const update = () => {
      const section = sectionRef.current;
      if (!section) {
        rafId = requestAnimationFrame(update);
        return;
      }

      const rect = section.getBoundingClientRect();
      const scrollTop = window.scrollY || window.pageYOffset;
      const sectionTop = scrollTop + rect.top;
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;
      const totalScroll = Math.max(sectionHeight - viewportHeight, 1);
      const currentScroll = scrollTop - sectionTop;
      const nextProgress = clamp(currentScroll / totalScroll, 0, 1);

      scrollProgressRef.current = nextProgress;
      if (Math.abs(nextProgress - progressRef.current) > 0.002) {
        progressRef.current = nextProgress;
        setProgress(nextProgress);
      }

      const index = Math.min(
        totalFrames - 1,
        Math.floor(nextProgress * totalFrames)
      );
      if (index !== currentFrameRef.current) {
        currentFrameRef.current = index;
        const image = imageRef.current;
        if (image) {
          image.src = `/frames/frame_${String(index).padStart(4, "0")}.webp`;
        }
      }

      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [prefersReducedMotion]);

  return (
    <section ref={sectionRef} className="relative h-[400vh] bg-black">
      <div className="sticky top-0 h-screen overflow-visible">
        <img
          ref={imageRef}
          className="absolute inset-0 h-full w-full object-cover"
          src="/frames/frame_0000.webp"
          alt=""
          aria-hidden="true"
          draggable={false}
        />

        <div className="relative z-10 flex h-full w-full flex-col justify-start pl-8 pr-6 pt-[22vh] sm:pr-10 lg:pl-20 lg:pr-16 lg:pt-[28vh]">
        <div className="relative w-full max-w-2xl text-left text-white h-[260px] sm:h-[300px] lg:h-[340px]">
  {textBlocks.map((block) => {
    const isActive =
      progress >= block.start && progress < block.end;

    const shouldShow = prefersReducedMotion
      ? block.start === 0
      : isActive;

    return (
      <motion.div
        key={block.lines.join(" ")}
        variants={transitions}
        initial="hidden"
        animate={shouldShow ? "visible" : "hidden"}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: 0.6, ease: "easeOut" }
        }
        className="absolute inset-0 space-y-4"
      >
        {block.lines.map((line) => (
          <p
            key={line}
                      className={`${spaceGrotesk.className} text-2xl font-medium leading-[1.08] tracking-[-0.02em] text-white sm:text-4xl lg:text-5xl xl:text-6xl`}
          >
            {line.includes("Engineering. Every move.") ? (
              <>
                <span>Engineering.</span>
                <br />
                <span>
                  Every{" "}
                  <span className="text-[#8B7355]">
                    move.
                  </span>
                </span>
              </>
            ) : (
              line
            )}
          </p>
        ))}
      </motion.div>
    );
  })}
</div>

        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>
    </section>
  );
}
