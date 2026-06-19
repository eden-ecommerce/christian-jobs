"use client";

import { FilterBadgePrimitive } from "@components/search/active-filters/FilterBadgePrimitive";
import { useHierarchicalRefinements } from "@hooks/algolia/use-hierarchical-refinements";
import type { HierarchicalFacetConfig } from "@lib/algolia/hierarchical-filter";

type HierarchicalRefinementBadgesProps = {
  hierarchicalFacet: HierarchicalFacetConfig;
  prefix?: string;
};

export function HierarchicalRefinementBadges({
  hierarchicalFacet,
  prefix = "Category",
}: HierarchicalRefinementBadgesProps) {
  const badges = useHierarchicalRefinements(hierarchicalFacet);

  if (badges.length === 0) {
    return null;
  }

  return (
    <>
      {badges.map((badge) => (
        <FilterBadgePrimitive
          key={badge.key}
          prefix={prefix}
          label={badge.label}
          onRemove={badge.onRemove}
        />
      ))}
    </>
  );
}
