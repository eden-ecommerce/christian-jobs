"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { ChevronDown, LocateFixed, Loader2 } from "lucide-react";
import { NAMESPACE_PATH } from "@lib/config";
import {
  matchQuickRange,
  quickRangeDates,
  type QuickRange,
} from "@lib/date-range";
import type { TownOption } from "@components/events/LocationSearchBox";

type Facet = { label: string; value: string; count: number };

type Props = {
  categories: Facet[];
  organisationTypes: Facet[];
  towns: TownOption[];
  hasGeo: boolean;
};

const QUICK_RANGES: { label: string; value: QuickRange }[] = [
  { label: "Today", value: "today" },
  { label: "Tomorrow", value: "tomorrow" },
  { label: "This Weekend", value: "weekend" },
  { label: "Next 7 Days", value: "next7" },
];

const POSTCODE_RE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

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
  categories,
  organisationTypes,
  towns,
  hasGeo,
}: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const [locationInput, setLocationInput] = useState(params.get("place") ?? "");
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

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

  const setGeo = useCallback(
    (lat: number, lng: number, place: string) => {
      apply({
        lat: String(lat),
        lng: String(lng),
        place,
        q: null,
      });
    },
    [apply],
  );

  async function resolveLocation() {
    const value = locationInput.trim();
    if (!value) {
      apply({ lat: null, lng: null, place: null });
      return;
    }
    setGeoError(null);

    // 1) UK postcode lookup via postcodes.io.
    if (POSTCODE_RE.test(value)) {
      setGeoLoading(true);
      try {
        const res = await fetch(
          `https://api.postcodes.io/postcodes/${encodeURIComponent(value)}`,
        );
        const data = await res.json();
        if (data?.result?.latitude) {
          setGeo(
            data.result.latitude,
            data.result.longitude,
            data.result.postcode ?? value,
          );
          return;
        }
        setGeoError("Postcode not found.");
      } catch {
        setGeoError("Could not look up that postcode.");
      } finally {
        setGeoLoading(false);
      }
      return;
    }

    // 2) Match a known UK town by name.
    const match = towns.find(
      (t) => t.name.toLowerCase() === value.toLowerCase(),
    );
    if (match) {
      setGeo(match.lat, match.lng, match.name);
      return;
    }
    const partial = towns.find((t) =>
      t.name.toLowerCase().startsWith(value.toLowerCase()),
    );
    if (partial) {
      setGeo(partial.lat, partial.lng, partial.name);
      return;
    }

    // 3) Fall back to a free-text query.
    apply({ q: value, lat: null, lng: null, place: null });
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }
    setGeoLoading(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLoading(false);
        setLocationInput("My location");
        setGeo(pos.coords.latitude, pos.coords.longitude, "My location");
      },
      () => {
        setGeoLoading(false);
        setGeoError("Could not get your location.");
      },
      { enableHighAccuracy: false, timeout: 8000 },
    );
  }

  const townNames = useMemo(
    () => Array.from(new Set(towns.map((t) => t.name))).sort(),
    [towns],
  );

  return (
    <aside
      className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5"
      aria-label="Advanced filters"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Advanced Filters</h2>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={() =>
              router.push(
                `${NAMESPACE_PATH}/search${
                  params.get("q") ? `?q=${params.get("q")}` : ""
                }`,
              )
            }
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Clear
          </button>
        ) : null}
      </div>

      <Section title="Location">
        <datalist id="uk-towns">
          {townNames.map((n) => (
            <option key={n} value={n} />
          ))}
        </datalist>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            list="uk-towns"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                resolveLocation();
              }
            }}
            onBlur={resolveLocation}
            placeholder="Enter postcode or location"
            aria-label="Enter postcode or location"
            autoComplete="off"
            className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30"
          />
          <button
            type="button"
            onClick={useMyLocation}
            disabled={geoLoading}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-input bg-background text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
          >
            {geoLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <LocateFixed className="h-4 w-4 text-primary" aria-hidden="true" />
            )}
            Use my current location
          </button>
          {geoError ? (
            <p className="text-xs text-destructive">{geoError}</p>
          ) : null}
        </div>
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

      <Section title="Event Categories">
        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">No categories.</p>
        ) : (
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => apply({ category: null })}
              className={`rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                !activeCategory
                  ? "font-semibold text-primary"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() =>
                  apply({
                    category: activeCategory === cat.value ? null : cat.value,
                  })
                }
                aria-pressed={activeCategory === cat.value}
                className={`flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                  activeCategory === cat.value
                    ? "font-semibold text-primary"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <span>{cat.label}</span>
                <span className="tabular-nums text-muted-foreground">
                  ({cat.count})
                </span>
              </button>
            ))}
          </div>
        )}
      </Section>

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
    </aside>
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
