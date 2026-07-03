import { cleanCategoryLabel } from "@lib/algolia/category-label";
import {
  countActiveFilters,
  jobsUrlStateToSearchParams,
  resolveLocationRadiusMeters,
  type JobsUrlState,
} from "@lib/jobs/search-params";

const MILE_IN_METERS = 1609.344;
const WIDE_RADIUS_METERS = Math.round(100 * MILE_IN_METERS);
const FALLBACK_HITS_PER_PAGE = 6;

export type JobSearchFallbackTier = {
  id: string;
  title: string;
  description?: string;
  queryString: string;
};

function categoryLabel(category: string): string {
  return cleanCategoryLabel(category) ?? category;
}

function hasGeoSearch(state: JobsUrlState): boolean {
  return state.lat !== undefined && state.lng !== undefined;
}

function locationLabel(state: JobsUrlState): string | undefined {
  const label = state.place?.trim() || state.location.trim();
  return label || undefined;
}

/** Progressive relaxations to suggest when a filtered search returns no jobs. */
export function buildJobSearchFallbackTiers(
  state: JobsUrlState,
): JobSearchFallbackTier[] {
  if (countActiveFilters(state) === 0 && !state.q.trim()) return [];

  const tiers: JobSearchFallbackTier[] = [];
  const place = locationLabel(state);
  const category = state.category ? categoryLabel(state.category) : undefined;
  const currentRadius = resolveLocationRadiusMeters(state.radius);

  if (hasGeoSearch(state) && currentRadius < WIDE_RADIUS_METERS) {
    const relaxed: JobsUrlState = {
      ...state,
      radius: WIDE_RADIUS_METERS,
      sort: "distance",
      page: 0,
      vjk: undefined,
    };
    tiers.push({
      id: "wider-radius",
      title: "Jobs further afield",
      description: place
        ? `Within 100 miles of ${place}`
        : "Within 100 miles of your search area",
      queryString: fallbackQueryString(relaxed),
    });
  }

  if (category && (hasGeoSearch(state) || state.location.trim())) {
    const relaxed: JobsUrlState = {
      ...state,
      location: "",
      place: undefined,
      lat: undefined,
      lng: undefined,
      radius: undefined,
      sort: "date_desc",
      page: 0,
      vjk: undefined,
    };
    tiers.push({
      id: "category-nationwide",
      title: `${category} across the UK`,
      description: "Same category, location filter removed",
      queryString: fallbackQueryString(relaxed),
    });
  }

  if (category && state.workTypes.length > 0) {
    const relaxed: JobsUrlState = {
      ...state,
      location: "",
      place: undefined,
      lat: undefined,
      lng: undefined,
      radius: undefined,
      workTypes: [],
      sort: "date_desc",
      page: 0,
      vjk: undefined,
    };
    tiers.push({
      id: "category-relaxed-work-type",
      title: `More ${category} roles`,
      description: "Including hybrid and on-site positions",
      queryString: fallbackQueryString(relaxed),
    });
  }

  const latest: JobsUrlState = {
    q: "",
    location: "",
    contractTypes: [],
    organisationTypes: [],
    workTypes: [],
    denominations: [],
    datePosted: "any",
    sort: "date_desc",
    page: 0,
    category: state.category,
    uncategorised: undefined,
    minSalary: undefined,
    radius: undefined,
    lat: undefined,
    lng: undefined,
    place: undefined,
    vjk: undefined,
  };

  tiers.push({
    id: category ? "latest-in-category" : "latest",
    title: "You might also be interested in",
    description: category
      ? `Recently added ${category} jobs`
      : "Recently added Christian jobs",
    queryString: fallbackQueryString(latest),
  });

  const seen = new Set<string>();
  return tiers.filter((tier) => {
    if (seen.has(tier.id)) return false;
    seen.add(tier.id);
    return true;
  });
}

function fallbackQueryString(state: JobsUrlState): string {
  const params = jobsUrlStateToSearchParams(state);
  params.set("pageSize", String(FALLBACK_HITS_PER_PAGE));
  params.delete("page");
  params.delete("vjk");
  return params.toString();
}

export const JOB_SEARCH_FALLBACK_LIMIT = 5;
