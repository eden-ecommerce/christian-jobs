"use client";

import { JobsMobileSearch } from "@components/jobs/browser/JobsMobileSearch";
import { JobsLocationRadiusSelect } from "@components/jobs/browser/JobsLocationRadiusSelect";
import {
  LocationSearch,
  type LocationSearchHandle,
} from "@components/google-maps/LocationSearch";
import { useRecentJobSearches } from "@hooks/jobs/use-recent-job-searches";
import { useUserLocation } from "@hooks/google-maps/use-user-location";
import { isGoogleMapsEnvConfigured } from "@lib/env-configured";
import { userLocationFromPlace } from "@lib/google-maps/location-labels";
import { MapPin, Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

function desktopSearchFormClass(elevated: boolean) {
  return elevated
    ? "mx-auto hidden max-w-[1600px] flex-col gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-3 shadow-soft-sm lg:flex-row lg:items-start lg:gap-3 lg:p-3 lg:flex"
    : "mx-auto hidden max-w-[1600px] flex-col gap-3 px-4 py-4 lg:flex-row lg:items-start lg:gap-3 lg:px-6 lg:flex";
}

function SearchField({
  label,
  htmlFor,
  children,
  compact = false,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <label
        htmlFor={htmlFor}
        className={
          compact
            ? "sr-only"
            : "text-xs font-medium text-muted-foreground"
        }
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const KEYWORD_FIELD_ID = "jobs-search-keywords";
const LOCATION_FIELD_ID = "jobs-search-location";
const KEYWORD_FIELD_LABEL = "Job Title";
const LOCATION_FIELD_LABEL = "Location";

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

const locationInputInnerClass =
  "h-12 min-w-0 flex-1 rounded-none border-0 bg-transparent px-3 text-sm shadow-none outline-none focus-visible:border-transparent focus-visible:ring-0";

const locationFieldShellClass =
  "flex min-w-0 flex-1 items-center rounded-xl border border-[#E5E7EB] bg-white shadow-soft-sm focus-within:border-[#2d6a4f] focus-within:ring-2 focus-within:ring-[#2d6a4f]/15";

type Props = {
  query: string;
  location: string;
  lat?: number;
  lng?: number;
  radius?: number;
  onSearch: (
    query: string,
    location: { label: string; lat?: number; lng?: number },
  ) => void;
  onRadiusChange: (radius: number | undefined) => void;
  /** Elevated search card styling on the default landing view. */
  showEmployerHint?: boolean;
  /** Optional element rendered after the Search button (desktop only). */
  endSlot?: ReactNode;
  /** When false, the desktop (lg+) search form is not rendered. Mobile form is unaffected. */
  showDesktopForm?: boolean;
  /** When false, the mobile search bar/sheet is not rendered. */
  showMobileForm?: boolean;
  /** Tighter single-row layout for v3 and similar experiments. */
  compact?: boolean;
};

/** Sticky keyword + location search bar for the jobs browser. */
export function JobsSearchBar({
  query,
  location,
  lat,
  lng,
  radius,
  onSearch,
  onRadiusChange,
  showEmployerHint = false,
  endSlot,
  showDesktopForm = true,
  showMobileForm = true,
  compact = false,
}: Props) {
  const mapsEnabled = isGoogleMapsEnvConfigured();
  const { setLocation } = useUserLocation();
  const { addRecent } = useRecentJobSearches();
  const locationSearchRef = useRef<LocationSearchHandle>(null);
  const plainLocationRef = useRef<HTMLInputElement>(null);
  const [keyword, setKeyword] = useState(query);
  const [locationValue, setLocationValue] = useState(location);
  const [selectedPlace, setSelectedPlace] = useState<{
    label: string;
    lat: number;
    lng: number;
  } | null>(null);

  const hasGeoFromUrl = lat !== undefined && lng !== undefined;

  useEffect(() => {
    setKeyword(query);
    setLocationValue(location);
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

  const resetLocationState = useCallback(() => {
    setLocationValue("");
    setSelectedPlace(null);
  }, []);

  const handleClearLocation = useCallback(() => {
    if (mapsEnabled) {
      locationSearchRef.current?.clear();
      return;
    }
    if (plainLocationRef.current) {
      plainLocationRef.current.value = "";
    }
    resetLocationState();
  }, [mapsEnabled, resetLocationState]);

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
        : hasGeoFromUrl
          ? { lat, lng }
          : undefined;

    runSearch(keyword.trim(), {
      label: locationLabel,
      lat: coords?.lat,
      lng: coords?.lng,
    });
  }

  const useCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        runSearch(keyword.trim(), {
          label: "Current location",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => undefined,
    );
  }, [keyword, runSearch]);

  const keywordPlaceholder = "Job title, keywords, or company";
  const inputHeightClass = compact ? "h-10" : "h-12";
  const showLocationClear = locationValue.trim() !== "";
  const desktopFormClass = compact
    ? "mx-auto hidden max-w-none flex-col gap-2 px-0 py-2 lg:flex-row lg:items-center lg:gap-2 lg:flex"
    : desktopSearchFormClass(showEmployerHint);

  return (
    <>
      {showDesktopForm ? (
      <SearchBarShell elevated={showEmployerHint && !compact}>
        <form
          onSubmit={submitDesktop}
          className={desktopFormClass}
        >
          <SearchField label={KEYWORD_FIELD_LABEL} htmlFor={KEYWORD_FIELD_ID} compact={compact}>
            <div className="relative">
              <Search
                className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground ${compact ? "h-3.5 w-3.5" : "left-4 h-4 w-4"}`}
                aria-hidden="true"
              />
              <input
                id={KEYWORD_FIELD_ID}
                type="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={keywordPlaceholder}
                className={`${inputHeightClass} w-full rounded-xl border border-[#E5E7EB] bg-white pr-3 text-sm text-foreground shadow-soft-sm outline-none placeholder:text-muted-foreground focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/15 ${compact ? "pl-9" : "pl-11"}`}
              />
            </div>
          </SearchField>

          <SearchField label={LOCATION_FIELD_LABEL} htmlFor={LOCATION_FIELD_ID} compact={compact}>
            <div className={locationFieldShellClass}>
              <div className="relative min-w-0 flex-1">
                {mapsEnabled ? (
                  <LocationSearch
                    ref={locationSearchRef}
                    id={LOCATION_FIELD_ID}
                    initialLabel={location}
                    onPlaceSelect={handlePlaceSelect}
                    onClear={resetLocationState}
                    onBlur={(event) => setLocationValue(event.target.value)}
                    placeholder={'City, postcode or "remote"'}
                    className={`${inputHeightClass} min-w-0 flex-1 rounded-none border-0 bg-transparent px-3 text-sm shadow-none outline-none focus-visible:border-transparent focus-visible:ring-0`}
                  />
                ) : (
                  <>
                    <input
                      ref={plainLocationRef}
                      id={LOCATION_FIELD_ID}
                      type="text"
                      defaultValue={location}
                      onChange={(event) => setLocationValue(event.target.value)}
                      placeholder={'City, postcode or "remote"'}
                      className={`${inputHeightClass} min-w-0 w-full flex-1 rounded-none border-0 bg-transparent px-3 text-sm shadow-none outline-none focus-visible:border-transparent focus-visible:ring-0${showLocationClear ? " pr-10" : ""}`}
                    />
                    {showLocationClear ? (
                      <button
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={handleClearLocation}
                        className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-[#86868b] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]"
                        aria-label="Clear location"
                      >
                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    ) : null}
                  </>
                )}
              </div>
              <div
                className="h-5 w-px shrink-0 bg-[#E5E7EB]"
                aria-hidden="true"
              />
              <JobsLocationRadiusSelect
                inline
                radius={radius}
                onChange={onRadiusChange}
              />
            </div>
            {!compact ? (
            <button
              type="button"
              onClick={useCurrentLocation}
              className="mt-1.5 inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-[#2d6a4f] hover:underline"
            >
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              Use my current location
            </button>
            ) : null}
          </SearchField>

          <button
            type="submit"
            className={`inline-flex ${inputHeightClass} shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2d6a4f] text-sm font-semibold text-white shadow-soft transition-opacity hover:opacity-90 ${compact ? "self-auto px-5 lg:self-auto" : "mt-5 self-start px-7"}`}
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            Search
          </button>

          {endSlot ? (
            <div className={compact ? "self-auto" : "mt-5 self-start"}>{endSlot}</div>
          ) : null}
        </form>
      </SearchBarShell>
      ) : null}

      {showMobileForm ? (
        <JobsMobileSearch
          query={query}
          location={location}
          lat={lat}
          lng={lng}
          radius={radius}
          onSearch={runSearch}
          onRadiusChange={onRadiusChange}
          elevated={showEmployerHint}
        />
      ) : null}
    </>
  );
}
