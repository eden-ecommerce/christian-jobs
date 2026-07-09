"use client";

import {
  LocationSearch,
  type LocationSearchHandle,
} from "@components/google-maps/LocationSearch";
import { useUserLocation } from "@hooks/google-maps/use-user-location";
import { isGoogleMapsEnvConfigured } from "@lib/env-configured";
import { userLocationFromPlace } from "@lib/google-maps/location-labels";
import { Search, X } from "lucide-react";
import {
  useCallback,
  useRef,
  useState,
  type FocusEvent,
  type FormEvent,
} from "react";

export type JobsLocationSearchSubmit = {
  label: string;
  lat?: number;
  lng?: number;
};

type Props = {
  onSearch: (location: JobsLocationSearchSubmit) => void;
};

const INPUT_CLASS =
  "h-[52px] w-full border-0 bg-transparent px-4 text-[16px] text-[#1d1d1f] shadow-none outline-none placeholder:text-[#86868b] focus-visible:ring-0 [&::-webkit-search-cancel-button]:hidden";

/** Standalone town/postcode search for the v7 Location tab. */
export function JobsLocationSearchV7({ onSearch }: Props) {
  const mapsEnabled = isGoogleMapsEnvConfigured();
  const { setLocation } = useUserLocation();
  const locationRef = useRef<LocationSearchHandle>(null);
  const plainLocationRef = useRef<HTMLInputElement>(null);
  const [locationValue, setLocationValue] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<{
    label: string;
    lat: number;
    lng: number;
  } | null>(null);

  const resetLocationState = useCallback(() => {
    setLocationValue("");
    setSelectedPlace(null);
  }, []);

  const handleClearLocation = useCallback(() => {
    if (mapsEnabled) {
      locationRef.current?.clear();
      return;
    }
    if (plainLocationRef.current) {
      plainLocationRef.current.value = "";
    }
    resetLocationState();
  }, [mapsEnabled, resetLocationState]);

  const submitLocation = useCallback(
    (location: JobsLocationSearchSubmit) => {
      const label = location.label.trim();
      if (!label) return;
      onSearch({ ...location, label });
    },
    [onSearch],
  );

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
      setLocationValue(resolved.label);
      submitLocation({
        label: resolved.label,
        lat: resolved.latitude,
        lng: resolved.longitude,
      });
    },
    [setLocation, submitLocation],
  );

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const label =
      (
        mapsEnabled
          ? locationRef.current?.getValue()
          : plainLocationRef.current?.value
      )?.trim() ?? "";
    if (!label) return;

    if (selectedPlace?.label === label) {
      submitLocation(selectedPlace);
      return;
    }

    submitLocation({ label });
  }

  const showClear = locationValue.trim() !== "";

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-xl rounded-full bg-white p-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.06] sm:p-2"
    >
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className="relative min-w-0 flex-1">
          {mapsEnabled ? (
            <LocationSearch
              ref={locationRef}
              id="v7-hero-location"
              onPlaceSelect={handlePlaceSelect}
              onClear={resetLocationState}
              onBlur={(e: FocusEvent<HTMLInputElement>) => {
                setLocationValue(e.target.value);
              }}
              placeholder="Town or postcode"
              className={INPUT_CLASS}
            />
          ) : (
            <input
              ref={plainLocationRef}
              id="v7-hero-location"
              type="text"
              value={locationValue}
              onChange={(e) => {
                setLocationValue(e.target.value);
                setSelectedPlace(null);
              }}
              placeholder="Town or postcode"
              className={`${INPUT_CLASS}${showClear ? " pr-10" : ""}`}
              aria-label="Town or postcode"
            />
          )}
          {!mapsEnabled && showClear ? (
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={handleClearLocation}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-[#86868b] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]"
              aria-label="Clear location"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <button
          type="submit"
          aria-label="Search jobs by location"
          className="flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#235A0E] px-4 text-[15px] font-semibold text-white transition-[transform,opacity] hover:opacity-90 active:scale-95 sm:h-12 sm:px-5"
        >
          <Search className="h-[18px] w-[18px]" aria-hidden="true" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>
    </form>
  );
}
