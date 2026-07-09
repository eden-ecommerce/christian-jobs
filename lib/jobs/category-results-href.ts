import {
  jobsUrlStateToSearchParams,
  latestJobsBrowseState,
  type JobWorkType,
} from "@lib/jobs/search-params";

/**
 * Builds a results URL for a single category filter.
 *
 * Today: query-string on the search route (`?category=…`).
 * Later: swap the body to a clean path (e.g. `/jobs/category/{slug}`)
 * without changing call sites.
 */
export function categoryResultsHref(
  resultsPath: string,
  categoryValue: string,
): string {
  const params = jobsUrlStateToSearchParams({
    ...latestJobsBrowseState(),
    category: categoryValue,
  });
  const qs = params.toString();
  return qs ? `${resultsPath}?${qs}` : resultsPath;
}

/**
 * All jobs, newest first — no category filter.
 * Same default browse state as the results page with an empty query string.
 */
export function latestJobsResultsHref(resultsPath: string): string {
  const params = jobsUrlStateToSearchParams(latestJobsBrowseState());
  const qs = params.toString();
  return qs ? `${resultsPath}?${qs}` : resultsPath;
}

/** Unfiltered results — used for “Browse all categories”. */
export function browseAllCategoriesHref(resultsPath: string): string {
  return latestJobsResultsHref(resultsPath);
}

/** Results filtered by a single work type (remote / hybrid / onsite). */
export function workTypeResultsHref(
  resultsPath: string,
  workType: JobWorkType,
): string {
  const params = jobsUrlStateToSearchParams({
    ...latestJobsBrowseState(),
    workTypes: [workType],
  });
  const qs = params.toString();
  return qs ? `${resultsPath}?${qs}` : resultsPath;
}

/**
 * Results filtered by optional location/radius and any work types.
 * Empty label + work types only → work-type filter with no geo (e.g. Remote-only).
 */
export function locationResultsHref(
  resultsPath: string,
  location: {
    label: string;
    lat?: number;
    lng?: number;
    radius?: number;
    workTypes?: JobWorkType[];
  },
): string {
  const label = location.label.trim();
  const hasGeo =
    Boolean(label) &&
    location.lat !== undefined &&
    location.lng !== undefined;
  const params = jobsUrlStateToSearchParams({
    ...latestJobsBrowseState(),
    location: label,
    place: label || undefined,
    lat: hasGeo ? location.lat : undefined,
    lng: hasGeo ? location.lng : undefined,
    radius: hasGeo ? location.radius : undefined,
    workTypes: location.workTypes ?? [],
    sort: hasGeo ? "distance" : "date_desc",
  });
  const qs = params.toString();
  return qs ? `${resultsPath}?${qs}` : resultsPath;
}
