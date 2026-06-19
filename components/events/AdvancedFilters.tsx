"use client";

import { EventsUserLocationFilter } from "@components/events/EventsUserLocationFilter";
import { CategoriesHierarchicalFilter } from "@components/events/CategoriesHierarchicalFilter";
import { useUserLocation } from "@hooks/google-maps/use-user-location";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { ChevronDown } from "lucide-react";
import { NAMESPACE_PATH } from "@lib/config";
import {
  matchQuickRange,
  quickRangeDates,
  type QuickRange,
} from "@lib/date-range";
import type { EventFacet } from "@lib/algolia/events";

export type Facet = { label: string; value: string; count: number };

type Props = {
  categoryLvl0: EventFacet[];
  categoryLvl1: EventFacet[];
  categoryLvl2: EventFacet[];
  categoryLvl3: EventFacet[];
  categoryLvl4: EventFacet[];
  organisationTypes: Facet[];
  hasGeo: boolean;
};

const QUICK_RANGES: { label: string; value: QuickRange }[] = [
  { label: "Today", value: "today" },
  { label: "Tomorrow", value: "tomorrow" },
  { label: "This Weekend", value: "weekend" },
  { label: "Next 7 Days", value: "next7" },
];

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

export function AdvancedFilters({
  categoryLvl0,
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

  /** Apply a batch of param changes and navigate. null removes the key. */
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
  const activeSort =
    params.get("sort") ?? (hasGeo ? "distance" : "date_asc");
  const fromDate = params.get("from") ?? "";
  const toDate = params.get("to") ?? "";
  const activeQuick = matchQuickRange(fromDate || undefined, toDate || undefined);

  const hasActiveFilters =
    Boolean(activeCategory) ||
    Boolean(activeOrg) ||
    Boolean(fromDate) ||
    Boolean(toDate) ||
    Boolean(params.get("place")) ||
    Boolean(params.get("sort")) ||
    Boolean(params.get("online"));

  return (
    <div className="flex flex-col gap-5">
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

      <Section title="Date Range">
        <div className="grid grid-cols-2 gap-2">
          {QUICK_RANGES.map((q) => {
            const isActive = activeQuick === q.value;
            return (
              <button
                key={q.value}
                type="button"
                onClick={() => {
                  if (isActive) {
                    apply({ from: null, to: null });
                  } else {
                    const r = quickRangeDates(q.value);
                    apply({ from: r.from, to: r.to });
                  }
                }}
                aria-pressed={isActive}
                className={`rounded-md border px-3 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-background text-foreground hover:bg-muted"
                }`}
              >
                {q.label}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              From
            </span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => apply({ from: e.target.value || null })}
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">To</span>
            <input
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(e) => apply({ to: e.target.value || null })}
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
            />
          </label>
        </div>
      </Section>

      <CategoriesHierarchicalFilter
        lvl0={categoryLvl0}
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
                sort:
                  e.target.value === (hasGeo ? "distance" : "date_asc")
                    ? null
                    : e.target.value,
              })
            }
            className="h-11 w-full appearance-none rounded-md border border-input bg-background px-3 pr-9 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
          >
            <option value="date_asc">Date (Earliest First)</option>
            <option value="date_desc">Date (Latest First)</option>
            {hasGeo ? <option value="distance">Distance (Nearest)</option> : null}
            <option value="relevance">Relevance</option>
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
      </div>
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
