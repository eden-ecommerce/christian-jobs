"use client";

import { useMemo, useState } from "react";
import { formatPostedLabel } from "@lib/jobs/format-job";

/** Relative posted date label for recent jobs only (stable for the component mount). */
export function usePostedLabel(postedTimestamp: number | null): string | null {
  const [now] = useState(() => Date.now());

  return useMemo(
    () => formatPostedLabel(postedTimestamp, now),
    [postedTimestamp, now],
  );
}
