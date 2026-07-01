"use client";

import {
  LocationSearch,
  type LocationSearchHandle,
} from "@components/google-maps/LocationSearch";
import { useRecentJobSearches } from "@hooks/jobs/use-recent-job-searches";
import { useUserLocation } from "@hooks/google-maps/use-user-location";
import { isGoogleMapsEnvConfigured } from "@lib/env-configured";
import { userLocationFromPlace } from "@lib/google-maps/location-labels";
import { Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type FocusEvent } from "react";

type Props = {
  query: string;
  location: string;
  lat?: number;
  lng?: number;
  formClassName?: string;
  onSearch: (
    query: string,
    location: { label: string; lat?: number; lng?: number },
  ) => void;
};

const INPUT_CLASS =
  "h-[52px] w-full border-0 bg-transparent pb-0.5 pl-4 pr-3 pt-[22px] text-[16px] text-[#1d1d1f] shadow-none outline-none placeholder:text-transparent focus-visible:ring-0 [&::-webkit-search-cancel-button]:hidden";

/** Minimal floating-label search — unified pill for the v3 homepage. */
export function JobsHeroSearchV3({
  query,
  location,
  lat,
  lng,
  formClassName = "w-full",
  onSearch,
}: Props) {
  const mapsEnabled = isGoogleMapsEnvConfigured();
  const { setLocation } = useUserLocation();
  const { addRecent } = useRecentJobSearches();
  const locationRef = useRef<LocationSearchHandle>(null);
  const plainLocationRef = useRef<HTMLInputElement>(null);
  const [keyword, setKeyword] = useState(query);
  const [locationValue, setLocationValue] = useState(location);
  const [keywordFocused, setKeywordFocused] = useState(false);
  const [locationFocused, setLocationFocused] = useState(false);
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

  const keywordUp = keywordFocused || keyword.trim() !== "";
  const locationUp = locationFocused || locationValue.trim() !== "";
  const canSearch = keyword.trim() !== "" || locationValue.trim() !== "";

  const labelClass = (up: boolean) =>
    `pointer-events-none absolute left-4 select-none transition-all duration-200 ease-out ${
      up
        ? "top-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#86868b]"
        : "top-1/2 -translate-y-1/2 text-[16px] font-normal text-[#86868b]"
    }`;

  return (
    <form onSubmit={handleSubmit} className={formClassName}>
      <div className="flex w-full items-center rounded-2xl bg-white shadow-[0_4px_32px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.04]">
        <div className="relative min-w-0 flex-1">
          <label htmlFor="v3-hero-keywords" className={labelClass(keywordUp)}>
            Job title
          </label>
          <input
            id="v3-hero-keywords"
            type="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => setKeywordFocused(true)}
            onBlur={() => setKeywordFocused(false)}
            className={INPUT_CLASS}
            aria-label="Job title"
          />
        </div>

        <div
          className="mx-0 h-7 w-px shrink-0 bg-[#d2d2d7]"
          aria-hidden="true"
        />

        <div className="relative min-w-0 flex-1">
          <label htmlFor="v3-hero-location" className={labelClass(locationUp)}>
            Location
          </label>
          {mapsEnabled ? (
            <LocationSearch
              ref={locationRef}
              id="v3-hero-location"
              initialLabel={location}
              onPlaceSelect={handlePlaceSelect}
              onFocus={() => setLocationFocused(true)}
              onBlur={(e: FocusEvent<HTMLInputElement>) => {
                setLocationFocused(false);
                setLocationValue(e.target.value);
              }}
              placeholder=""
              className={INPUT_CLASS}
            />
          ) : (
            <input
              ref={plainLocationRef}
              id="v3-hero-location"
              type="text"
              defaultValue={location}
              onFocus={() => setLocationFocused(true)}
              onBlur={(e) => {
                setLocationFocused(false);
                setLocationValue(e.target.value);
              }}
              onChange={(e) => setLocationValue(e.target.value)}
              className={`${INPUT_CLASS} outline-none`}
              aria-label="Location"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={!canSearch}
          aria-label="Search jobs"
          className="mr-1.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#235A0E] text-white transition-[transform,opacity] hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <Search className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
