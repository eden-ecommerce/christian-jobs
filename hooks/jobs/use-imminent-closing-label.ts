"use client";

import { useMemo, useState } from "react";
import type { JobHit } from "@lib/algolia/jobs";
import { formatImminentClosingLabel } from "@lib/jobs/format-job";

/** Closing label when the deadline is within a few days. */
export function useImminentClosingLabel(
  job: Pick<JobHit, "closingDate" | "closingDateTimestamp">,
): string | null {
  const [now] = useState(() => Date.now());

  return useMemo(
    () => formatImminentClosingLabel(job, now),
    [job.closingDate, job.closingDateTimestamp, now],
  );
}
