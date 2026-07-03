"use client";

import { useLayoutEffect, useState } from "react";

export function readReducedMotionPreference(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Synced `prefers-reduced-motion` — correct on the first client render. */
export function usePrefersReducedMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(readReducedMotionPreference);

  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mediaQuery.matches);
    sync();
    mediaQuery.addEventListener("change", sync);
    return () => mediaQuery.removeEventListener("change", sync);
  }, []);

  return reduceMotion;
}
