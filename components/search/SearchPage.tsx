"use client";

import { ActiveFilterBadges } from "@components/search/active-filters/ActiveFilterBadges";
import { AlgoliaConfig } from "@components/search/AlgoliaConfig";
import { AlgoliaHits } from "@components/search/AlgoliaHits";
import { Configure } from "@components/search/Configure";
import { AlgoliaHierarchicalFilter } from "@components/search/filters/AlgoliaHierarchicalFilter";
import { UserLocationFilter } from "@components/search/filters/UserLocationFilter";
import { InsightsMiddleware } from "@components/search/InsightsMiddleware";
import { LocationConfigure } from "@components/search/LocationConfigure";
import { SearchBox } from "@components/search/SearchBox";
import { LocationInitialiser } from "@components/location/LocationInitialiser";
import type { HierarchicalAlgoliaIndexPreset } from "@lib/algolia/constants";
import type { CloudflareLocation } from "@lib/location/types";

type SearchPageProps = {
  preset: HierarchicalAlgoliaIndexPreset;
  serverLocation: CloudflareLocation;
  searchPlaceholder?: string;
  filterLabel?: string;
};

export function SearchPage({
  preset,
  serverLocation,
  searchPlaceholder = "Search…",
  filterLabel = "Categories",
}: SearchPageProps) {
  const { indexName, baseFilter, attributesToRetrieve, hierarchicalFacet } =
    preset;

  return (
    <AlgoliaConfig indexName={indexName}>
      <Configure
        filters={baseFilter}
        facets={["*"]}
        maxValuesPerFacet={1000}
        attributesToRetrieve={[...attributesToRetrieve]}
        hitsPerPage={12}
      />
      <LocationInitialiser serverLocation={serverLocation} />
      <LocationConfigure />
      <InsightsMiddleware />
      <div className="mt-8 flex flex-col gap-4">
        <ActiveFilterBadges hierarchicalFacet={hierarchicalFacet} />
        <AlgoliaHierarchicalFilter
          hierarchicalFacet={hierarchicalFacet}
          label={filterLabel}
        />
        <UserLocationFilter />
        <SearchBox placeholder={searchPlaceholder} />
        <AlgoliaHits />
      </div>
    </AlgoliaConfig>
  );
}
