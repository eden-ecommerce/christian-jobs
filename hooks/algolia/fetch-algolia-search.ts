import { getAlgoliaSearchClient } from "@eden-ecommerce/lib/algolia/client";
import { isAlgoliaEnvConfigured } from "@lib/env-configured";
import {
  defaultSearchIndices,
  defaultSearchParams,
} from "@lib/algolia/constants";

export type AlgoliaSearchHit = Record<string, unknown>;

export type AlgoliaSearchResult = {
  index: string;
  hits: AlgoliaSearchHit[];
};

type FetchAlgoliaSearchParams = {
  query: string;
  indices?: readonly string[];
  hitsPerPage?: number;
  filters?: string;
};

/**
 * Direct Algolia multi-index search (outside InstantSearch tree).
 * Extend index fan-out and hit mapping for your product domain.
 */
export async function fetchAlgoliaSearch({
  query,
  indices = defaultSearchIndices,
  hitsPerPage = defaultSearchParams.hitsPerPage,
  filters = defaultSearchParams.filters,
}: FetchAlgoliaSearchParams): Promise<AlgoliaSearchResult[]> {
  if (query.length < 2 || !isAlgoliaEnvConfigured()) {
    return [];
  }

  const client = getAlgoliaSearchClient();
  if (!client) {
    return [];
  }

  const requests = indices.map((indexName, index) => ({
    indexName,
    query,
    params: {
      hitsPerPage,
      ...(index === 0 ? { filters } : {}),
    },
  }));

  const data = await client.search(requests);

  return data.results.map((result) => {
    if ("hits" in result && Array.isArray(result.hits)) {
      return {
        index: result.index ?? "",
        hits: result.hits as AlgoliaSearchHit[],
      };
    }

    return {
      index: "",
      hits: [],
    };
  });
}
