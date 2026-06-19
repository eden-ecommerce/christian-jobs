"use client";

import type {
  HierarchicalBreadcrumb,
  HierarchicalFilterItem,
} from "@lib/algolia/hierarchical-filter";
import { cn } from "@lib/utils";

type HierarchicalFilterPrimitiveProps = {
  items: HierarchicalFilterItem[];
  breadcrumbs: HierarchicalBreadcrumb[];
  onItemClick: (value: string) => void;
  isLoading?: boolean;
  showCount?: boolean;
  emptyMessage?: string;
};

function HierarchicalFilterRow({
  item,
  showCount,
  onItemClick,
}: {
  item: HierarchicalFilterItem;
  showCount: boolean;
  onItemClick: (value: string) => void;
}) {
  const hasChildren = (item.children?.length ?? 0) > 0;
  const displayLabel = hasChildren ? `« ${item.label}` : item.label;

  return (
    <li>
      <button
        type="button"
        onClick={() => onItemClick(item.value)}
        className={cn(
          "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted",
          item.isRefined && "bg-muted font-medium",
        )}
      >
        <span>{displayLabel}</span>
        {showCount ? (
          <span className="ml-2 text-xs text-muted-foreground">
            ({item.count})
          </span>
        ) : null}
      </button>
    </li>
  );
}

export function HierarchicalFilterPrimitive({
  items,
  breadcrumbs,
  onItemClick,
  isLoading = false,
  showCount = true,
  emptyMessage = "No options",
}: HierarchicalFilterPrimitiveProps) {
  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">Loading options…</p>
    );
  }

  const refinedNode = findRefinedNode(items);
  const listItems = refinedNode?.children ?? items;

  if (listItems.length === 0 && breadcrumbs.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {breadcrumbs.length > 0 ? (
        <nav aria-label="Hierarchy breadcrumbs" className="flex flex-wrap gap-1">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.value} className="flex items-center gap-1">
              {index > 0 ? (
                <span className="text-xs text-muted-foreground">/</span>
              ) : null}
              <button
                type="button"
                onClick={() => onItemClick(crumb.value)}
                className="text-xs text-muted-foreground underline-offset-2 hover:underline"
              >
                {crumb.label}
              </button>
            </span>
          ))}
        </nav>
      ) : null}

      <ul className="flex flex-col gap-0.5">
        {listItems.map((item) => (
          <HierarchicalFilterRow
            key={item.value}
            item={item}
            showCount={showCount}
            onItemClick={onItemClick}
          />
        ))}
      </ul>
    </div>
  );
}

function findRefinedNode(
  nodes: HierarchicalFilterItem[],
): HierarchicalFilterItem | null {
  for (const node of nodes) {
    if (node.isRefined) {
      return node;
    }
    if (node.children?.length) {
      const child = findRefinedNode(node.children);
      if (child) {
        return child;
      }
    }
  }
  return null;
}
