"use client";

import { useQuery } from "@tanstack/react-query";
import { getJobDetailQueryOptions } from "@hooks/jobs/get-options";

export function useJobDetail(id: string | undefined) {
  return useQuery(getJobDetailQueryOptions(id));
}
