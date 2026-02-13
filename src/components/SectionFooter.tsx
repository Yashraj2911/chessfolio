"use client";

import { useState } from "react";
import { Space_Grotesk } from "next/font/google";
import ResumeModal from "@/components/ResumeModal";
import AmbientParticles from "@/components/AmbientParticles";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const gridTexture = [
  "repeating-linear-gradient(0deg, rgba(139,115,85,0.03) 0px, rgba(139,115,85,0.03) 1px, transparent 1px, transparent 40px)",
  "repeating-linear-gradient(90deg, rgba(139,115,85,0.03) 0px, rgba(139,115,85,0.03) 1px, transparent 1px, transparent 40px)",
].join(", ");

const links = [
  { label: "LinkedIn", href: "https://linkedin.com/in/yashrajnikam" },
  { label: "GitHub", href: "https://github.com/Yashraj2911" },
  { label: "Email", href: "mailto:yashrajnikam3@gmail.com" },
];

export default function SectionFooter() {
  const [showResume, setShowResume] = useState(false);

  return (
    <footer
      className="relative overflow-hidden bg-neutral-950 pt-32 pb-24"
      style={{ backgroundImage: gridTexture }}
    >
      <AmbientParticles opacityRange={[0.12, 0.18]} />
      <ResumeModal isOpen={showResume} onClose={() => setShowResume(false)} />

      {/* Fade-out gradient to black at bottom */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, transparent 60%, black 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2
            className={`${spaceGrotesk.className} text-4xl font-semibold text-white sm:text-5xl lg:text-6xl`}
          >
            Your move.
          </h2>
          <p className="mt-4 text-lg text-white/50 sm:text-xl">
            Let&apos;s build something deliberate.
          </p>
        </div>

        <nav className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative text-sm font-medium text-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:text-[#8B7355]"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => setShowResume(true)}
            className="text-sm font-medium text-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:text-[#8B7355]"
          >
            Resume
          </button>
        </nav>
      </div>
    </footer>
  );
}
