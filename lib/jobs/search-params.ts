import type { JobSort } from "@lib/algolia/jobs";
import type { SearchJobsParams } from "@lib/algolia/jobs";

export type WorkType = "any" | "onsite" | "hybrid" | "remote";
export type DatePosted = "any" | "24h" | "week" | "month";

export type JobsUrlState = {
  q: string;
  location: string;
  lat?: number;
  lng?: number;
  place?: string;
  radius?: number;
  category?: string;
  uncategorised?: boolean;
  contractTypes: string[];
  organisationTypes: string[];
  workType: WorkType;
  denominations: string[];
  minSalary?: number;
  datePosted: DatePosted;
  sort: JobSort;
  vjk?: string;
  page: number;
};

export const CONTRACT_TYPE_OPTIONS = [
  { label: "Full Time", value: "fullTime" },
  { label: "Part Time", value: "partTime" },
  { label: "Contract", value: "contract" },
  { label: "Temporary", value: "temporary" },
  { label: "Internship", value: "internship" },
  { label: "Voluntary", value: "voluntary" },
] as const;

export const ORGANISATION_TYPE_OPTIONS = [
  { label: "Church", value: "church" },
  { label: "Charity", value: "charity" },
  { label: "Individual Ministry", value: "individualMinistry" },
  { label: "Business", value: "business" },
  { label: "Other", value: "other" },
] as const;

export const SALARY_OPTIONS = [
  { label: "Any", value: "" },
  { label: "£15,000+", value: "15000" },
  { label: "£20,000+", value: "20000" },
  { label: "£25,000+", value: "25000" },
  { label: "£30,000+", value: "30000" },
  { label: "£35,000+", value: "35000" },
  { label: "£40,000+", value: "40000" },
] as const;

export const WORK_TYPE_OPTIONS = [
  { label: "Any", value: "any" },
  { label: "Onsite", value: "onsite" },
  { label: "Hybrid", value: "hybrid" },
  { label: "Remote", value: "remote" },
] as const;

export const DATE_POSTED_OPTIONS = [
  { label: "Any time", value: "any" },
  { label: "Past 24 hours", value: "24h" },
  { label: "Past week", value: "week" },
  { label: "Past month", value: "month" },
] as const;

export const SORT_OPTIONS = [
  { label: "Most recent", value: "date_desc" },
  { label: "Most relevant", value: "relevance" },
] as const;

function one(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function multi(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function parseJobsUrlState(
  sp: Record<string, string | string[] | undefined>,
): JobsUrlState {
  const latRaw = one(sp.lat);
  const lngRaw = one(sp.lng);
  const lat = latRaw ? Number(latRaw) : undefined;
  const lng = lngRaw ? Number(lngRaw) : undefined;
  const hasGeo =
    typeof lat === "number" &&
    Number.isFinite(lat) &&
    typeof lng === "number" &&
    Number.isFinite(lng);

  const minSalaryRaw = one(sp.minSalary);
  const pageRaw = one(sp.page);
  const sortRaw = one(sp.sort) as JobSort | undefined;
  const workTypeRaw = one(sp.workType) as WorkType | undefined;
  const datePostedRaw = one(sp.datePosted) as DatePosted | undefined;

  return {
    q: one(sp.q) ?? "",
    location: one(sp.location) ?? one(sp.place) ?? "",
    lat: hasGeo ? lat : undefined,
    lng: hasGeo ? lng : undefined,
    place: one(sp.place) ?? undefined,
    radius: one(sp.radius) ? Number(one(sp.radius)) : undefined,
    category: one(sp.category),
    uncategorised: one(sp.uncategorised) === "true" ? true : undefined,
    contractTypes: multi(sp.contractType),
    organisationTypes: multi(sp.organisationType ?? sp.org),
    workType: workTypeRaw ?? "any",
    denominations: multi(sp.denomination),
    minSalary: minSalaryRaw ? Number(minSalaryRaw) : undefined,
    datePosted: datePostedRaw ?? "any",
    sort: sortRaw ?? (hasGeo ? "distance" : "date_desc"),
    vjk: one(sp.vjk),
    page: pageRaw ? Math.max(0, Number(pageRaw) - 1) : 0,
  };
}

export function jobsUrlStateToSearchParams(state: JobsUrlState): URLSearchParams {
  const params = new URLSearchParams();

  if (state.q) params.set("q", state.q);
  if (state.location) params.set("location", state.location);
  if (state.lat !== undefined) params.set("lat", String(state.lat));
  if (state.lng !== undefined) params.set("lng", String(state.lng));
  if (state.place) params.set("place", state.place);
  if (state.radius) params.set("radius", String(state.radius));
  if (state.category) params.set("category", state.category);
  if (state.uncategorised) params.set("uncategorised", "true");
  for (const ct of state.contractTypes) params.append("contractType", ct);
  for (const ot of state.organisationTypes) params.append("organisationType", ot);
  if (state.workType !== "any") params.set("workType", state.workType);
  for (const d of state.denominations) params.append("denomination", d);
  if (state.minSalary) params.set("minSalary", String(state.minSalary));
  if (state.datePosted !== "any") params.set("datePosted", state.datePosted);
  if (state.sort !== "date_desc" && state.sort !== "relevance") {
    params.set("sort", state.sort);
  } else if (state.sort === "relevance") {
    params.set("sort", "relevance");
  }
  if (state.vjk) params.set("vjk", state.vjk);
  if (state.page > 0) params.set("page", String(state.page + 1));

  return params;
}

export function toSearchJobsParams(state: JobsUrlState): SearchJobsParams {
  const params: SearchJobsParams = {
    query: [state.q, state.location].filter(Boolean).join(" ").trim(),
    category: state.category,
    uncategorised: state.uncategorised,
    sort: state.sort,
    page: state.page,
    hitsPerPage: 20,
    contractTypes: state.contractTypes.length ? state.contractTypes : undefined,
    organisationTypes: state.organisationTypes.length
      ? state.organisationTypes
      : undefined,
    minSalary: state.minSalary,
    datePosted: state.datePosted !== "any" ? state.datePosted : undefined,
    denominations: state.denominations.length ? state.denominations : undefined,
  };

  if (state.lat !== undefined && state.lng !== undefined) {
    params.lat = state.lat;
    params.lng = state.lng;
    if (state.radius) params.radiusMeters = state.radius;
  }

  if (state.workType !== "any") params.workType = state.workType;

  return params;
}

export function countActiveFilters(state: JobsUrlState): number {
  let count = 0;
  if (
    state.location.trim() ||
    (state.lat !== undefined && state.lng !== undefined)
  ) {
    count++;
  }
  if (state.contractTypes.length) count++;
  if (state.organisationTypes.length) count++;
  if (state.workType !== "any") count++;
  if (state.denominations.length) count++;
  if (state.minSalary) count++;
  if (state.datePosted !== "any") count++;
  if (state.category) count++;
  if (state.uncategorised) count++;
  if (state.sort === "relevance") count++;
  return count;
}

/** True when results are sorted by most recently added (default browse). */
export function isNewestFirst(state: JobsUrlState): boolean {
  return state.sort === "date_desc" && state.datePosted === "any";
}

/** Default landing view — all jobs, newest first, no search or filters. */
export function isLatestJobsBrowse(state: JobsUrlState): boolean {
  return isNewestFirst(state) && !state.q.trim() && countActiveFilters(state) === 0;
}
