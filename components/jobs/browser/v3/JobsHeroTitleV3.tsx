"use client";

import { usePrefersReducedMotion } from "@hooks/jobs/use-prefers-reduced-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const ROTATING_WORDS = [
  "purpose",
  "faith",
  "courage",
  "passion",
  "vision",
] as const;

const ROTATE_MS = 2800;
const WORD_MS = 650;
const WIDTH_MS = 750;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Hero tagline — "Work with [word]" cycles the third word with a centred width shift. */
export function JobsHeroTitleV3({
  variant = "default",
}: {
  variant?: "default" | "onImage";
} = {}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [wordWidths, setWordWidths] = useState<number[]>([]);
  const wordMeasureRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const reduceMotion = usePrefersReducedMotion();

  const measureWidths = useCallback(() => {
    const widths = ROTATING_WORDS.map(
      (word, index) =>
        wordMeasureRefs.current[index]?.getBoundingClientRect().width ?? 0,
    );
    if (widths.every((width) => width > 0)) {
      setWordWidths(widths);
    }
  }, []);

  useLayoutEffect(() => {
    measureWidths();
  }, [measureWidths]);

  useEffect(() => {
    const handleResize = () => measureWidths();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [measureWidths]);

  useEffect(() => {
    if (reduceMotion) return;

    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % ROTATING_WORDS.length);
    }, ROTATE_MS);

    return () => window.clearInterval(interval);
  }, [reduceMotion]);

  const isOnImage = variant === "onImage";
  const activeWidth = wordWidths[activeIndex];
  const wordColour = isOnImage ? "text-[#c8e6a0]" : "text-[#235A0E]";

  return (
    <h2
      className={`relative mt-3 text-center text-[2.5rem] font-semibold leading-[1.08] tracking-[-0.025em] sm:text-[3.25rem] lg:text-[3.5rem] ${
        isOnImage ? "text-white" : "text-[#1d1d1f]"
      }`}
      aria-live={reduceMotion ? undefined : "polite"}
    >
      <span className="inline-flex items-baseline justify-center gap-x-[0.28em]">
        <span className="shrink-0">Work with</span>

        <span
          className={`relative inline-block shrink-0 overflow-hidden align-baseline ${wordColour}`}
          style={{
            width: activeWidth ? `${activeWidth}px` : undefined,
            transition: reduceMotion
              ? undefined
              : `width ${WIDTH_MS}ms ${EASE}`,
          }}
        >
          <span
            aria-hidden
            className="invisible block whitespace-nowrap select-none"
          >
            {ROTATING_WORDS[activeIndex]}
          </span>

          {ROTATING_WORDS.map((word, index) => {
            const isActive = index === activeIndex;
            return (
              <span
                key={word}
                className="absolute left-0 top-0 whitespace-nowrap will-change-[opacity,transform,filter]"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive
                    ? "translateY(0) scale(1)"
                    : "translateY(0.18em) scale(0.985)",
                  filter: isActive ? "blur(0)" : "blur(3px)",
                  transition: reduceMotion
                    ? "none"
                    : `opacity ${WORD_MS}ms ${EASE}, transform ${WORD_MS}ms ${EASE}, filter ${WORD_MS}ms ${EASE}`,
                  pointerEvents: "none",
                }}
                aria-hidden={!isActive}
              >
                {word}
              </span>
            );
          })}
        </span>
      </span>

      <span
        aria-hidden
        className={`pointer-events-none invisible absolute h-0 w-0 overflow-hidden whitespace-nowrap ${wordColour} text-[2.5rem] font-semibold leading-[1.08] tracking-[-0.025em] sm:text-[3.25rem] lg:text-[3.5rem]`}
      >
        {ROTATING_WORDS.map((word, index) => (
          <span
            key={word}
            className="block"
            ref={(element) => {
              wordMeasureRefs.current[index] = element;
            }}
          >
            {word}
          </span>
        ))}
      </span>
    </h2>
  );
}
