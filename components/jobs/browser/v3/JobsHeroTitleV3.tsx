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

/** Hero headline — "Work with [word]" cycles the third word with a soft fade. */
export function JobsHeroTitleV3() {
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

  return (
    <h1
      className="mt-3 text-[2.5rem] font-semibold leading-[1.08] tracking-[-0.025em] text-[#1d1d1f] sm:text-[3.25rem] lg:text-[3.5rem]"
      aria-live={reduceMotion ? undefined : "polite"}
    >
      Work with{" "}
      <span className="inline-grid text-[#235A0E]">
        {ROTATING_WORDS.map((word, index) => (
          <span
            key={word}
            className="col-start-1 row-start-1 transition-opacity ease-in-out"
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
    </h1>
  );
}
