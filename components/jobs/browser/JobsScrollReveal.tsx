"use client";

import { usePrefersReducedMotion, readReducedMotionPreference } from "@hooks/jobs/use-prefers-reduced-motion";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Optional stagger when several blocks enter view together. */
  delayMs?: number;
};

type MotionState = "unset" | "hidden" | "revealed";

function initialMotionState(): MotionState {
  if (typeof window === "undefined") return "hidden";
  return readReducedMotionPreference() ? "unset" : "hidden";
}

function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.92 && rect.bottom > 48;
}

/** Fades content up when it scrolls into view — matches the v5 hero entrance motion. */
export function JobsScrollReveal({
  children,
  className = "",
  delayMs = 0,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const [motionState, setMotionState] = useState<MotionState>(initialMotionState);

  useLayoutEffect(() => {
    if (reduceMotion) return;

    const element = ref.current;
    if (!element) return;

    if (isInViewport(element)) {
      requestAnimationFrame(() => setMotionState("revealed"));
      return;
    }

    setMotionState("hidden");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          requestAnimationFrame(() => setMotionState("revealed"));
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -48px 0px", threshold: 0.08 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [reduceMotion]);

  let motionClass = "";
  if (!reduceMotion) {
    if (motionState === "hidden") motionClass = "jobs-scroll-reveal";
    if (motionState === "revealed") {
      motionClass = "jobs-scroll-reveal jobs-scroll-reveal-visible";
    }
  }

  return (
    <div
      ref={ref}
      className={`${motionClass} ${className}`.trim()}
      style={
        delayMs && motionState === "revealed"
          ? { transitionDelay: `${delayMs}ms` }
          : undefined
      }
    >
      {children}
    </div>
  );
}
