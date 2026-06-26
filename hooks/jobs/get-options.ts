import { queryOptions } from "@tanstack/react-query";
import { fetchJobDetail } from "@hooks/jobs/fetch-jobs";
import { jobsKeys } from "@hooks/jobs/get-key";

export function getJobDetailQueryOptions(id: string | undefined) {
  return queryOptions({
    queryKey: jobsKeys.detail(id ?? ""),
    queryFn: () => fetchJobDetail(id!),
    enabled: Boolean(id),
    staleTime: 60_000,
  });
}
