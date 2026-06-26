"use client";

import { useMemo, useState } from "react";

/** Relative posted date label, stable for the component mount (avoids render purity issues). */
export function usePostedLabel(postedTimestamp: number | null): string | null {
  const [now] = useState(() => Date.now());

  return useMemo(() => {
    if (!postedTimestamp) return null;
    const diffDays = Math.floor((now - postedTimestamp) / 86_400_000);
    if (diffDays === 0) return "Posted today";
    if (diffDays === 1) return "Posted yesterday";
    if (diffDays < 7) return `Posted ${diffDays} days ago`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Posted ${weeks} week${weeks === 1 ? "" : "s"} ago`;
    }
    const months = Math.floor(diffDays / 30);
    return `Posted ${months} month${months === 1 ? "" : "s"} ago`;
  }, [postedTimestamp, now]);
}
