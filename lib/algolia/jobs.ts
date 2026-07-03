import "server-only";

import { getAlgoliaSearchClient } from "@eden-ecommerce/lib/algolia/client";
import {
  DEFAULT_LOCATION_RADIUS_METERS,
  JOBS_BASE_FILTER,
  organisationHubIndex,
} from "@lib/algolia/constants";
import { cleanCategoryLabel } from "@lib/algolia/category-label";
import { isHybridWork } from "@lib/jobs/format-job";
import type { JobWorkType } from "@lib/jobs/search-params";

/**
 * Shape derived from live `organisationHub` browse (entityType:job).
 * Mirrors the EventHit shape but with job-specific fields.
 */
export type JobHit = {
  objectID: string;
  id: string;
  title: string;
  description: string;
  /** Salary / pay information */
  salary: string | null;
  /** Job contract type, e.g. "Full Time", "Part Time", "Contract" */
  jobType: string | null;
  /** Work schedule, e.g. "Full time", "Part time" */
  schedule: string | null;
  /** How to apply */
  applicationInstructions: string | null;
  /** Closing date ISO string */
  closingDate: string | null;
  /** Timestamp (ms) for the closing date — used for sorting */
  closingDateTimestamp: number | null;
  /** When the job was posted (ms timestamp) */
  postedTimestamp: number | null;
  /** When the job was added to the index (ms timestamp) */
  createdTimestamp: number | null;
  online: boolean;
  externalUrl: string | null;
  organisationId: string | null;
  organisationName: string | null;
  organisationSlug: string | null;
  organisationType: string | null;
  organisationBrandingColour: string | null;
  organiserLogo: string | null;
  thumbnailUrl: string | null;
  logoUrl: string | null;
  locationName: string | null;
  locationStreet: string | null;
  locationCity: string | null;
  locationState: string | null;
  locationCountry: string | null;
  locationPostalCode: string | null;
  lat: number | null;
  lng: number | null;
  categoryLvl0: string | null;
  categoryLvl1: string | null;
  categoryLvl2: string | null;
  /** Distance from the search origin in metres, when a geo search was run. */
  distanceMeters: number | null;
};

type RawHit = Record<string, unknown>;

function str(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function num(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/** Parse ms timestamps from numeric or ISO-8601 index fields. */
function timestampMs(value: unknown): number | null {
  const asNumber = num(value);
  if (asNumber !== null) return asNumber;
  if (typeof value === "string" && value.length > 0) {
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function jobAddedTimestamp(job: JobHit): number | null {
  return job.createdTimestamp ?? job.postedTimestamp;
}

export { cleanCategoryLabel } from "@lib/algolia/category-label";

/** Parse a field that may be a JSON string or already a plain object. */
function parseJsonField(value: unknown): Record<string, unknown> {
  if (!value) return {};
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed))
        return parsed as Record<string, unknown>;
    } catch {
      // not valid JSON — ignore
    }
    return {};
  }
  if (typeof value === "object" && !Array.isArray(value))
    return value as Record<string, unknown>;
  return {};
}

