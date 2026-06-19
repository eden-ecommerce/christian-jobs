"use client";

import { HierarchicalFilterPrimitive } from "@components/search/filters/HierarchicalFilterPrimitive";
import { DropdownPrimitive } from "@components/search/filters/DropdownPrimitive";
import {
  buildHierarchyAttributes,
  buildRefinedPath,
  DEFAULT_HIERARCHY_SEPARATOR,
  mapHierarchicalMenuItems,
  type HierarchicalFacetConfig,
} from "@lib/algolia/hierarchical-filter";
import { useHierarchicalMenu } from "react-instantsearch";

type AlgoliaHierarchicalFilterProps = {
  hierarchicalFacet: HierarchicalFacetConfig;
  label?: string;
  showCount?: boolean;
};

export function AlgoliaHierarchicalFilter({
  hierarchicalFacet,
  label = "Categories",
  showCount = true,
}: AlgoliaHierarchicalFilterProps) {
  const attributes = buildHierarchyAttributes(hierarchicalFacet);
  const { items, refine, canRefine } = useHierarchicalMenu({
    attributes,
    separator: hierarchicalFacet.separator ?? DEFAULT_HIERARCHY_SEPARATOR,
    sortBy: ["count:desc"],
    showMore: true,
  });

  const mappedItems = mapHierarchicalMenuItems(items, hierarchicalFacet);
  const breadcrumbs = buildRefinedPath(mappedItems);

  return (
    <DropdownPrimitive label={label}>
      <HierarchicalFilterPrimitive
        items={mappedItems}
        breadcrumbs={breadcrumbs}
        onItemClick={refine}
        isLoading={!canRefine && mappedItems.length === 0}
        showCount={showCount}
        emptyMessage="No categories"
      />
    </DropdownPrimitive>
  );
}
