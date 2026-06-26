"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchJobsSearch } from "@hooks/jobs/fetch-jobs";
import { jobsKeys } from "@hooks/jobs/get-key";
import {
  jobsUrlStateToSearchParams,
  type JobsUrlState,
} from "@lib/jobs/search-params";

export function useJobsInfiniteList(state: JobsUrlState) {
  const baseParams = jobsUrlStateToSearchParams({ ...state, page: 0 });
  baseParams.delete("page");
  const baseQuery = baseParams.toString();

  return useInfiniteQuery({
    queryKey: jobsKeys.list(baseQuery),
    queryFn: ({ pageParam }) => {
      const params = new URLSearchParams(baseQuery);
      if (pageParam > 0) params.set("page", String(pageParam + 1));
      return fetchJobsSearch(params.toString());
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.page + 1 < lastPage.nbPages ? lastPage.page + 1 : undefined,
    staleTime: 30_000,
  });
}
