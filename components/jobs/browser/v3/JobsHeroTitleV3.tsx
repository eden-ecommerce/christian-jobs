"use client";

import { usePrefersReducedMotion } from "@hooks/jobs/use-prefers-reduced-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const ROTATING_WORDS = [
  "purpose",
  "faith",
  "courage",
  "passion",
  "vision",
] as const;

const ROTATE_MS = 2800;
const TRANSITION_MS = 700;
const TRANSITION_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Hero tagline — "Work with [word]" cycles the third word, width + fade in sync. */
export function JobsHeroTitleV3({
  variant = "default",
}: {
  variant?: "default" | "onImage";
} = {}) {
  const reduceMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [wordWidth, setWordWidth] = useState<number | null>(null);
  const [widthReady, setWidthReady] = useState(false);
  const measurerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const isFirstMeasureRef = useRef(true);

  const measureActiveWidth = () =>
    measurerRefs.current[activeIndex]?.offsetWidth ?? 0;

  useLayoutEffect(() => {
    const width = measureActiveWidth();
    if (width <= 0) return;

    if (isFirstMeasureRef.current || reduceMotion) {
      setWordWidth(width);
      setWidthReady(true);
      isFirstMeasureRef.current = false;
      return;
    }

    const frame = requestAnimationFrame(() => {
      setWordWidth(width);
    });

    return () => cancelAnimationFrame(frame);
  }, [activeIndex, reduceMotion]);

  useLayoutEffect(() => {
    const observer = new ResizeObserver(() => {
      const width = measureActiveWidth();
      if (width > 0) setWordWidth(width);
    });

    for (const element of measurerRefs.current) {
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [activeIndex]);

  useEffect(() => {
    if (reduceMotion) return;

    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % ROTATING_WORDS.length);
    }, ROTATE_MS);

    return () => window.clearInterval(interval);
  }, [reduceMotion]);

  const isOnImage = variant === "onImage";
  const accentClass = isOnImage ? "text-[#c8e6a0]" : "text-[#235A0E]";
  const animate = widthReady && !reduceMotion;

  return (
    <h2
      className={`mt-3 text-center text-[2.5rem] font-semibold leading-[1.08] tracking-[-0.025em] sm:text-[3.25rem] lg:text-[3.5rem] ${
        isOnImage ? "text-white" : "text-[#1d1d1f]"
      }`}
      aria-live={reduceMotion ? undefined : "polite"}
    >
      <span
        className="inline-flex items-baseline justify-center gap-x-[0.28em]"
        aria-label={`Work with ${ROTATING_WORDS[activeIndex]}`}
      >
        <span className="shrink-0">Work with</span>

        <span
          className={`relative inline-block shrink-0 align-baseline ${accentClass}`}
          style={{
            width: wordWidth ?? undefined,
            transition: animate
              ? `width ${TRANSITION_MS}ms ${TRANSITION_EASING}`
              : undefined,
          }}
        >
          <span
            className="invisible block whitespace-nowrap select-none"
            aria-hidden="true"
          >
            {ROTATING_WORDS[activeIndex]}
          </span>

          {ROTATING_WORDS.map((word, index) => (
            <span
              key={word}
              className="absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap"
              style={{
                opacity: index === activeIndex ? 1 : 0,
                transition: animate
                  ? `opacity ${TRANSITION_MS}ms ${TRANSITION_EASING}`
                  : undefined,
              }}
              aria-hidden={index !== activeIndex}
            >
              {word}
            </span>
          ))}
        </span>
      </span>

      <span
        className="invisible absolute h-0 overflow-hidden whitespace-nowrap"
        aria-hidden="true"
      >
        {ROTATING_WORDS.map((word, index) => (
          <span
            key={word}
            ref={(element) => {
              measurerRefs.current[index] = element;
            }}
          >
            {word}
          </span>
        ))}
      </span>
    </h2>
  );
}
