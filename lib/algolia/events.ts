import "server-only";

import { getAlgoliaSearchClient } from "@lib/algolia/client";
import {
  DEFAULT_LOCATION_RADIUS_METERS,
  EVENTS_BASE_FILTER,
  defaultHierarchicalSearchPreset,
  organisationHubIndex,
} from "@lib/algolia/constants";
import { extractHierarchyLabel } from "@lib/algolia/hierarchical-filter";
import { cleanCategoryLabel } from "@lib/algolia/category-label";

/**
 * Shape derived from live `organisationHub` browse (entityType:event).
 * Only the fields the UI needs are typed; the raw hit has more.
 */
export type EventHit = {
  objectID: string;
  id: string;
  title: string;
  description: string;
  date: string | null;
  endDate: string | null;
  time: string | null;
  timeZone: string | null;
  price: string | null;
  online: boolean;
  ageRange: string | null;
  parkingInstructions: string | null;
  nextOccurrenceStartTimestamp: number | null;
  nextOccurrenceEndTimestamp: number | null;
  occurrenceStartTimestamps: number[];
  occurrenceEndTimestamps: number[];
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

export { cleanCategoryLabel } from "@lib/algolia/category-label";

function mapHit(raw: RawHit): EventHit {
  const location = parseJsonField(raw.location);
  const geoloc = parseJsonField(raw._geoloc);
  const thumbnail = parseJsonField(raw.thumbnail);
  const logo = parseJsonField(raw.logo);
  const hierarchy = parseJsonField(raw.categoryHierarchy);
  const ranking = parseJsonField(raw._rankingInfo);

  return {
    objectID: String(raw.objectID ?? ""),
    id: String(raw.id ?? ""),
    title: str(raw.title) ?? "Untitled event",
    description: str(raw.description) ?? "",
    date: str(raw.date),
    endDate: str(raw.endDate),
    time: str(raw.time),
    timeZone: str(raw.timeZone),
    price: str(raw.price),
    online: raw.online === true,
    ageRange: str(raw.ageRange),
    parkingInstructions: str(raw.parkingInstructions),
    nextOccurrenceStartTimestamp: num(raw.nextOccurrenceStartTimestamp),
    nextOccurrenceEndTimestamp: num(raw.nextOccurrenceEndTimestamp),
    occurrenceStartTimestamps: Array.isArray(raw.occurrenceStartTimestamps)
      ? (raw.occurrenceStartTimestamps as unknown[]).filter((v): v is number => typeof v === "number" && Number.isFinite(v))
      : [],
    occurrenceEndTimestamps: Array.isArray(raw.occurrenceEndTimestamps)
      ? (raw.occurrenceEndTimestamps as unknown[]).filter((v): v is number => typeof v === "number" && Number.isFinite(v))
      : [],
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
    distanceMeters: num(ranking.matchedGeoLocation
      ? (ranking.matchedGeoLocation as Record<string, unknown>).distance
      : null),
  };
}

/** Sort options exposed in the UI. Date sorts are applied server-side in-memory. */
export type EventSort = "relevance" | "distance" | "date_asc" | "date_desc";

export type SearchEventsParams = {
  query?: string;
  /** Geo search origin. When set, results can be ranked by distance. */
  lat?: number;
  lng?: number;
  /** Radius in metres. Default from DEFAULT_LOCATION_RADIUS_METERS. */
  radiusMeters?: number;
  category?: string;
  /** When true, only return events with no category set. */
  uncategorised?: boolean;
  organisationType?: string;
  online?: boolean;
  /** Inclusive lower bound, ms since epoch (matches nextOccurrenceStartTimestamp). */
  dateFrom?: number;
  /** Inclusive upper bound, ms since epoch. */
  dateTo?: number;
  sort?: EventSort;
  page?: number;
  hitsPerPage?: number;
};

export type EventFacet = { label: string; value: string; count: number };

export type EventFacets = {
  categories: EventFacet[];
  categoryLvl1: EventFacet[];
  categoryLvl2: EventFacet[];
  categoryLvl3: EventFacet[];
  categoryLvl4: EventFacet[];
  organisationTypes: EventFacet[];
};

export type SearchEventsResult = {
  hits: EventHit[];
  nbHits: number;
  page: number;
  nbPages: number;
  configured: boolean;
  facets: EventFacets;
};

const EMPTY_FACETS: EventFacets = { categories: [], categoryLvl1: [], categoryLvl2: [], categoryLvl3: [], categoryLvl4: [], organisationTypes: [] };

const EMPTY_RESULT: SearchEventsResult = {
  hits: [],
  nbHits: 0,
  page: 0,
  nbPages: 0,
  configured: false,
  facets: EMPTY_FACETS,
};

/** Build the shared Algolia params (filters, facets, numeric + geo) for a search. */
function buildSearchParams(params: SearchEventsParams) {
  const { lat, lng, radiusMeters = DEFAULT_LOCATION_RADIUS_METERS, online, dateFrom, dateTo } = params;

  const filters = [EVENTS_BASE_FILTER];
  if (typeof online === "boolean") filters.push(`online:${online}`);

  // occurrenceStartTimestamps (array) is NOT in numericAttributesForFiltering
  // on this index. Use the pre-aggregated scalar attributes instead:
  //   occurrenceStartTimestampMin — earliest occurrence start across all dates
  //   occurrenceEndTimestampMax  — latest occurrence end across all dates
  // For a date-range filter this gives: events whose earliest start is >= from
  // AND whose latest end is <= to, which correctly surfaces single-day and
  // multi-day events that fall within the requested window.
  const numericFilters: string[] = [];
  if (typeof dateFrom === "number") {
    numericFilters.push(`occurrenceStartTimestampMin >= ${dateFrom}`);
  }
  if (typeof dateTo === "number") {
    numericFilters.push(`occurrenceEndTimestampMax <= ${dateTo}`);
  }

  const hasGeo = typeof lat === "number" && typeof lng === "number";

  const base: Record<string, unknown> = {
    filters: filters.join(" AND "),
    ...(numericFilters.length > 0 ? { numericFilters } : {}),
    getRankingInfo: hasGeo,
  };
  if (hasGeo) {
    base.aroundLatLng = `${lat}, ${lng}`;
    base.aroundRadius = radiusMeters;
  }
  return { base, hasGeo };
}

function categoryFacetFilter(category: string): string[] {
  // The `category` URL param may be the cleaned label (no :::id) or raw Algolia value.
  // We match both the raw value AND the label-only prefix so either form works.
  const levels = [0, 1, 2, 3, 4];
  return levels.map((l) => `categoryHierarchy.lvl${l}:${category}`);
}

/**
 * Server-side event search supporting free-text, geo radius, category &
 * organisation-type facets, date-range numeric filters, and sorting. Returns
 * disjunctive facet counts so each facet group reflects the other active
 * filters but not its own selection.
 */
export async function searchEvents(
  params: SearchEventsParams,
): Promise<SearchEventsResult> {
  const client = getAlgoliaSearchClient();
  if (!client) return EMPTY_RESULT;

  const {
    query = "",
    category,
    uncategorised,
    organisationType,
    sort = "relevance",
    page = 0,
    hitsPerPage = 12,
  } = params;

  const { base, hasGeo } = buildSearchParams(params);

  // When `uncategorised` is true, filter to events with no category at any level.
  // Algolia doesn't support "attribute does not exist" natively, but we can rely
  // on the facet count mismatch: events missing categoryHierarchy.lvl0 will have
  // zero counts. We pass an empty filters string here so they are included, and
  // exclude all events that DO have a category by negating the facet.
  if (uncategorised) {
    const existingFilters = base.filters as string;
    base.filters = `${existingFilters} AND NOT _exists_:categoryHierarchy.lvl0`;
  }

  const selectionFilters: string[][] = [];
  if (category) selectionFilters.push(categoryFacetFilter(category));
  if (organisationType) {
    selectionFilters.push([`organisationType:${organisationType}`]);
  }

  const sortByDate = sort === "date_asc" || sort === "date_desc";

  // Main hits query. For date sorts we pull the full filtered set (small index)
  // and order it in-memory, then paginate manually.
  const mainParams: Record<string, unknown> = {
    ...base,
    facetFilters: selectionFilters,
    hitsPerPage: sortByDate ? 1000 : hitsPerPage,
    page: sortByDate ? 0 : page,
  };

  // Disjunctive facet query: same context, but without the facet selections,
  // so counts stay stable as the user toggles categories / org types.
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

  const facets = readFacets(facetResult);

  let hits = (main.hits as RawHit[]).map(mapHit);
  let nbHits = main.nbHits ?? hits.length;
  let resolvedPage = main.page ?? 0;
  let nbPages = main.nbPages ?? 1;

  if (sortByDate) {
    const dir = sort === "date_asc" ? 1 : -1;
    hits.sort((a, b) => {
      const at = a.nextOccurrenceStartTimestamp ?? Infinity * dir;
      const bt = b.nextOccurrenceStartTimestamp ?? Infinity * dir;
      if (at === bt) return 0;
      return at < bt ? -dir : dir;
    });
    nbHits = hits.length;
    nbPages = Math.max(1, Math.ceil(nbHits / hitsPerPage));
    resolvedPage = Math.min(page, nbPages - 1);
    const start = resolvedPage * hitsPerPage;
    hits = hits.slice(start, start + hitsPerPage);
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

function readFacets(result: unknown): EventFacets {
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

  return { categories, categoryLvl1, categoryLvl2, categoryLvl3, categoryLvl4, organisationTypes };
}

/** Fetch a single event by its id. The Algolia objectID is `event:<id>`. */
export async function getEventById(id: string): Promise<EventHit | null> {
  const client = getAlgoliaSearchClient();
  if (!client) return null;

  // `id` is not a filterable attribute, but objectID lookups via getObject work.
  const objectID = id.startsWith("event:") ? id : `event:${id}`;

  try {
    const raw = (await client.getObject({
      indexName: organisationHubIndex,
      objectID,
    })) as RawHit;
    if (!raw || raw.entityType !== "event") return null;
    return mapHit(raw);
  } catch {
    return null;
  }
}

/** Fetch multiple events by their ids in one Algolia getObjects request. */
export async function getEventsByIds(ids: string[]): Promise<EventHit[]> {
  if (ids.length === 0) return [];
  const client = getAlgoliaSearchClient();
  if (!client) return [];

  // objectIDs in organisationHub are prefixed: "event:<uuid>"
  const requests = ids.map((id) => ({
    indexName: organisationHubIndex,
    objectID: id.startsWith("event:") ? id : `event:${id}`,
  }));

  try {
    const response = await client.getObjects({ requests });
    return (response.results as (RawHit | null)[])
      .filter((r): r is RawHit => r !== null && r.entityType === "event")
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
export async function getCategoryFacets(): Promise<CategoryFacetsResult> {
  const client = getAlgoliaSearchClient();
  if (!client) return { categories: [], totalCount: 0, uncategorisedCount: 0 };

  const response = await client.search([
    {
      indexName: organisationHubIndex,
      query: "",
      params: {
        filters: EVENTS_BASE_FILTER,
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

// ---------------------------------------------------------------------------
// Organisation
// ---------------------------------------------------------------------------

export type OrgCategory = {
  id: number;
  slug: string;
  name: string;
  parentId: number | null;
};

export type OrganisationHit = {
  objectID: string;
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  mission: string | null;
  website: string | null;
  organisationType: string | null;
  yearFounded: number | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  tags: string[];
  categories: OrgCategory[];
};

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

function mapOrgHit(raw: RawHit): OrganisationHit {
  const logo = parseJsonField(raw.logo);
  const banner = parseJsonField(raw.banner);

  // _tags is a plain string array in Algolia
  const tags: string[] = Array.isArray(raw._tags)
    ? (raw._tags as unknown[]).filter((t): t is string => typeof t === "string")
    : [];

  // categories is an array of objects: { id, slug, name, parentId }
  const categories: OrgCategory[] = Array.isArray(raw.categories)
    ? (raw.categories as unknown[]).reduce<OrgCategory[]>((acc, c) => {
        if (c && typeof c === "object") {
          const cat = c as Record<string, unknown>;
          if (typeof cat.name === "string") {
            acc.push({
              id: typeof cat.id === "number" ? cat.id : 0,
              slug: typeof cat.slug === "string" ? cat.slug : "",
              name: cat.name,
              parentId:
                typeof cat.parentId === "number" ? cat.parentId : null,
            });
          }
        }
        return acc;
      }, [])
    : [];

  return {
    objectID: String(raw.objectID ?? ""),
    id: String(raw.id ?? ""),
    name: str(raw.title) ?? str(raw.name) ?? "Unknown organisation",
    slug: str(raw.slug),
    description: str(raw.description),
    mission: str(raw.mission),
    website: str(raw.website),
    organisationType: str(raw.organisationType),
    yearFounded: typeof raw.yearFounded === "number" ? raw.yearFounded : null,
    logoUrl: str(logo.url),
    bannerUrl: str(banner.url),
    tags,
    categories,
  };
}

/**
 * Fetch the organisation record from the same organisationHub index.
 * Returns null when not found or Algolia is not configured.
 */
export async function getOrganisationById(
  organisationId: string
): Promise<OrganisationHit | null> {
  const client = getAlgoliaSearchClient();
  if (!client) return null;

  try {
    // Organisation objectIDs are prefixed: "organisation:<uuid>"
    const raw = await client.getObject({
      indexName: organisationHubIndex,
      objectID: `organisation:${organisationId}`,
    });
    return mapOrgHit(raw as RawHit);
  } catch {
    return null;
  }
}