function mapHit(raw: RawHit): JobHit {
  const location = parseJsonField(raw.location);
  const geoloc = parseJsonField(raw._geoloc);
  const thumbnail = parseJsonField(raw.thumbnail);
  const logo = parseJsonField(raw.logo);
  const hierarchy = parseJsonField(raw.categoryHierarchy);
  const ranking = parseJsonField(raw._rankingInfo);

  const createdTimestamp =
    timestampMs(raw.createdAt) ?? timestampMs(raw.updatedAt);
  const postedTimestamp =
    timestampMs(raw.postedAt) ??
    timestampMs(raw.postedTimestamp) ??
    timestampMs(raw.nextOccurrenceStartTimestamp) ??
    createdTimestamp;

  return {
    objectID: String(raw.objectID ?? ""),
    id: String(raw.id ?? ""),
    title: str(raw.title) ?? "Untitled job",
    description: str(raw.description) ?? "",
    salary: str(raw.salary) ?? str(raw.price),
    jobType: str(raw.jobType) ?? str(raw.contractType),
    schedule: str(raw.schedule),
    applicationInstructions: str(raw.applicationInstructions),
    closingDate: str(raw.closingDate) ?? str(raw.closingAt) ?? str(raw.endDate),
    closingDateTimestamp:
      num(raw.closingAtTimestamp) ??
      num(raw.closingDateTimestamp) ??
      num(raw.nextOccurrenceEndTimestamp),
    postedTimestamp,
    createdTimestamp,
    online: raw.online === true,
    externalUrl: str(raw.externalUrl),
    organisationId: str(raw.organisationId),
    organisationName: str(raw.organisationName),
    organisationSlug: str(raw.organisationSlug),
    organisationType: str(raw.organisationType),
    organisationBrandingColour: str(raw.organisationBrandingColour),
    organiserLogo: str(raw.organiserLogo),
    thumbnailUrl: str(thumbnail.url) ?? str(raw.organiserLogo),
    logoUrl: str(logo.url) ?? str(raw.organiserLogo),
    locationName: str(location.name) ?? str(raw.locationName),
    locationStreet: str(location.street),
    locationCity: str(location.city) ?? str(raw.locationCity),
    locationState: str(location.state) ?? str(raw.locationState),
    locationCountry: str(location.country) ?? str(raw.locationCountry),
    locationPostalCode: str(location.postalCode) ?? str(raw.locationPostalCode),
    lat: num(location.latitude) ?? num(geoloc.lat),
    lng: num(location.longitude) ?? num(geoloc.lng),
    categoryLvl0: cleanCategoryLabel(str(hierarchy.lvl0)),
    categoryLvl1: cleanCategoryLabel(str(hierarchy.lvl1)),
    categoryLvl2: cleanCategoryLabel(str(hierarchy.lvl2)),
    distanceMeters: num(
      ranking.matchedGeoLocation
        ? (ranking.matchedGeoLocation as Record<string, unknown>).distance
        : null,
    ),
  };
}

/** Sort options exposed in the UI. */
export type JobSort = "relevance" | "distance" | "date_asc" | "date_desc";

export type DatePostedFilter = "24h" | "week" | "month";

export type SearchJobsParams = {
  query?: string;
  /** Geo search origin. When set, results can be ranked by distance. */
  lat?: number;
  lng?: number;
  /** Radius in metres. Default from DEFAULT_LOCATION_RADIUS_METERS. */
  radiusMeters?: number;
  category?: string;
  /** When true, only return jobs with no category set. */
  uncategorised?: boolean;
  /** @deprecated Use organisationTypes for multi-select. */
  organisationType?: string;
  organisationTypes?: string[];
  contractTypes?: string[];
  denominations?: string[];
  minSalary?: number;
  datePosted?: DatePostedFilter;
  /** @deprecated Prefer workTypes — kept for direct API use. */
  online?: boolean;
  /** @deprecated Prefer workTypes — single value kept for legacy callers. */
  workType?: JobWorkType;
  workTypes?: JobWorkType[];
  sort?: JobSort;
  page?: number;
  hitsPerPage?: number;
};

export type JobFacet = { label: string; value: string; count: number };

export type JobFacets = {
  categories: JobFacet[];
  categoryLvl1: JobFacet[];
  categoryLvl2: JobFacet[];
  categoryLvl3: JobFacet[];
  categoryLvl4: JobFacet[];
  organisationTypes: JobFacet[];
  contractTypes: JobFacet[];
  denominations: JobFacet[];
};

export type SearchJobsResult = {
  hits: JobHit[];
  nbHits: number;
  page: number;
  nbPages: number;
  configured: boolean;
  facets: JobFacets;
};

const EMPTY_FACETS: JobFacets = {
  categories: [],
  categoryLvl1: [],
  categoryLvl2: [],
  categoryLvl3: [],
  categoryLvl4: [],
  organisationTypes: [],
  contractTypes: [],
  denominations: [],
};

const EMPTY_RESULT: SearchJobsResult = {
  hits: [],
  nbHits: 0,
  page: 0,
  nbPages: 0,
  configured: false,
  facets: EMPTY_FACETS,
};

/** Build the shared Algolia params for a job search. */
function buildSearchParams(params: SearchJobsParams) {
  const { lat, lng, radiusMeters = DEFAULT_LOCATION_RADIUS_METERS } = params;

  const filters = [JOBS_BASE_FILTER];

  const hasGeo = typeof lat === "number" && typeof lng === "number";

  const base: Record<string, unknown> = {
    filters: filters.join(" AND "),
    getRankingInfo: hasGeo,
  };
  if (hasGeo) {
    base.aroundLatLng = `${lat}, ${lng}`;
    base.aroundRadius = radiusMeters;
  }
  return { base, hasGeo };
}

