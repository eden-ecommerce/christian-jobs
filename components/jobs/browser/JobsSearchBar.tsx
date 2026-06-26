"use client";

import { JobsMobileSearch } from "@components/jobs/browser/JobsMobileSearch";
import { GoogleMapsProvider } from "@components/google-maps/GoogleMapsProvider";
import { LocationSearch } from "@components/google-maps/LocationSearch";
import { useRecentJobSearches } from "@hooks/jobs/use-recent-job-searches";
import { useUserLocation } from "@hooks/google-maps/use-user-location";
import { isGoogleMapsEnvConfigured } from "@lib/env-configured";
import { userLocationFromPlace } from "@lib/google-maps/location-labels";
import { Search } from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";

function desktopSearchFormClass(elevated: boolean) {
  return elevated
    ? "mx-auto hidden max-w-[1600px] flex-col gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-3 shadow-soft-sm lg:flex-row lg:items-center lg:gap-3 lg:p-3 lg:flex"
    : "mx-auto hidden max-w-[1600px] flex-col gap-3 px-4 py-4 lg:flex-row lg:items-center lg:gap-3 lg:px-6 lg:flex";
}

function SearchBarShell({
  elevated,
  children,
}: {
  elevated: boolean;
  children: ReactNode;
}) {
  if (!elevated) return <>{children}</>;
  return (
    <div className="mx-auto max-w-[1600px] px-4 py-3 sm:px-6">
      {children}
    </div>
  );
}

type Props = {
  query: string;
  location: string;
  onSearch: (
    query: string,
    location: { label: string; lat?: number; lng?: number },
  ) => void;
  /** Elevated search card styling on the default landing view. */
  showEmployerHint?: boolean;
};

function JobsSearchBarInner({
  query,
  location,
  onSearch,
  showEmployerHint = false,
}: Props) {
  const { setLocation } = useUserLocation();
  const { addRecent } = useRecentJobSearches();
  const [keyword, setKeyword] = useState(query);
  const [locationLabel, setLocationLabel] = useState(location);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  useEffect(() => {
    setKeyword(query);
    setLocationLabel(location);
  }, [query, location]);

  const handlePlaceSelect = useCallback(
    (place: google.maps.places.PlaceResult) => {
      const resolved = userLocationFromPlace(place);
      if (!resolved) return;
      setLocation(resolved);
      setLocationLabel(resolved.label);
      setCoords({ lat: resolved.latitude, lng: resolved.longitude });
    },
    [setLocation],
  );

  const runSearch = useCallback(
    (
      nextQuery: string,
      nextLocation: { label: string; lat?: number; lng?: number },
    ) => {
      setKeyword(nextQuery);
      setLocationLabel(nextLocation.label);
      if (nextLocation.lat !== undefined && nextLocation.lng !== undefined) {
        setCoords({ lat: nextLocation.lat, lng: nextLocation.lng });
      }
      addRecent({ query: nextQuery, location: nextLocation.label });
      onSearch(nextQuery, nextLocation);
    },
    [addRecent, onSearch],
  );

  function submitDesktop(e?: React.FormEvent) {
    e?.preventDefault();
    runSearch(keyword.trim(), {
      label: locationLabel.trim(),
      lat: coords?.lat,
      lng: coords?.lng,
    });
  }

  const keywordPlaceholder = "Job title, keywords, or company";

  return (
    <>
      <SearchBarShell elevated={showEmployerHint}>
        <form
          onSubmit={submitDesktop}
          className={desktopSearchFormClass(showEmployerHint)}
        >
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={keywordPlaceholder}
            aria-label={keywordPlaceholder}
            className="h-12 w-full rounded-xl border border-[#E5E7EB] bg-white pl-11 pr-3 text-sm text-foreground shadow-soft-sm outline-none placeholder:text-muted-foreground focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/15"
          />
        </div>

        <div className="relative flex-1">
          <LocationSearch
            key={locationLabel}
            defaultValue={locationLabel}
            onPlaceSelect={handlePlaceSelect}
            onInputChange={(value) => {
              setLocationLabel(value);
              if (!value) setCoords(null);
            }}
            placeholder={'City, postcode or "remote"'}
            className="h-12 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm shadow-soft-sm focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/15"
          />
        </div>

        <button
          type="submit"
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2d6a4f] px-7 text-sm font-semibold text-white shadow-soft transition-opacity hover:opacity-90"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          Search
        </button>
        </form>
      </SearchBarShell>

      <JobsMobileSearch
        query={query}
        location={location}
        onSearch={runSearch}
        elevated={showEmployerHint}
      />
    </>
  );
}

function JobsSearchBarPlain({
  query,
  location,
  onSearch,
  showEmployerHint = false,
}: Props) {
  const { addRecent } = useRecentJobSearches();
  const [keyword, setKeyword] = useState(query);
  const [locationLabel, setLocationLabel] = useState(location);

  useEffect(() => {
    setKeyword(query);
    setLocationLabel(location);
  }, [query, location]);

  const runSearch = useCallback(
    (nextQuery: string, nextLocation: { label: string }) => {
      setKeyword(nextQuery);
      setLocationLabel(nextLocation.label);
      addRecent({ query: nextQuery, location: nextLocation.label });
      onSearch(nextQuery, nextLocation);
    },
    [addRecent, onSearch],
  );

  function submitDesktop(e?: React.FormEvent) {
    e?.preventDefault();
    runSearch(keyword.trim(), { label: locationLabel.trim() });
  }

  const keywordPlaceholder = "Job title, keywords, or company";

  return (
    <>
      <SearchBarShell elevated={showEmployerHint}>
        <form
          onSubmit={submitDesktop}
          className={desktopSearchFormClass(showEmployerHint)}
        >
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={keywordPlaceholder}
            aria-label={keywordPlaceholder}
            className="h-12 w-full rounded-xl border border-[#E5E7EB] bg-white pl-11 pr-3 text-sm outline-none shadow-soft-sm focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/15"
          />
        </div>
        <input
          type="text"
          value={locationLabel}
          onChange={(e) => setLocationLabel(e.target.value)}
          placeholder={'City, postcode or "remote"'}
          aria-label="City, postcode or remote"
          className="h-12 flex-1 rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm shadow-soft-sm outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/15"
        />
        <button
          type="submit"
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2d6a4f] px-7 text-sm font-semibold text-white shadow-soft hover:opacity-90"
        >
          Search
        </button>
        </form>
      </SearchBarShell>

      <JobsMobileSearch
        query={query}
        location={location}
        onSearch={(q, loc) => runSearch(q, { label: loc.label })}
        elevated={showEmployerHint}
      />
    </>
  );
}

/** Sticky keyword + location search bar for the jobs browser. */
export function JobsSearchBar(props: Props) {
  if (!isGoogleMapsEnvConfigured()) {
    return <JobsSearchBarPlain {...props} />;
  }

  return (
    <GoogleMapsProvider>
      <JobsSearchBarInner {...props} />
    </GoogleMapsProvider>
  );
}
