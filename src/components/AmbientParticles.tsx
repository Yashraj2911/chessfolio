"use client";

import { useRef, useEffect } from "react";

const BRONZE_RGB = "139, 115, 85";
const PARTICLE_COUNT = 75;
const HORIZONTAL_DRIFT = 0.5;
const MIN_SIZE = 50;

type Particle = {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
};

type AmbientParticlesProps = {
  opacityRange: [number, number];
  speedMultiplier?: number;
  horizontalDrift?: number;
};

function createParticles(
  width: number,
  height: number,
  opacityRange: [number, number],
  speedMultiplier: number
): Particle[] {
  const particles: Particle[] = [];
  const r = () => Math.random();
  const [opMin, opMax] = opacityRange;
  const opSpan = opMax - opMin;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: r() * width,
      y: r() * height,
      size: 2 + r(),
      speed: (0.3 + r() * 0.3) * speedMultiplier,
      opacity: opMin + r() * opSpan,
    });
  }
  return particles;
}

export default function AmbientParticles({
  opacityRange,
  speedMultiplier = 1,
  horizontalDrift = HORIZONTAL_DRIFT,
}: AmbientParticlesProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[] | null>(null);
  const scrollDeltaRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let rafId: number | null = null;
    let running = true;

    const onScroll = () => {
      const scrollY = window.scrollY ?? document.documentElement.scrollTop;
      scrollDeltaRef.current += scrollY - lastScrollYRef.current;
      lastScrollYRef.current = scrollY;
    };

    lastScrollYRef.current = window.scrollY ?? document.documentElement.scrollTop;
    window.addEventListener("scroll", onScroll, { passive: true });

    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);
      const prev = sizeRef.current;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        sizeRef.current = { w, h };
        if (!particlesRef.current) {
          particlesRef.current = createParticles(
            w,
            h,
            opacityRange,
            speedMultiplier
          );
        } else if (prev.w > 0 && prev.h > 0) {
          particlesRef.current.forEach((p) => {
            p.x = p.x * (w / prev.w);
            p.y = p.y * (h / prev.h);
          });
        }
      } else {
        sizeRef.current = { w, h };
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        running = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0, rootMargin: "50px" }
    );
    observer.observe(wrapper);

    resize();
    if (
      !particlesRef.current &&
      sizeRef.current.w >= MIN_SIZE &&
      sizeRef.current.h >= MIN_SIZE
    ) {
      particlesRef.current = createParticles(
        sizeRef.current.w,
        sizeRef.current.h,
        opacityRange,
        speedMultiplier
      );
    }

    const tick = () => {
      if (!running) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const rect = wrapper.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        sizeRef.current = { w, h };
      }

      // Create particles once we have valid canvas dimensions
      if (
        !particlesRef.current &&
        w >= MIN_SIZE &&
        h >= MIN_SIZE
      ) {
        particlesRef.current = createParticles(
          w,
          h,
          opacityRange,
          speedMultiplier
        );
      }

      const delta = scrollDeltaRef.current;
      scrollDeltaRef.current = 0;

      if (particlesRef.current) {
        ctx.clearRect(0, 0, w, h);

        for (const p of particlesRef.current) {
          p.x += delta * horizontalDrift;
          p.y -= p.speed;
          if (p.y < -5) {
            p.y = h + 5 + Math.random() * 10;
            p.x = Math.random() * w;
          }

          if (p.x < -p.size * 2 || p.x > w + p.size * 2) continue;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${BRONZE_RGB}, ${p.opacity})`;
          ctx.fill();
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrapper);

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
      resizeObserver.disconnect();
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [opacityRange, speedMultiplier, horizontalDrift]);

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden
      />
    </div>
  );
}
