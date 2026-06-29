"use client";

import { JobsMobileSearch } from "@components/jobs/browser/JobsMobileSearch";
import {
  LocationSearch,
  type LocationSearchHandle,
} from "@components/google-maps/LocationSearch";
import { useRecentJobSearches } from "@hooks/jobs/use-recent-job-searches";
import { useUserLocation } from "@hooks/google-maps/use-user-location";
import { isGoogleMapsEnvConfigured } from "@lib/env-configured";
import { userLocationFromPlace } from "@lib/google-maps/location-labels";
import { Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

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

const locationInputClass =
  "h-12 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm shadow-soft-sm focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/15";

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

/** Sticky keyword + location search bar for the jobs browser. */
export function JobsSearchBar({
  query,
  location,
  onSearch,
  showEmployerHint = false,
}: Props) {
  const mapsEnabled = isGoogleMapsEnvConfigured();
  const { setLocation } = useUserLocation();
  const { addRecent } = useRecentJobSearches();
  const locationSearchRef = useRef<LocationSearchHandle>(null);
  const plainLocationRef = useRef<HTMLInputElement>(null);
  const [keyword, setKeyword] = useState(query);
  const [selectedPlace, setSelectedPlace] = useState<{
    label: string;
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    setKeyword(query);
    setSelectedPlace(null);
  }, [query, location]);

  useEffect(() => {
    if (!mapsEnabled && plainLocationRef.current) {
      plainLocationRef.current.value = location;
    }
  }, [location, mapsEnabled]);

  const handlePlaceSelect = useCallback(
    (place: google.maps.places.PlaceResult) => {
      const resolved = userLocationFromPlace(place);
      if (!resolved) return;
      setLocation(resolved);
      setSelectedPlace({
        label: resolved.label,
        lat: resolved.latitude,
        lng: resolved.longitude,
      });
    },
    [setLocation],
  );

  const runSearch = useCallback(
    (
      nextQuery: string,
      nextLocation: { label: string; lat?: number; lng?: number },
    ) => {
      setKeyword(nextQuery);
      if (nextLocation.lat !== undefined && nextLocation.lng !== undefined) {
        setSelectedPlace({
          label: nextLocation.label,
          lat: nextLocation.lat,
          lng: nextLocation.lng,
        });
      } else {
        setSelectedPlace(null);
      }
      addRecent({ query: nextQuery, location: nextLocation.label });
      onSearch(nextQuery, nextLocation);
    },
    [addRecent, onSearch],
  );

  function submitDesktop(e?: React.FormEvent) {
    e?.preventDefault();
    const locationLabel = (
      mapsEnabled
        ? locationSearchRef.current?.getValue()
        : plainLocationRef.current?.value
    )?.trim() ?? "";
    const coords =
      selectedPlace?.label === locationLabel
        ? { lat: selectedPlace.lat, lng: selectedPlace.lng }
        : undefined;

    runSearch(keyword.trim(), {
      label: locationLabel,
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
            {mapsEnabled ? (
              <LocationSearch
                ref={locationSearchRef}
                initialLabel={location}
                onPlaceSelect={handlePlaceSelect}
                placeholder={'City, postcode or "remote"'}
                className={locationInputClass}
              />
            ) : (
              <input
                ref={plainLocationRef}
                type="text"
                defaultValue={location}
                placeholder={'City, postcode or "remote"'}
                aria-label="City, postcode or remote"
                className={`${locationInputClass} outline-none`}
              />
            )}
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
