/**
 * Generic hierarchical facet utilities for Algolia InstantSearch.
 *
 * Adopter checklist:
 * 1. Set `facetRoot` + `depth` to match your Algolia hierarchical facet group.
 * 2. Match `separator` and `labelIdDelimiter` to your indexing pipeline.
 * 3. Add a preset in `algoliaIndexPresets` — do not edit connector components.
 * 4. For JSON-encoded segments (e.g. products `mixed_categories_next`), extend
 *    with a custom `formatLabel` in a future extension point — v1 uses `Label:::id`.
 */
import type { HierarchicalMenuItem } from "instantsearch.js/es/connectors/hierarchical-menu/connectHierarchicalMenu";

export const DEFAULT_HIERARCHY_SEPARATOR = " > ";
export const DEFAULT_LABEL_ID_DELIMITER = ":::";

export type HierarchicalFacetConfig = {
  facetRoot: string;
  depth: number;
  separator?: string;
  labelIdDelimiter?: string;
};

export interface HierarchicalFilterItem {
  value: string;
  label: string;
  count: number;
  isRefined: boolean;
  children?: HierarchicalFilterItem[];
}

export interface HierarchicalBreadcrumb {
  value: string;
  label: string;
}

function resolveEncoding(config?: HierarchicalFacetConfig) {
  return {
    separator: config?.separator ?? DEFAULT_HIERARCHY_SEPARATOR,
    labelIdDelimiter: config?.labelIdDelimiter ?? DEFAULT_LABEL_ID_DELIMITER,
  };
}

export function buildHierarchyAttributes(config: HierarchicalFacetConfig): string[] {
  return Array.from(
    { length: config.depth },
    (_, index) => `${config.facetRoot}.lvl${index}`,
  );
}

export function isHierarchicalAttribute(
  attribute: string,
  facetRoot: string,
): boolean {
  if (!facetRoot) {
    return false;
  }
  return attribute.startsWith(`${facetRoot}.`);
}

export function extractHierarchyLabel(
  value: string,
  config?: HierarchicalFacetConfig,
): string {
  const { separator, labelIdDelimiter } = resolveEncoding(config);
  const lastSegment = value.split(separator).at(-1) ?? value;
  const [label] = lastSegment.split(labelIdDelimiter);
  return label ?? lastSegment;
}

export function extractHierarchyId(
  value: string,
  config?: HierarchicalFacetConfig,
): string | null {
  const { separator, labelIdDelimiter } = resolveEncoding(config);
  const lastSegment = value.split(separator).at(-1) ?? value;
  const parts = lastSegment.split(labelIdDelimiter);
  return parts.length > 1 ? (parts.at(-1) ?? null) : null;
}

export function mapHierarchicalMenuItems(
  items: HierarchicalMenuItem[],
  config?: HierarchicalFacetConfig,
): HierarchicalFilterItem[] {
  return items.map((item) => ({
    value: item.value,
    label: extractHierarchyLabel(item.value, config),
    count: item.count,
    isRefined: item.isRefined,
    children: item.data
      ? mapHierarchicalMenuItems(item.data, config)
      : undefined,
  }));
}

export function buildRefinedPath(
  items: HierarchicalFilterItem[],
): HierarchicalBreadcrumb[] {
  const breadcrumbs: HierarchicalBreadcrumb[] = [];

  function walk(nodes: HierarchicalFilterItem[]): boolean {
    for (const node of nodes) {
      if (node.isRefined) {
        breadcrumbs.push({ value: node.value, label: node.label });
        if (node.children?.length) {
          walk(node.children);
        }
        return true;
      }
    }
    return false;
  }

  walk(items);
  return breadcrumbs;
}
