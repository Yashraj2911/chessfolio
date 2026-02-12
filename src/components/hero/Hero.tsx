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
  const rafRef = useRef<number | null>(null);
  const loadedFramesRef = useRef<Set<number>>(new Set());
  const idleHandleRef = useRef<number | null>(null);
  const isCancelledRef = useRef(false);
  const sectionMetricsRef = useRef({
    top: 0,
    height: 0,
    totalScroll: 1,
  });
  const prefersReducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [isBlurred, setIsBlurred] = useState(true);

  const getFrameSrc = (index: number) =>
    `/frames/frame_${String(index).padStart(4, "0")}.webp`;

  const loadFrame = (index: number) => {
    if (loadedFramesRef.current.has(index)) {
      return;
    }
    const img = new Image();
    img.src = getFrameSrc(index);
    img.onload = () => {
      if (isCancelledRef.current) {
        return;
      }
      if (loadedFramesRef.current.has(index)) {
        return;
      }
      loadedFramesRef.current.add(index);
      if (loadedFramesRef.current.size >= 10) {
        setIsBlurred(false);
      }
    };
  };

  const transitions = useMemo(
    () => ({
      hidden: { opacity: 0, y: 12 },
      visible: { opacity: 1, y: 0 },
    }),
    []
  );

  useEffect(() => {
    const totalFrames = 192;
    const initialEnd = 21;

    for (let i = 0; i < initialEnd; i += 1) {
      loadFrame(i);
    }

    const requestIdle =
      typeof window !== "undefined" && "requestIdleCallback" in window
        ? (window.requestIdleCallback as (cb: () => void) => number)
        : (cb: () => void) => window.setTimeout(cb, 250);

    let nextIndex = initialEnd;
    const batchSize = 8;

    const work = () => {
      if (isCancelledRef.current) {
        return;
      }
      const end = Math.min(nextIndex + batchSize, totalFrames);
      for (let i = nextIndex; i < end; i += 1) {
        loadFrame(i);
      }
      nextIndex = end;
      if (nextIndex < totalFrames) {
        idleHandleRef.current = requestIdle(work);
      }
    };

    idleHandleRef.current = requestIdle(work);

    return () => {
      isCancelledRef.current = true;
      if (idleHandleRef.current) {
        if ("cancelIdleCallback" in window) {
          (window.cancelIdleCallback as (id: number) => void)(
            idleHandleRef.current
          );
        } else {
          clearTimeout(idleHandleRef.current);
        }
      }
    };
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
    const updateMetrics = () => {
      const section = sectionRef.current;
      if (!section) {
        return;
      }
      const rect = section.getBoundingClientRect();
      const scrollTop = window.scrollY || window.pageYOffset;
      const top = scrollTop + rect.top;
      const height = section.offsetHeight;
      const viewportHeight = window.innerHeight;
      sectionMetricsRef.current = {
        top,
        height,
        totalScroll: Math.max(height - viewportHeight, 1),
      };
    };

    const updateFrame = () => {
      const section = sectionRef.current;
      if (!section) {
        rafRef.current = null;
        return;
      }
      const scrollTop = window.scrollY || window.pageYOffset;
      const { top, totalScroll } = sectionMetricsRef.current;
      const currentScroll = scrollTop - top;
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
        loadFrame(index);
        if (image) {
          image.src = getFrameSrc(index);
        }
      }

      rafRef.current = null;
    };

    const handleScroll = () => {
      if (rafRef.current) {
        return;
      }
      rafRef.current = requestAnimationFrame(updateFrame);
    };

    updateMetrics();
    updateFrame();
    window.addEventListener("resize", updateMetrics);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", updateMetrics);
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [prefersReducedMotion]);

  return (
    <section ref={sectionRef} className="relative h-[400vh] bg-black">
      <div className="sticky top-0 h-screen overflow-visible">
        <img
          ref={imageRef}
          className={`absolute inset-0 h-full w-full object-cover transition-[filter] duration-500 ${
            isBlurred ? "blur-[2px]" : "blur-0"
          }`}
          src="/frames/frame_0000.webp"
          alt=""
          aria-hidden="true"
          draggable={false}
        />

        <div className="relative z-10 flex h-full w-full flex-col justify-start pl-8 pr-6 pt-[22vh] sm:pr-10 lg:pl-20 lg:pr-16 lg:pt-[28vh]">
          <div className="relative w-full text-white h-[260px] sm:h-[300px] lg:h-[340px]">
            {textBlocks.map((block, index) => {
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
                  className={`absolute inset-0 flex flex-col space-y-4 ${
                    index % 2 === 0
                      ? "items-start text-left pl-8 lg:pl-20 max-w-2xl"
                      : "items-end text-right pr-8 lg:pr-20 max-w-2xl ml-auto"
                  }`}
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
                          <span className="whitespace-nowrap">
                            Every{" "}
                            <span className="text-[#8B7355]">move.</span>
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
