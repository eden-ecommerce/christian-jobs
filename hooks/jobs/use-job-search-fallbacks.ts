"use client";

import { fetchJobsSearch } from "@hooks/jobs/fetch-jobs";
import { jobsKeys } from "@hooks/jobs/get-key";
import type { JobHit } from "@lib/algolia/jobs";
import {
  buildJobSearchFallbackTiers,
  JOB_SEARCH_FALLBACK_LIMIT,
} from "@lib/jobs/search-fallbacks";
import { countActiveFilters, type JobsUrlState } from "@lib/jobs/search-params";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export type JobSearchFallbackSection = {
  id: string;
  title: string;
  description?: string;
  jobs: JobHit[];
};

const MAX_SECTIONS = 2;

export function useJobSearchFallbacks(
  state: JobsUrlState | undefined,
  enabled: boolean,
) {
  const tiers = useMemo(
    () => (state ? buildJobSearchFallbackTiers(state) : []),
    [state],
  );

  const shouldFetch =
    enabled &&
    Boolean(state) &&
    tiers.length > 0 &&
    (countActiveFilters(state!) > 0 || Boolean(state!.q.trim()));

  return useQuery({
    queryKey: jobsKeys.fallbacks(
      state ? JSON.stringify({ state, tiers: tiers.map((tier) => tier.id) }) : "",
    ),
    queryFn: async (): Promise<JobSearchFallbackSection[]> => {
      const sections: JobSearchFallbackSection[] = [];
      const seenJobIds = new Set<string>();

      for (const tier of tiers) {
        if (sections.length >= MAX_SECTIONS) break;

        const result = await fetchJobsSearch(tier.queryString);
        const jobs = result.hits
          .filter((job) => !seenJobIds.has(job.id))
          .slice(0, JOB_SEARCH_FALLBACK_LIMIT);

        for (const job of jobs) seenJobIds.add(job.id);
        if (jobs.length === 0) continue;

        sections.push({
          id: tier.id,
          title: tier.title,
          description: tier.description,
          jobs,
        });
      }

      return sections;
    },
    enabled: shouldFetch,
    staleTime: 60_000,
  });
}
