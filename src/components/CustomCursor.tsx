"use client";

import { useEffect, useRef, useState } from "react";

const BRONZE = "#8B7355";
const LERP = 0.18;
const SIZE = 8;
const SCALE_HOVER = 1.5;
const OPACITY_DEFAULT = 0.7;
const OPACITY_HOVER = 0.9;

const HOVER_SELECTOR =
  "a, button, [role='button'], .interactive, [data-cursor-hover]";

export default function CustomCursor() {
  const elRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const hoverRef = useRef(false);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isTouch =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setDisabled(isTouch || prefersReduced);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || disabled) return;

    const handleMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleOver = (e: MouseEvent) => {
      const el = e.target as Element | null;
      if (el?.closest(HOVER_SELECTOR)) hoverRef.current = true;
    };

    const handleOut = (e: MouseEvent) => {
      const related = e.relatedTarget as Element | null;
      if (!related?.closest(HOVER_SELECTOR)) hoverRef.current = false;
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.addEventListener("mouseover", handleOver, { passive: true });
    document.addEventListener("mouseout", handleOut, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
    };
  }, [disabled]);

  useEffect(() => {
    if (disabled) return;

    targetRef.current = {
      x: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
      y: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
    };
    posRef.current = { ...targetRef.current };

    let raf: number | null = null;

    const tick = () => {
      const pos = posRef.current;
      const target = targetRef.current;
      pos.x += (target.x - pos.x) * LERP;
      pos.y += (target.y - pos.y) * LERP;

      const el = elRef.current;
      if (el) {
        const scale = hoverRef.current ? SCALE_HOVER : 1;
        const opacity = hoverRef.current ? OPACITY_HOVER : OPACITY_DEFAULT;
        el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${scale})`;
        el.style.opacity = String(opacity);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, [disabled]);

  if (disabled) return null;

  return (
    <div
      ref={elRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full"
      style={{
        width: SIZE,
        height: SIZE,
        backgroundColor: BRONZE,
        opacity: OPACITY_DEFAULT,
        willChange: "transform",
      }}
      aria-hidden
    />
  );
}
