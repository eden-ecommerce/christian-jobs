"use client";

import {
  LocationSearch,
  type LocationSearchHandle,
} from "@components/google-maps/LocationSearch";
import { useRecentJobSearches } from "@hooks/jobs/use-recent-job-searches";
import { useUserLocation } from "@hooks/google-maps/use-user-location";
import { isGoogleMapsEnvConfigured } from "@lib/env-configured";
import { userLocationFromPlace } from "@lib/google-maps/location-labels";
import { useCallback, useEffect, useRef, useState, type FocusEvent } from "react";

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
};

const FLOATING_INPUT_CLASS =
  "h-[60px] w-full border-0 bg-transparent pb-2 pl-5 pr-3 pt-6 text-base text-foreground shadow-none outline-none focus-visible:ring-0 [&::-webkit-search-cancel-button]:hidden";

/**
 * Large desktop-only search form for the v2 hero section.
 * Inputs are h-14 (~25% taller than the standard h-12 compact bar).
 */
export function JobsHeroSearchV2({
  query,
  location,
  lat,
  lng,
  radius,
  onSearch,
  onRadiusChange,
}: Props) {
  const mapsEnabled = isGoogleMapsEnvConfigured();
  const { setLocation } = useUserLocation();
  const { addRecent } = useRecentJobSearches();
  const locationRef = useRef<LocationSearchHandle>(null);
  const plainLocationRef = useRef<HTMLInputElement>(null);
  const [keyword, setKeyword] = useState(query);
  const [selectedPlace, setSelectedPlace] = useState<{
    label: string;
    lat: number;
    lng: number;
  } | null>(null);
  const [keywordFocused, setKeywordFocused] = useState(false);
  const [locationFocused, setLocationFocused] = useState(false);
  const [locationValue, setLocationValue] = useState(location);

  const hasGeoFromUrl = lat !== undefined && lng !== undefined;

  useEffect(() => {
    setKeyword(query);
    setSelectedPlace(null);
    setLocationValue(location);
  }, [query, location]);

  useEffect(() => {
    if (!mapsEnabled && plainLocationRef.current) {
      plainLocationRef.current.value = location;
    }
  }, [location, mapsEnabled]);

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

  const handlePlaceSelect = useCallback(
    (place: google.maps.places.PlaceResult) => {
      const resolved = userLocationFromPlace(place);
      if (!resolved) return;
      setLocation(resolved);
      runSearch(keyword.trim(), {
        label: resolved.label,
        lat: resolved.latitude,
        lng: resolved.longitude,
      });
    },
    [setLocation, runSearch, keyword],
  );

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const locationLabel =
      (
        mapsEnabled
          ? locationRef.current?.getValue()
          : plainLocationRef.current?.value
      )?.trim() ?? "";
    const coords =
      selectedPlace?.label === locationLabel
        ? { lat: selectedPlace.lat, lng: selectedPlace.lng }
        : hasGeoFromUrl
          ? { lat, lng }
          : undefined;
    runSearch(keyword.trim(), { label: locationLabel, ...coords });
  }

  const useCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        runSearch(keyword.trim(), {
          label: "Current location",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => undefined,
    );
  }, [keyword, runSearch]);

  const keywordUp = keywordFocused || keyword.trim() !== "";
  const locationUp = locationFocused || locationValue.trim() !== "";
  const canSearch = keyword.trim() !== "" || locationValue.trim() !== "";

  const labelClass = (up: boolean) =>
    `pointer-events-none absolute left-5 select-none transition-all duration-150 ${
      up
        ? "top-2.5 text-[11px] font-medium text-[#6B7280]"
        : "top-1/2 -translate-y-1/2 text-base text-[#9CA3AF]"
    }`;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Card — stacked on mobile, single row on desktop */}
      <div className="flex flex-col overflow-hidden rounded-xl border border-[#D1D5DB] bg-white shadow-sm lg:flex-row lg:items-center">

        {/* Job Title floating-label field */}
        <div className="relative min-w-0 flex-1">
          <label htmlFor="hero-search-keywords" className={labelClass(keywordUp)}>
            Job Title
          </label>
          <input
            id="hero-search-keywords"
            type="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => setKeywordFocused(true)}
            onBlur={() => setKeywordFocused(false)}
            className={FLOATING_INPUT_CLASS}
            aria-label="Job title"
          />
        </div>

        {/* Divider — horizontal on mobile, vertical on desktop */}
        <div className="h-px w-full bg-[#D1D5DB] lg:h-8 lg:w-px lg:shrink-0" aria-hidden="true" />

        {/* Location floating-label field */}
        <div className="relative min-w-0 flex-1">
          <label htmlFor="hero-search-location" className={labelClass(locationUp)}>
            Location
          </label>
          {mapsEnabled ? (
            <LocationSearch
              ref={locationRef}
              id="hero-search-location"
              initialLabel={location}
              onPlaceSelect={handlePlaceSelect}
              onFocus={() => setLocationFocused(true)}
              onBlur={(e: FocusEvent<HTMLInputElement>) => {
                setLocationFocused(false);
                setLocationValue(e.target.value);
              }}
              placeholder=""
              className={FLOATING_INPUT_CLASS}
            />
          ) : (
            <input
              ref={plainLocationRef}
              id="hero-search-location"
              type="text"
              defaultValue={location}
              onFocus={() => setLocationFocused(true)}
              onBlur={(e) => {
                setLocationFocused(false);
                setLocationValue(e.target.value);
              }}
              onChange={(e) => setLocationValue(e.target.value)}
              className={`${FLOATING_INPUT_CLASS} outline-none`}
              aria-label="Location"
            />
          )}
        </div>

        {/* Search button — inside the bar on desktop only */}
        <button
          type="submit"
          disabled={!canSearch}
          className="hidden lg:m-2 lg:inline-flex lg:h-[44px] lg:shrink-0 lg:items-center lg:justify-center lg:rounded-lg lg:px-8 lg:text-[15px] lg:font-bold lg:text-white lg:transition-all lg:disabled:cursor-not-allowed lg:disabled:opacity-40 lg:enabled:bg-[#0288d1] lg:enabled:hover:opacity-90 lg:disabled:bg-[#9CA3AF]"
        >
          Search
        </button>
      </div>

      {/* Search button — full-width below the card on mobile */}
      <button
        type="submit"
        disabled={!canSearch}
        className="mt-3 flex h-[50px] w-full items-center justify-center rounded-xl text-[15px] font-bold text-white transition-all disabled:cursor-not-allowed disabled:bg-[#9CA3AF] disabled:opacity-40 enabled:bg-[#0288d1] enabled:hover:opacity-90 lg:hidden"
      >
        Search Jobs
      </button>
    </form>
  );
}
