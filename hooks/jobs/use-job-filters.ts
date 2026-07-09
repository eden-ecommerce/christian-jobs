"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchJobFilters } from "@hooks/jobs/fetch-jobs";
import { jobsKeys } from "@hooks/jobs/get-key";

/** Lazy filter facets (categories etc.) for homepage hero when none are passed in. */
export function useJobFilters(enabled = true) {
  return useQuery({
    queryKey: jobsKeys.filters(),
    queryFn: fetchJobFilters,
    enabled,
    staleTime: 300_000,
  });
}
