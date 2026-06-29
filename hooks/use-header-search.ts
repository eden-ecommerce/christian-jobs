"use client";

import { headerSearchIndices, headerSearchParams, productsIndex } from "@eden-ecommerce/lib/algolia/constants";
import { replaceAlgoliaHighlights } from "@eden-ecommerce/lib/algolia/highlights";
import { isAlgoliaEnvConfigured } from "@eden-ecommerce/lib/env-configured";
import { algoliasearch } from "algoliasearch";
import debounce from "lodash/debounce";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

const algoliaSearchClient = isAlgoliaEnvConfigured()
  ? algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
      process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY as string,
    )
  : null;

export type HeaderSearchProductHit = {
  objectID: string;
  product_name: string;
  author?: string;
  format?: string;
  price: number;
  url: string;
  image?: string;
  imageWidth?: string;
  imageHeight?: string;
};

export type HeaderSearchSuggestionHit = {
  objectID: string;
  query: string;
  highlightedQuery: ReactNode;
};

export type HeaderSearchCategoryHit = {
  objectID: string;
  name: string;
  url: string;
  highlightedName: ReactNode;
};

export type HeaderSearchAuthorHit = {
  objectID: string;
  name: string;
  url: string;
  highlightedName: ReactNode;
};

export type HeaderSearchState = {
  products: HeaderSearchProductHit[];
  suggestions: HeaderSearchSuggestionHit[];
  categories: HeaderSearchCategoryHit[];
  authors: HeaderSearchAuthorHit[];
  numberOfProductHits: number;
};

const emptyResults = (): HeaderSearchState => ({
  products: [],
  suggestions: [],
  categories: [],
  authors: [],
  numberOfProductHits: 0,
});

const mapHighlight = (value: string | undefined, fallback: string): ReactNode =>
  value ? replaceAlgoliaHighlights(value) : fallback;

export const useHeaderSearch = () => {
  const [results, setResults] = useState<HeaderSearchState>(emptyResults);

  const dispatchSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        if (query.length < headerSearchParams.minQueryLength || !algoliaSearchClient) {
          setResults(emptyResults());
          return;
        }

        const requests = headerSearchIndices.map((indexName) => {
          if (indexName === productsIndex) {
            return {
              indexName,
              query,
              params: {
                hitsPerPage: headerSearchParams.hitsPerPage,
                filters: headerSearchParams.filters,
              },
            };
          }

          return {
            indexName,
            query,
            params: { hitsPerPage: headerSearchParams.hitsPerPage },
          };
        });

        try {
          const data = await algoliaSearchClient.search(requests);
          const indexResults = data.results as Array<{
            index?: string;
            hits?: Record<string, unknown>[];
            nbHits?: number;
          }>;

          const productResults = indexResults.find((r) => r.index === productsIndex);
          const suggestionResults = indexResults.find((r) => r.index === "products_query_suggestions");
          const categoryResults = indexResults.find((r) => r.index === "feature_pages");
          const authorResults = indexResults.find((r) => r.index === "author");

          setResults({
            products: (productResults?.hits ?? []).map((hit) => ({
              objectID: String(hit.objectID ?? ""),
              product_name: String(hit.product_name ?? ""),
              author: hit.author ? String(hit.author) : undefined,
              format: hit.format ? String(hit.format) : undefined,
              price: typeof hit.price === "number" ? hit.price : 0,
              url: String(hit.url ?? "#"),
              image: hit.image ? String(hit.image) : undefined,
              imageWidth: hit.imageWidth ? String(hit.imageWidth) : undefined,
              imageHeight: hit.imageHeight ? String(hit.imageHeight) : undefined,
            })),
            suggestions: (suggestionResults?.hits ?? []).map((hit) => {
              const highlight = hit._highlightResult as { query?: { value?: string } } | undefined;
              const queryText = String(hit.query ?? "");
              return {
                objectID: String(hit.objectID ?? queryText),
                query: queryText,
                highlightedQuery: mapHighlight(highlight?.query?.value, queryText),
              };
            }),
            categories: (categoryResults?.hits ?? []).map((hit) => {
              const highlight = hit._highlightResult as { name?: { value?: string } } | undefined;
              const name = String(hit.name ?? "");
              return {
                objectID: String(hit.objectID ?? name),
                name,
                url: String(hit.url ?? "#"),
                highlightedName: mapHighlight(highlight?.name?.value, name),
              };
            }),
            authors: (authorResults?.hits ?? []).map((hit) => {
              const highlight = hit._highlightResult as { name?: { value?: string } } | undefined;
              const name = String(hit.name ?? "");
              return {
                objectID: String(hit.objectID ?? name),
                name,
                url: String(hit.url ?? "#"),
                highlightedName: mapHighlight(highlight?.name?.value, name),
              };
            }),
            numberOfProductHits: productResults?.nbHits ?? 0,
          });
        } catch {
          setResults(emptyResults());
        }
      }, 300),
    [],
  );

  const clearResults = () => setResults(emptyResults());

  return { results, dispatchSearch, clearResults };
};
