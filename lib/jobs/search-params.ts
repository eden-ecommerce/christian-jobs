import { DEFAULT_LOCATION_RADIUS_METERS } from "@lib/algolia/constants";
import type { JobSort } from "@lib/algolia/jobs";
import type { SearchJobsParams } from "@lib/algolia/jobs";

const MILE_IN_METERS = 1609.344;

export type WorkType = "any" | "onsite" | "hybrid" | "remote";
export type JobWorkType = Exclude<WorkType, "any">;
export type DatePosted = "any" | "24h" | "week" | "month";

export type JobsHeroSearchSubmit = {
  category?: string;
  workTypes: JobWorkType[];
  contractTypes?: string[];
  location: { label: string; lat?: number; lng?: number };
  radius?: number;
};

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
  workTypes: JobWorkType[];
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

/** Primary search work-type pills — no "Any" option. */
export const HERO_WORK_TYPE_OPTIONS = [
  { label: "Remote", value: "remote" },
  { label: "Hybrid", value: "hybrid" },
  { label: "Onsite", value: "onsite" },
] as const satisfies readonly { label: string; value: JobWorkType }[];

/** Primary search contract-type pills for the v5 hero. */
export const HERO_CONTRACT_TYPE_OPTIONS = [
  { label: "Full time", value: "fullTime" },
  { label: "Part time", value: "partTime" },
] as const;

const VALID_JOB_WORK_TYPES = new Set<string>(["onsite", "hybrid", "remote"]);

export function parseJobWorkTypes(
  values: string[],
): JobWorkType[] {
  return values.filter(
    (value): value is JobWorkType => VALID_JOB_WORK_TYPES.has(value),
  );
}

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

export const LOCATION_RADIUS_OPTIONS = [
  { miles: 5, label: "Within 5 miles", value: Math.round(5 * MILE_IN_METERS) },
  { miles: 10, label: "Within 10 miles", value: Math.round(10 * MILE_IN_METERS) },
  {
    miles: 25,
    label: "Within 25 miles",
    value: DEFAULT_LOCATION_RADIUS_METERS,
  },
  { miles: 50, label: "Within 50 miles", value: Math.round(50 * MILE_IN_METERS) },
  {
    miles: 100,
    label: "Within 100 miles",
    value: Math.round(100 * MILE_IN_METERS),
  },
] as const;

/** Effective geo search radius in metres (URL override or site default). */
export function resolveLocationRadiusMeters(radius?: number): number {
  return radius ?? DEFAULT_LOCATION_RADIUS_METERS;
}

export function formatLocationRadiusLabel(radiusMeters: number): string {
  const match = LOCATION_RADIUS_OPTIONS.find((option) => option.value === radiusMeters);
  if (match) return match.label.toLowerCase();

  const miles = Math.round(radiusMeters / MILE_IN_METERS);
  return `within ${miles} miles`;
}

export function locationRadiusToUrlValue(radiusMeters: number): number | undefined {
  return radiusMeters === DEFAULT_LOCATION_RADIUS_METERS ? undefined : radiusMeters;
}

function one(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function multi(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

/** Preserve repeated query keys (e.g. multiple contractType values) for URLSearchParams. */
export function urlSearchParamsToRecord(
  searchParams: URLSearchParams,
): Record<string, string | string[] | undefined> {
  const record: Record<string, string | string[] | undefined> = {};

  for (const key of new Set(searchParams.keys())) {
    const values = searchParams.getAll(key);
    record[key] = values.length > 1 ? values : values[0];
  }

  return record;
}

export function parseJobsUrlSearchParams(searchParams: URLSearchParams): JobsUrlState {
  return parseJobsUrlState(urlSearchParamsToRecord(searchParams));
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
  const workTypes = parseJobWorkTypes(multi(sp.workType));
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
    workTypes,
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
  for (const workType of state.workTypes) params.append("workType", workType);
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
    params.radiusMeters = resolveLocationRadiusMeters(state.radius);
  }

  if (state.workTypes.length) params.workTypes = state.workTypes;

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
  if (state.workTypes.length) count++;
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

/** URL state for the default latest-jobs browse — clears hero search and all filters. */
export function latestJobsBrowseState(): JobsUrlState {
  return {
    q: "",
    location: "",
    contractTypes: [],
    organisationTypes: [],
    workTypes: [],
    denominations: [],
    datePosted: "any",
    sort: "date_desc",
    page: 0,
  };
}

/** True when the user has moved away from the default latest-jobs browse. */
export function hasActiveJobSearch(state: JobsUrlState): boolean {
  return !isLatestJobsBrowse(state);
}
