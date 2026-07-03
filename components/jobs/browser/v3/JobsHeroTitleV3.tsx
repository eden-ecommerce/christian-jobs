"use client";

import { useEffect, useState } from "react";

const ROTATING_WORDS = [
  "purpose",
  "faith",
  "courage",
  "passion",
  "vision",
] as const;

const ROTATE_MS = 2000;
const FADE_MS = 600;

const LONGEST_ROTATING_WORD = ROTATING_WORDS.reduce((longest, word) =>
  word.length > longest.length ? word : longest,
);

/** Hero tagline — "Work with [word]" cycles the third word with a soft fade. */
export function JobsHeroTitleV3({
  variant = "default",
}: {
  variant?: "default" | "onImage";
} = {}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReduceMotion = () => setReduceMotion(mediaQuery.matches);
    syncReduceMotion();
    mediaQuery.addEventListener("change", syncReduceMotion);
    return () => mediaQuery.removeEventListener("change", syncReduceMotion);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % ROTATING_WORDS.length);
    }, ROTATE_MS);

    return () => window.clearInterval(interval);
  }, [reduceMotion]);

  const isOnImage = variant === "onImage";

  return (
    <h2
      className={`mt-3 text-[2.5rem] font-semibold leading-[1.08] tracking-[-0.025em] sm:text-[3.25rem] lg:text-[3.5rem] ${
        isOnImage ? "text-white" : "text-[#1d1d1f]"
      }`}
      aria-live={reduceMotion ? undefined : "polite"}
    >
      <span className="inline-flex flex-wrap items-baseline justify-center gap-x-[0.28em]">
        <span>Work with</span>
        <span
          className={`inline-grid justify-items-start text-left ${isOnImage ? "text-[#c8e6a0]" : "text-[#235A0E]"}`}
        >
          <span
            aria-hidden
            className="invisible col-start-1 row-start-1 select-none whitespace-nowrap"
          >
            {LONGEST_ROTATING_WORD}
          </span>
          {ROTATING_WORDS.map((word, index) => (
            <span
              key={word}
              className="col-start-1 row-start-1 whitespace-nowrap transition-opacity ease-in-out"
              style={{
                opacity: index === activeIndex ? 1 : 0,
                transitionDuration: `${FADE_MS}ms`,
              }}
              aria-hidden={index !== activeIndex}
            >
              {word}
            </span>
          ))}
        </span>
      </span>
    </h2>
  );
}
