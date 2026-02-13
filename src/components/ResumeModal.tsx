"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useCallback } from "react";

const BRONZE = "#8B7355";

type ResumeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, handleEscape]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          onClick={handleOverlayClick}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative flex h-[85vh] w-[90%] max-w-5xl flex-col rounded-xl border bg-neutral-950 shadow-[0_0_80px_rgba(139,115,85,0.2)]"
            style={{ borderColor: `${BRONZE}40` }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-lg p-2 text-white/70 transition-colors duration-200 hover:text-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#8B7355]/50"
              aria-label="Close resume"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>

            <div className="flex flex-1 flex-col overflow-hidden rounded-lg p-4 pt-14">
              <iframe
                src="/resume/Yashraj_Nikam_Resume.pdf"
                title="Resume"
                className="h-full w-full rounded-lg"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