function categoryFacetFilter(category: string): string[] {
  const levels = [0, 1, 2, 3, 4];
  return levels.map((l) => `categoryHierarchy.lvl${l}:${category}`);
}

function datePostedCutoff(datePosted: DatePostedFilter): number {
  const now = Date.now();
  switch (datePosted) {
    case "24h":
      return now - 86_400_000;
    case "week":
      return now - 7 * 86_400_000;
    case "month":
      return now - 30 * 86_400_000;
  }
}

function parseSalaryMinimum(salary: string | null): number | null {
  if (!salary) return null;
  const normalised = salary.toLowerCase();
  if (normalised.includes("competitive") || normalised.includes("negotiable")) {
    return null;
  }
  const match = salary.match(/£?\s*([\d,]+(?:\.\d+)?)/);
  if (!match?.[1]) return null;
  const value = Number(match[1].replace(/,/g, ""));
  return Number.isFinite(value) ? value : null;
}

/**
 * Server-side job search supporting free-text, geo radius, category &
 * organisation-type facets, and sorting.
 */
export async function searchJobs(
  params: SearchJobsParams,
): Promise<SearchJobsResult> {
  const client = getAlgoliaSearchClient();
  if (!client) return EMPTY_RESULT;

  const {
    query = "",
    category,
    uncategorised,
    organisationType,
    organisationTypes,
    contractTypes,
    denominations,
    minSalary,
    datePosted,
    online,
    workType,
    workTypes,
    sort = "date_desc",
    page = 0,
    hitsPerPage = 12,
  } = params;

  const { base, hasGeo } = buildSearchParams(params);

  if (uncategorised) {
    const existingFilters = base.filters as string;
    base.filters = `${existingFilters} AND NOT _exists_:categoryHierarchy.lvl0`;
  }

  const selectionFilters: string[][] = [];
  if (category) selectionFilters.push(categoryFacetFilter(category));

  const orgTypes =
    organisationTypes?.length
      ? organisationTypes
      : organisationType
        ? [organisationType]
        : [];
  if (orgTypes.length) {
    selectionFilters.push(orgTypes.map((t) => `organisationType:${t}`));
  }
  if (denominations?.length) {
    selectionFilters.push(denominations.map((d) => `denomination:${d}`));
  }

  const numericFilters: string[] = [];

  const resolvedWorkTypes: JobWorkType[] =
    workTypes?.length
      ? workTypes
      : workType
        ? [workType]
        : online === true
          ? ["remote"]
          : online === false
            ? ["onsite"]
            : [];

  const sortByDate = sort === "date_asc" || sort === "date_desc";
  const needsContractFilter = Boolean(contractTypes?.length);
  const needsWorkTypeFilter = resolvedWorkTypes.length > 0;
  const needsSalaryFilter = typeof minSalary === "number" && minSalary > 0;
  const needsDatePostedFilter = Boolean(datePosted);
  const needsClientProcessing =
    sortByDate ||
    needsSalaryFilter ||
    needsContractFilter ||
    needsWorkTypeFilter ||
    needsDatePostedFilter;

  const mainParams: Record<string, unknown> = {
    ...base,
    facetFilters: selectionFilters.length ? selectionFilters : undefined,
    numericFilters: numericFilters.length ? numericFilters : undefined,
    hitsPerPage: needsClientProcessing ? 1000 : hitsPerPage,
    page: needsClientProcessing ? 0 : page,
  };

  const facetParams: Record<string, unknown> = {
    ...base,
    hitsPerPage: 0,
    facets: [
      "categoryHierarchy.lvl0",
      "categoryHierarchy.lvl1",
      "categoryHierarchy.lvl2",
      "categoryHierarchy.lvl3",
      "categoryHierarchy.lvl4",
      "organisationType",
      "jobType",
      "contractType",
      "denomination",
    ],
  };

  const response = await client.search([
    { indexName: organisationHubIndex, query, params: mainParams },
    { indexName: organisationHubIndex, query, params: facetParams },
  ] as unknown as Parameters<typeof client.search>[0]);

  const main = response.results[0];
  const facetResult = response.results[1];
  if (!main || !("hits" in main)) {
    return { ...EMPTY_RESULT, configured: true };
  }

  let facets = readFacets(facetResult);

  let hits = (main.hits as RawHit[]).map(mapHit);
  let nbHits = main.nbHits ?? hits.length;
  let resolvedPage = main.page ?? 0;
  let nbPages = main.nbPages ?? 1;

  if (needsContractFilter) {
    hits = hits.filter(
      (hit) => hit.jobType && contractTypes!.includes(hit.jobType),
    );
    nbHits = hits.length;
  }

  if (needsWorkTypeFilter) {
    hits = hits.filter((hit) =>
      resolvedWorkTypes.some((type) => {
        if (type === "remote") return hit.online;
        if (type === "hybrid") return isHybridWork(hit);
        return !hit.online && !isHybridWork(hit);
      }),
    );
    nbHits = hits.length;
  }

  if (needsSalaryFilter) {
    hits = hits.filter((hit) => {
      const min = parseSalaryMinimum(hit.salary);
      return min === null || min >= minSalary!;
    });
    nbHits = hits.length;
  }

  if (needsDatePostedFilter) {
    const cutoff = datePostedCutoff(datePosted!);
    hits = hits.filter((hit) => {
      const ts = jobAddedTimestamp(hit);
      return ts !== null && ts >= cutoff;
    });
    nbHits = hits.length;
  }

  if (sortByDate) {
    const dir = sort === "date_asc" ? 1 : -1;
    hits.sort((a, b) => {
      const at = jobAddedTimestamp(a) ?? Infinity * dir;
      const bt = jobAddedTimestamp(b) ?? Infinity * dir;
      if (at === bt) return 0;
      return at < bt ? -dir : dir;
    });
    nbHits = hits.length;
  }

  if (needsClientProcessing) {
    facets = enrichContractTypeFacets(facets, hits);
    nbPages = Math.max(1, Math.ceil(nbHits / hitsPerPage));
    resolvedPage = Math.min(page, nbPages - 1);
    const start = resolvedPage * hitsPerPage;
    hits = hits.slice(start, start + hitsPerPage);
  } else {
    facets = enrichContractTypeFacets(facets, hits);
  }

  return {
    hits,
    nbHits,
    page: resolvedPage,
    nbPages,
    configured: true,
    facets,
  };
}

