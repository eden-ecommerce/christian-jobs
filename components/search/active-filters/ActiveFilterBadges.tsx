"use client";

import { HierarchicalRefinementBadges } from "@components/search/active-filters/HierarchicalRefinementBadges";
import { LocationBadge } from "@components/search/active-filters/LocationBadge";
import { RefinementBadges } from "@components/search/active-filters/RefinementBadges";
import { useHierarchicalRefinements } from "@hooks/algolia/use-hierarchical-refinements";
import { useUserLocation } from "@hooks/google-maps/use-user-location";
import type { HierarchicalFacetConfig } from "@lib/algolia/hierarchical-filter";
import { useClearRefinements, useCurrentRefinements } from "react-instantsearch";

type ActiveFilterBadgesProps = {
  hierarchicalFacet?: HierarchicalFacetConfig;
  showLocationBadge?: boolean;
  showGenericRefinements?: boolean;
  clearAllThreshold?: number;
  hierarchicalBadgePrefix?: string;
};

function useActiveFilterCount({
  hierarchicalFacet,
  showLocationBadge,
  showGenericRefinements,
}: Pick<
  ActiveFilterBadgesProps,
  "hierarchicalFacet" | "showLocationBadge" | "showGenericRefinements"
>): number {
  const hierarchicalBadges = useHierarchicalRefinements(hierarchicalFacet);
  const { items } = useCurrentRefinements();
  const { location, isHydrated } = useUserLocation();

  let count = hierarchicalFacet ? hierarchicalBadges.length : 0;

  if (showGenericRefinements) {
    for (const item of items) {
      if (
        hierarchicalFacet &&
        item.attribute.startsWith(`${hierarchicalFacet.facetRoot}.`)
      ) {
        continue;
      }
      count += item.refinements.length;
    }
  }

  if (showLocationBadge && isHydrated && location) {
    count += 1;
  }

  return count;
}

export function ActiveFilterBadges({
  hierarchicalFacet,
  showLocationBadge = true,
  showGenericRefinements = true,
  clearAllThreshold = 2,
  hierarchicalBadgePrefix,
}: ActiveFilterBadgesProps) {
  const { refine: clearRefinements } = useClearRefinements();
  const { clearLocation } = useUserLocation();
  const activeCount = useActiveFilterCount({
    hierarchicalFacet,
    showLocationBadge,
    showGenericRefinements,
  });

  if (activeCount === 0) {
    return null;
  }

  const clearAll = () => {
    clearRefinements();
    if (showLocationBadge) {
      clearLocation();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {hierarchicalFacet ? (
        <HierarchicalRefinementBadges
          hierarchicalFacet={hierarchicalFacet}
          prefix={hierarchicalBadgePrefix}
        />
      ) : null}
      {showGenericRefinements ? (
        <RefinementBadges excludeFacetRoot={hierarchicalFacet?.facetRoot} />
      ) : null}
      {showLocationBadge ? <LocationBadge /> : null}
      {activeCount >= clearAllThreshold ? (
        <button
          type="button"
          onClick={clearAll}
          className="text-xs text-muted-foreground underline-offset-2 hover:underline"
        >
          Clear all
        </button>
      ) : null}
    </div>
  );
}
