"use client";

import { useEffect, useRef } from "react";

type LenisInstance = { raf: (time: number) => void; destroy: () => void };

export default function SmoothScroll() {
  const lenisRef = useRef<LenisInstance | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isTouch =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isDesktop = window.innerWidth >= 768;

    if (!isDesktop || isTouch || prefersReduced) return;

    let mounted = true;

    import("lenis").then(({ default: Lenis }) => {
      if (!mounted) return;

      const lenis = new Lenis({
        lerp: 0.08,
        smoothWheel: true,
        syncTouch: false,
      });
      lenisRef.current = lenis;

      const raf = (time: number) => {
        lenis.raf(time);
        rafRef.current = requestAnimationFrame(raf);
      };
      rafRef.current = requestAnimationFrame(raf);
    });

    return () => {
      mounted = false;
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  return null;
}
