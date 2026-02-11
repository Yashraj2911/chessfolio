"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const skills = [
  "System architecture",
  "Performance optimization",
  "Product strategy",
  "Reliable execution",
];

export default function SectionFour() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative min-h-screen bg-black py-24 lg:py-32">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={prefersReducedMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.8, ease: "easeOut" }
          }
          className="space-y-8 text-left"
        >
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-white/60 sm:text-sm">
              The Endgame
            </p>
            <h2
              className={`${spaceGrotesk.className} text-3xl font-medium text-white sm:text-4xl lg:text-5xl`}
            >
              The <span className="text-[#8B7355]">Endgame</span>
            </h2>
            <p className="text-lg font-light text-white/60 sm:text-xl">
              Fewer moves. Higher accuracy.
            </p>
          </div>

          <div className="border-l border-[#8B7355] pl-6">
            <ul className="space-y-4 text-base font-light text-white/60 sm:text-lg">
              {skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>

          <div>
          <a
  href="https://linkedin.com/in/yashrajnikam"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-3 border border-neutral-700 px-8 py-4 text-sm uppercase tracking-wider transition-all duration-300 hover:bg-[#8B7355]/10 hover:border-[#8B7355] hover:text-[#8B7355]
"
>
  <span className="font-medium">Your move.</span>
  <span className="text-xs opacity-60">↗</span>
</a>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
