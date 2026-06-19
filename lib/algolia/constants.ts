/**
 * Query live Algolia index before editing attributes or facets below.
 * Field names are not inferrable — copy from index browse/search output.
 */
import { ALGOLIA_INDEXES, type AlgoliaIndexName } from "@lib/algolia/client";
import type { HierarchicalFacetConfig } from "@lib/algolia/hierarchical-filter";

export const productsIndex = ALGOLIA_INDEXES.products;
export const organisationHubIndex = ALGOLIA_INDEXES.organisationHub;

/** Default indices for multi-index client search (e.g. header search). */
export const defaultSearchIndices = [ALGOLIA_INDEXES.products] as const;

/** Default store filter for product index queries. */
export const DEFAULT_STORE_FILTER = "stores:eden";

export const defaultSearchParams = {
  hitsPerPage: 25,
  filters: DEFAULT_STORE_FILTER,
} as const;

/** Placeholder — extend with fields your hit components need. */
export const productAttributesToRetrieve = [
  "objectID",
  "product_name",
  "product_id",
  "price",
  "image",
  "url",
  "stores",
] as const;

/** Default radius in metres for aroundRadius — verify against live index requirements. */
export const DEFAULT_LOCATION_RADIUS_METERS = 50_000;

/** Base filter for event searches on organisationHub. */
export const EVENTS_BASE_FILTER = "entityType:event AND published:true";

export type AlgoliaIndexPreset = {
  indexName: AlgoliaIndexName;
  baseFilter: string;
  attributesToRetrieve: readonly string[];
  hierarchicalFacet?: HierarchicalFacetConfig;
};

export type HierarchicalAlgoliaIndexPreset = AlgoliaIndexPreset & {
  hierarchicalFacet: HierarchicalFacetConfig;
};

export const eventAttributesToRetrieve = [
  "objectID",
  "id",
  "title",
  "description",
  "date",
  "endDate",
  "time",
  "timeZone",
  "price",
  "online",
  "ageRange",
  "parkingInstructions",
  "nextOccurrenceStartTimestamp",
  "organisationName",
  "organisationSlug",
  "organisationType",
  "organiserLogo",
  "thumbnail",
  "logo",
  "location",
  "locationName",
  "locationCity",
  "locationState",
  "locationCountry",
  "locationPostalCode",
  "_geoloc",
  "categoryHierarchy",
  "entityType",
] as const;

export const algoliaIndexPresets = {
  products: {
    indexName: ALGOLIA_INDEXES.products,
    baseFilter: DEFAULT_STORE_FILTER,
    attributesToRetrieve: productAttributesToRetrieve,
  },
  organisationHub: {
    indexName: ALGOLIA_INDEXES.organisationHub,
    baseFilter: "published:true",
    attributesToRetrieve: [
      "objectID",
      "title",
      "name",
      "entityType",
    ] as const,
    hierarchicalFacet: {
      facetRoot: "categoryHierarchy",
      depth: 5,
      separator: " > ",
      labelIdDelimiter: ":::",
    },
  },
  organisationHubEvents: {
    indexName: ALGOLIA_INDEXES.organisationHub,
    baseFilter: EVENTS_BASE_FILTER,
    attributesToRetrieve: eventAttributesToRetrieve,
    hierarchicalFacet: {
      facetRoot: "categoryHierarchy",
      depth: 5,
      separator: " > ",
      labelIdDelimiter: ":::",
    },
  },
} as const satisfies Record<string, AlgoliaIndexPreset>;

export type AlgoliaIndexPresetKey = keyof typeof algoliaIndexPresets;

export const defaultHierarchicalSearchPreset =
  algoliaIndexPresets.organisationHubEvents as HierarchicalAlgoliaIndexPreset;