function formatContractTypeLabel(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

/** Derive contract-type facet counts from job hits when Algolia facets are unavailable. */
function contractTypesFromHits(hits: JobHit[]): JobFacet[] {
  const counts = new Map<string, number>();
  for (const hit of hits) {
    if (!hit.jobType) continue;
    counts.set(hit.jobType, (counts.get(hit.jobType) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([value, count]) => ({
      value,
      label: formatContractTypeLabel(value),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

function enrichContractTypeFacets(facets: JobFacets, hits: JobHit[]): JobFacets {
  if (facets.contractTypes.length > 0 || hits.length === 0) return facets;
  const contractTypes = contractTypesFromHits(hits);
  return contractTypes.length > 0 ? { ...facets, contractTypes } : facets;
}

function readFacets(result: unknown): JobFacets {
  if (!result || typeof result !== "object" || !("facets" in result)) {
    return EMPTY_FACETS;
  }
  const facets = (result as { facets?: Record<string, Record<string, number>> })
    .facets;
  if (!facets) return EMPTY_FACETS;

  const categories = Object.entries(facets["categoryHierarchy.lvl0"] ?? {})
    .map(([value, count]) => ({
      value,
      label: cleanCategoryLabel(value) ?? value,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const categoryLvl1 = Object.entries(facets["categoryHierarchy.lvl1"] ?? {})
    .map(([value, count]) => ({
      value,
      label: cleanCategoryLabel(value.split(" > ").at(-1) ?? value) ?? value,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const categoryLvl2 = Object.entries(facets["categoryHierarchy.lvl2"] ?? {})
    .map(([value, count]) => ({
      value,
      label: cleanCategoryLabel(value.split(" > ").at(-1) ?? value) ?? value,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const categoryLvl3 = Object.entries(facets["categoryHierarchy.lvl3"] ?? {})
    .map(([value, count]) => ({
      value,
      label: cleanCategoryLabel(value.split(" > ").at(-1) ?? value) ?? value,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const categoryLvl4 = Object.entries(facets["categoryHierarchy.lvl4"] ?? {})
    .map(([value, count]) => ({
      value,
      label: cleanCategoryLabel(value.split(" > ").at(-1) ?? value) ?? value,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const organisationTypes = Object.entries(facets["organisationType"] ?? {})
    .map(([value, count]) => ({
      value,
      label: value.charAt(0).toUpperCase() + value.slice(1),
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const contractTypes = Object.entries(
    facets["jobType"] ?? facets["contractType"] ?? {},
  )
    .map(([value, count]) => ({
      value,
      label: formatContractTypeLabel(value),
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const denominations = Object.entries(facets["denomination"] ?? {})
    .map(([value, count]) => ({
      value,
      label: value,
      count,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return {
    categories,
    categoryLvl1,
    categoryLvl2,
    categoryLvl3,
    categoryLvl4,
    organisationTypes,
    contractTypes,
    denominations,
  };
}

/** Fetch a single job by its id. The Algolia objectID is `job:<id>`. */
export async function getJobById(id: string): Promise<JobHit | null> {
  const client = getAlgoliaSearchClient();
  if (!client) return null;

  const objectID = id.startsWith("job:") ? id : `job:${id}`;

  try {
    const raw = (await client.getObject({
      indexName: organisationHubIndex,
      objectID,
    })) as RawHit;
    if (!raw || raw.entityType !== "job") return null;
    return mapHit(raw);
  } catch {
    return null;
  }
}

/** Fetch multiple jobs by their ids in one Algolia getObjects request. */
export async function getJobsByIds(ids: string[]): Promise<JobHit[]> {
  if (ids.length === 0) return [];
  const client = getAlgoliaSearchClient();
  if (!client) return [];

  const requests = ids.map((id) => ({
    indexName: organisationHubIndex,
    objectID: id.startsWith("job:") ? id : `job:${id}`,
  }));

  try {
    const response = await client.getObjects({ requests });
    return (response.results as (RawHit | null)[])
      .filter((r): r is RawHit => r !== null && r.entityType === "job")
      .map(mapHit);
  } catch {
    return [];
  }
}

export type CategoryFacet = { label: string; value: string; count: number };

export type CategoryFacetsResult = {
  categories: CategoryFacet[];
  totalCount: number;
  uncategorisedCount: number;
};

/** Top-level category facets for browse chips, plus total and uncategorised counts. */
export async function getJobCategoryFacets(): Promise<CategoryFacetsResult> {
  const client = getAlgoliaSearchClient();
  if (!client) return { categories: [], totalCount: 0, uncategorisedCount: 0 };

  const response = await client.search([
    {
      indexName: organisationHubIndex,
      query: "",
      params: {
        filters: JOBS_BASE_FILTER,
        hitsPerPage: 0,
        facets: ["categoryHierarchy.lvl0"],
      },
    },
  ] as unknown as Parameters<typeof client.search>[0]);

  const result = response.results[0];
  if (!result || !("facets" in result) || !result.facets) {
    return { categories: [], totalCount: 0, uncategorisedCount: 0 };
  }

  const totalCount = ("nbHits" in result ? (result.nbHits as number) : 0) ?? 0;

  const facet = result.facets["categoryHierarchy.lvl0"] ?? {};
  const categories = Object.entries(facet)
    .map(([value, count]) => ({
      value,
      label: cleanCategoryLabel(value) ?? value,
      count: count as number,
    }))
    .sort((a, b) => b.count - a.count);

  const categorisedCount = categories.reduce((sum, c) => sum + c.count, 0);
  const uncategorisedCount = Math.max(0, totalCount - categorisedCount);

  return { categories, totalCount, uncategorisedCount };
}

/** Featured jobs for carousel — most recently posted. */
export async function getFeaturedJobs(limit = 8): Promise<JobHit[]> {
  const result = await searchJobs({ hitsPerPage: limit, sort: "date_desc" });
  return result.hits;
}

/** Charity organisation jobs for carousel. */
export async function getCharityJobs(limit = 8): Promise<JobHit[]> {
  const result = await searchJobs({
    hitsPerPage: limit,
    sort: "date_desc",
    organisationTypes: ["charity"],
  });
  return result.hits;
}

/** Fetch filter facet options for the jobs browser. */
export async function getJobFilterOptions(): Promise<JobFacets> {
  const result = await searchJobs({ hitsPerPage: 1000, sort: "date_desc" });
  return result.facets;
}

// ---------------------------------------------------------------------------
// Organisation (re-exported from events for convenience)
// ---------------------------------------------------------------------------

export type { OrgCategory, OrganisationHit } from "@lib/algolia/organisations";
export { getOrganisationById } from "@lib/algolia/organisations";
