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
  const location = (raw.location ?? {}) as Record<string, unknown>;
  const geoloc = (raw._geoloc ?? {}) as Record<string, unknown>;
  const thumbnail = (raw.thumbnail ?? {}) as Record<string, unknown>;
  const logo = (raw.logo ?? {}) as Record<string, unknown>;
  const hierarchy = (raw.categoryHierarchy ?? {}) as Record<string, unknown>;
  const ranking = (raw._rankingInfo ?? {}) as Record<string, unknown>;

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

  // Filter recurring events by occurrenceStartTimestamps (array attribute).
  // Algolia numeric filters: outer array = AND, inner array = OR.
  // To match "any occurrence within [from, to]", we need TWO separate AND conditions
  // each expressed as a plain string (not as inner OR arrays).
  const numericFilters: string[] = [];
  if (typeof dateFrom === "number") {
    numericFilters.push(`occurrenceStartTimestamps >= ${dateFrom}`);
  }
  if (typeof dateTo === "number") {
    numericFilters.push(`occurrenceStartTimestamps <= ${dateTo}`);
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
    organisationType,
    sort = "relevance",
    page = 0,
    hitsPerPage = 12,
  } = params;

  const { base, hasGeo } = buildSearchParams(params);

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

/** Fetch multiple events by their ids in one Algolia multiQuery request. */
export async function getEventsByIds(ids: string[]): Promise<EventHit[]> {
  if (ids.length === 0) return [];
  const client = getAlgoliaSearchClient();
  if (!client) return [];

  const objectIDs = ids.map((id) => (id.startsWith("event:") ? id : `event:${id}`));

  try {
    const response = await client.search(
      objectIDs.map((objectID) => ({
        indexName: organisationHubIndex,
        query: "",
        params: {
          filters: `${EVENTS_BASE_FILTER} AND objectID:${objectID}`,
          hitsPerPage: 1,
        },
      })) as unknown as Parameters<typeof client.search>[0],
    );

    const hits: EventHit[] = [];
    for (const result of response.results) {
      if ("hits" in result) {
        for (const hit of result.hits as RawHit[]) {
          if (hit.entityType === "event") hits.push(mapHit(hit));
        }
      }
    }
    return hits;
  } catch {
    return [];
  }
}

export type CategoryFacet = { label: string; value: string; count: number };

/** Top-level category facets for browse chips. */
export async function getCategoryFacets(): Promise<CategoryFacet[]> {
  const client = getAlgoliaSearchClient();
  if (!client) return [];

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
  if (!result || !("facets" in result) || !result.facets) return [];

  const facet = result.facets["categoryHierarchy.lvl0"] ?? {};
  return Object.entries(facet)
    .map(([value, count]) => ({
      value,
      label: cleanCategoryLabel(value) ?? value,
      count: count as number,
    }))
    .sort((a, b) => b.count - a.count);
}
