"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { ChevronDown } from "lucide-react";
import { NAMESPACE_PATH } from "@lib/config";
import type { EventFacet } from "@lib/algolia/events";

type Props = {
  lvl0: EventFacet[];
  lvl1: EventFacet[];
  lvl2: EventFacet[];
  lvl3: EventFacet[];
  lvl4: EventFacet[];
};

/**
 * URL-param-driven hierarchical category filter.
 * Reads/writes the `category` search param to drive the server query.
 * Separator between hierarchy levels is " > " (Algolia convention).
 */
export function CategoriesHierarchicalFilter({ lvl0, lvl1, lvl2, lvl3, lvl4 }: Props) {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const params = useSearchParams();
  const selected = params.get("category") ?? "";

  const select = useCallback(
    (value: string | null) => {
      const next = new URLSearchParams(params.toString());
      if (value === null || value === selected) {
        next.delete("category");
      } else {
        next.set("category", value);
      }
      next.delete("page");
      router.push(`${NAMESPACE_PATH}/search?${next.toString()}`);
    },
    [params, router, selected],
  );

  // Determine drill depth from selected value.
  // e.g. "" = lvl0 list, "Worship" = show lvl1 children of Worship,
  // "Worship > Sung Worship" = show lvl2 children.
  const depth = selected ? selected.split(" > ").length : 0;

  // The back-nav value: go up one level.
  const parentValue = depth > 1 ? selected.split(" > ").slice(0, -1).join(" > ") : null;

  // The label for the current selected node (last segment).
  const currentLabel = selected ? selected.split(" > ").at(-1) ?? selected : null;

  // Children to display at current depth.
  let children: EventFacet[] = [];
  if (depth === 0) {
    children = lvl0;
  } else if (depth === 1) {
    // lvl1 values are "Parent > Child" — filter to those starting with selected prefix.
    children = lvl1.filter((f) => f.value.startsWith(`${selected} > `));
  } else if (depth === 2) {
    children = lvl2.filter((f) => f.value.startsWith(`${selected} > `));
  } else if (depth === 3) {
    children = lvl3.filter((f) => f.value.startsWith(`${selected} > `));
  } else if (depth === 4) {
    children = lvl4.filter((f) => f.value.startsWith(`${selected} > `));
  }

  if (lvl0.length === 0) return null;

  return (
    <div className="border-b border-border pb-5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-1 text-left"
      >
        <span className="text-sm font-semibold text-foreground">
          Event Categories
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div className="mt-3 flex flex-col gap-0.5">
          {/* Back navigation when drilled in */}
          {selected ? (
            <button
              type="button"
              onClick={() => select(parentValue)}
              className="mb-1 flex items-center gap-1 text-left text-sm font-semibold text-foreground hover:underline"
            >
              <span aria-hidden="true">«</span>
              <span>{currentLabel}</span>
            </button>
          ) : null}

          {/* Child items */}
          {children.length > 0 ? (
            children.map((facet) => (
              <button
                key={facet.value}
                type="button"
                onClick={() => select(facet.value)}
                aria-pressed={selected === facet.value}
                className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted ${
                  selected === facet.value
                    ? "font-medium text-primary"
                    : "text-foreground"
                }`}
              >
                <span>{facet.label}</span>
                <span className="tabular-nums text-muted-foreground">
                  ({facet.count})
                </span>
              </button>
            ))
          ) : selected ? (
            // Drilled in but no deeper children — show the selected item as active
            <p className="px-2 py-1.5 text-sm text-muted-foreground">
              No subcategories
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
