"use client";

import { CategoriesHierarchicalFilter } from "@components/events/CategoriesHierarchicalFilter";
import { EventsUserLocationFilter } from "@components/events/EventsUserLocationFilter";
import { useUserLocation } from "@hooks/google-maps/use-user-location";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { ChevronDown } from "lucide-react";
import { NAMESPACE_PATH } from "@lib/config";
import type { JobFacet } from "@lib/algolia/jobs";

export type Facet = { label: string; value: string; count: number };

type Props = {
  categories: JobFacet[];
  categoryLvl1: JobFacet[];
  categoryLvl2: JobFacet[];
  categoryLvl3: JobFacet[];
  categoryLvl4: JobFacet[];
  organisationTypes: Facet[];
  hasGeo: boolean;
};

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border pb-5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-1 text-left"
      >
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>
      {open ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}

function Radio({ checked }: { checked: boolean }) {
  return (
    <span
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
        checked ? "border-primary" : "border-muted-foreground/40"
      }`}
      aria-hidden="true"
    >
      {checked ? <span className="h-2 w-2 rounded-full bg-primary" /> : null}
    </span>
  );
}

export function JobSearchFilters({
  categories,
  categoryLvl1,
  categoryLvl2,
  categoryLvl3,
  categoryLvl4,
  organisationTypes,
  hasGeo,
}: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const { clearLocation } = useUserLocation();

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

  const activeCategory = params.get("category") ?? "";
  const activeOrg = params.get("org") ?? "";
  const activeSort = params.get("sort") ?? (hasGeo ? "distance" : "relevance");

  const hasActiveFilters =
    Boolean(activeCategory) ||
    Boolean(activeOrg) ||
    Boolean(params.get("place")) ||
    Boolean(params.get("sort")) ||
    Boolean(params.get("online"));

  return (
    <aside
      className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5"
      aria-label="Filters"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Filters</h2>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={() => {
              clearLocation();
              router.push(
                `${NAMESPACE_PATH}/search${
                  params.get("q") ? `?q=${params.get("q")}` : ""
                }`,
              );
            }}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Clear all
          </button>
        ) : null}
      </div>

      <Section title="Location">
        <EventsUserLocationFilter />
      </Section>

      <CategoriesHierarchicalFilter
        lvl0={categories}
        lvl1={categoryLvl1}
        lvl2={categoryLvl2}
        lvl3={categoryLvl3}
        lvl4={categoryLvl4}
      />

      <Section title="Organisation Type">
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => apply({ org: null })}
            className="flex items-center gap-2.5 rounded-md px-1 py-1.5 text-left text-sm text-foreground"
          >
            <Radio checked={!activeOrg} />
            <span className={!activeOrg ? "font-medium" : ""}>All Types</span>
          </button>
          {organisationTypes.map((org) => (
            <button
              key={org.value}
              type="button"
              onClick={() =>
                apply({ org: activeOrg === org.value ? null : org.value })
              }
              className="flex items-center justify-between gap-2 rounded-md px-1 py-1.5 text-left text-sm text-foreground"
            >
              <span className="flex items-center gap-2.5">
                <Radio checked={activeOrg === org.value} />
                <span className={activeOrg === org.value ? "font-medium" : ""}>
                  {org.label}
                </span>
              </span>
              <span className="tabular-nums text-muted-foreground">
                ({org.count})
              </span>
            </button>
          ))}
        </div>
      </Section>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-foreground">Sort By</h3>
        <div className="relative">
          <select
            value={activeSort}
            onChange={(e) =>
              apply({
                sort: e.target.value === (hasGeo ? "distance" : "relevance") ? null : e.target.value,
              })
            }
            className="h-11 w-full appearance-none rounded-md border border-input bg-background px-3 pr-9 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
          >
            <option value="relevance">Relevance</option>
            <option value="date_asc">Date (Oldest First)</option>
            <option value="date_desc">Date (Newest First)</option>
            {hasGeo ? <option value="distance">Distance (Nearest)</option> : null}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
      </div>
    </aside>
  );
}
