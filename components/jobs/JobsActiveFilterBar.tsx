"use client";

import { FilterBadgePrimitive } from "@components/search/active-filters/FilterBadgePrimitive";
import { useUserLocation } from "@hooks/google-maps/use-user-location";
import { extractHierarchyLabel } from "@eden-ecommerce/lib/algolia/hierarchical-filter";
import { defaultHierarchicalSearchPreset } from "@lib/algolia/constants";
import { NAMESPACE_PATH } from "@lib/config";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

type ActiveBadge = {
  key: string;
  label: string;
  prefix?: string;
  onRemove: () => void;
};

const SORT_LABELS: Record<string, string> = {
  date_asc: "Date (oldest)",
  date_desc: "Date (newest)",
  distance: "Distance",
  relevance: "Relevance",
};

export function JobsActiveFilterBar() {
  const router = useRouter();
  const params = useSearchParams();
  const { location, clearLocation, isHydrated } = useUserLocation();

  const apply = useCallback(
    (changes: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(changes)) {
        if (value === null || value === "") next.delete(key);
        else next.set(key, value);
      }
      next.delete("page");
      router.push(`${NAMESPACE_PATH}/search?${next.toString()}`);
    },
    [params, router],
  );

  const badges = useMemo(() => {
    const items: ActiveBadge[] = [];
    const place = params.get("place");
    const lat = params.get("lat");
    const lng = params.get("lng");
    const hasGeo = Boolean(lat && lng);

    if (hasGeo && (place || (isHydrated && location))) {
      const label = place || location?.label || "your location";
      items.push({
        key: "location",
        prefix: "Near",
        label,
        onRemove: () => {
          clearLocation();
          apply({ lat: null, lng: null, place: null });
        },
      });
    }

    const category = params.get("category");
    if (category) {
      items.push({
        key: "category",
        label: extractHierarchyLabel(
          category,
          defaultHierarchicalSearchPreset.hierarchicalFacet,
        ),
        onRemove: () => apply({ category: null }),
      });
    }

    const org = params.get("org");
    if (org) {
      items.push({
        key: "org",
        label: org.charAt(0).toUpperCase() + org.slice(1),
        onRemove: () => apply({ org: null }),
      });
    }

    const online = params.get("online");
    if (online === "true") {
      items.push({
        key: "online",
        label: "Remote only",
        onRemove: () => apply({ online: null }),
      });
    } else if (online === "false") {
      items.push({
        key: "online",
        label: "On-site only",
        onRemove: () => apply({ online: null }),
      });
    }

    const sort = params.get("sort");
    const defaultSort = hasGeo ? "distance" : "relevance";
    if (sort && sort !== defaultSort) {
      items.push({
        key: "sort",
        label: SORT_LABELS[sort] ?? sort,
        onRemove: () => apply({ sort: null }),
      });
    }

    return items;
  }, [apply, clearLocation, isHydrated, location, params]);

  if (badges.length === 0) return null;

  const clearAll = () => {
    clearLocation();
    const query = params.get("q");
    router.push(
      query
        ? `${NAMESPACE_PATH}/search?q=${encodeURIComponent(query)}`
        : `${NAMESPACE_PATH}/search`,
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {badges.map((badge) => (
        <FilterBadgePrimitive
          key={badge.key}
          prefix={badge.prefix}
          label={badge.label}
          onRemove={badge.onRemove}
        />
      ))}
      {badges.length > 1 ? (
        <button
          type="button"
          onClick={clearAll}
          className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          Clear all
        </button>
      ) : null}
    </div>
  );
}
