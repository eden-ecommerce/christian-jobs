import { apiFetch } from "@lib/apiFetch";
import type { JobFacets, SearchJobsResult } from "@lib/algolia/jobs";
import type { JobDetailData } from "@components/jobs/browser/JobDetailPanel";

export function fetchJobsSearch(queryString: string): Promise<SearchJobsResult> {
  return apiFetch<SearchJobsResult>(`/api/jobs?${queryString}`);
}

export function fetchJobDetail(id: string): Promise<JobDetailData> {
  return apiFetch<JobDetailData>(`/api/jobs/${id}`);
}

export function fetchJobFilters(): Promise<JobFacets> {
  return apiFetch<JobFacets>("/api/jobs/filters");
}

export type FeaturedJobsResponse = {
  latest: SearchJobsResult["hits"];
  featured: SearchJobsResult["hits"];
};

export function fetchFeaturedJobs(): Promise<FeaturedJobsResponse> {
  return apiFetch<FeaturedJobsResponse>("/api/jobs/featured");
}
