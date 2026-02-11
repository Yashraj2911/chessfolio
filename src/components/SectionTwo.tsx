"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Space_Grotesk } from "next/font/google";
import ChessField from "@/components/ChessField";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function SectionTwo() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative -mt-[20vh] min-h-screen bg-neutral-950">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ChessField />
      </div>
      <div className="relative z-10">
        <div className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-24 sm:px-10 lg:px-16">
          <motion.div
            initial={prefersReducedMotion ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            variants={{
              hidden: { opacity: 0, y: 40 },
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
              The Opening
            </p>
            <h2
              className={`${spaceGrotesk.className} text-3xl font-medium text-white sm:text-4xl lg:text-5xl`}
            >
              The <span className="text-[#8B7355]">Opening</span>
            </h2>
            <p className="text-lg font-light text-white/70 sm:text-xl">
              Every strong system begins with structure.
            </p>
            <p className="max-w-2xl text-base font-light leading-relaxed text-white/60 sm:text-lg">
              Fundamentals shape the way components connect, decisions flow, and
              outcomes compound. Systems thinking and disciplined engineering
              create clarity, reduce waste, and make every move intentional.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
