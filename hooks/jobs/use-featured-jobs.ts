"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchFeaturedJobs } from "@hooks/jobs/fetch-jobs";
import { jobsKeys } from "@hooks/jobs/get-key";

export function useFeaturedJobs() {
  return useQuery({
    queryKey: jobsKeys.featured(),
    queryFn: fetchFeaturedJobs,
    staleTime: 300_000,
  });
}
