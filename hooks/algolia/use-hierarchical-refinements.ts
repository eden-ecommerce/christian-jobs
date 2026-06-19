"use client";

import {
  extractHierarchyLabel,
  isHierarchicalAttribute,
  type HierarchicalFacetConfig,
} from "@lib/algolia/hierarchical-filter";
import { useCurrentRefinements } from "react-instantsearch";

export type HierarchicalRefinementBadge = {
  key: string;
  label: string;
  onRemove: () => void;
};

export function useHierarchicalRefinements(
  hierarchicalFacet: HierarchicalFacetConfig | undefined,
): HierarchicalRefinementBadge[] {
  const { items } = useCurrentRefinements();
  const badges: HierarchicalRefinementBadge[] = [];
  const seenValues = new Set<string>();

  if (!hierarchicalFacet?.facetRoot) {
    return badges;
  }

  for (const item of items) {
    if (!isHierarchicalAttribute(item.attribute, hierarchicalFacet.facetRoot)) {
      continue;
    }

    for (const refinement of item.refinements) {
      const value = String(refinement.value);
      if (seenValues.has(value)) {
        continue;
      }
      seenValues.add(value);

      badges.push({
        key: `${item.attribute}-${value}`,
        label: extractHierarchyLabel(value, hierarchicalFacet),
        onRemove: () => item.refine(refinement),
      });
    }
  }

  return badges;
}
