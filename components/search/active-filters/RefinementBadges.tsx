"use client";

import { FilterBadgePrimitive } from "@components/search/active-filters/FilterBadgePrimitive";
import { isHierarchicalAttribute } from "@lib/algolia/hierarchical-filter";
import { useCurrentRefinements } from "react-instantsearch";

type RefinementBadgesProps = {
  excludeFacetRoot?: string;
};

export function RefinementBadges({ excludeFacetRoot }: RefinementBadgesProps) {
  const { items } = useCurrentRefinements();

  const badges = items.flatMap((item) => {
    if (
      excludeFacetRoot &&
      isHierarchicalAttribute(item.attribute, excludeFacetRoot)
    ) {
      return [];
    }

    return item.refinements.map((refinement) => ({
      key: `${item.attribute}-${String(refinement.value)}`,
      label: refinement.label || String(refinement.value),
      onRemove: () => item.refine(refinement),
    }));
  });

  if (badges.length === 0) {
    return null;
  }

  return (
    <>
      {badges.map((badge) => (
        <FilterBadgePrimitive
          key={badge.key}
          label={badge.label}
          onRemove={badge.onRemove}
        />
      ))}
    </>
  );
}
