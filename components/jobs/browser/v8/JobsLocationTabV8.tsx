"use client";

import { JobsLocationRadiusSelect } from "@components/jobs/browser/JobsLocationRadiusSelect";
import {
  LocationSearch,
  type LocationSearchHandle,
} from "@components/google-maps/LocationSearch";
import { useUserLocation } from "@hooks/google-maps/use-user-location";
import { isGoogleMapsEnvConfigured } from "@lib/env-configured";
import { userLocationFromPlace } from "@lib/google-maps/location-labels";
import {
  HERO_WORK_TYPE_OPTIONS,
  type JobWorkType,
} from "@lib/jobs/search-params";
import { Search, X } from "lucide-react";
import {
  useCallback,
  useRef,
  useState,
  type FocusEvent,
  type FormEvent,
} from "react";

export type JobsLocationTabSubmit = {
  /** Empty when Remote-only (no location fields). */
  label: string;
  lat?: number;
  lng?: number;
  radius?: number;
  workTypes: JobWorkType[];
};

type Props = {
  resultsPath: string;
  onSearch: (values: JobsLocationTabSubmit) => void;
};

const INPUT_CLASS =
  "h-[52px] w-full border-0 bg-transparent px-4 text-[16px] text-[#1d1d1f] shadow-none outline-none placeholder:text-[#86868b] focus-visible:ring-0 [&::-webkit-search-cancel-button]:hidden";

const workTypeChipClass = (active: boolean) =>
  `inline-flex min-h-11 items-center rounded-full px-3.5 py-2.5 text-[14px] font-semibold transition-[transform,background-color,box-shadow,color] active:scale-[0.98] sm:min-h-10 sm:px-4 sm:text-[15px] ${
    active
      ? "bg-[#E8F0E4] text-[#235A0E] shadow-[0_2px_8px_rgba(0,0,0,0.08)] ring-1 ring-[#235A0E]/35"
      : "bg-white text-[#1d1d1f] shadow-[0_2px_8px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.06] hover:bg-[#f5f5f7] hover:shadow-[0_4px_12px_rgba(0,0,0,0.16)]"
  }`;

function toggleWorkType(
  current: JobWorkType[],
  value: JobWorkType,
): JobWorkType[] {
  return current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value];
}

/**
 * Location tab — multi-select Work Type chips + optional town/radius.
 * Search only navigates on the Search button (or place autocomplete select).
 */
export function JobsLocationTabV8({
  resultsPath: _resultsPath,
  onSearch,
}: Props) {
  const mapsEnabled = isGoogleMapsEnvConfigured();
  const { setLocation } = useUserLocation();
  const locationRef = useRef<LocationSearchHandle>(null);
  const plainLocationRef = useRef<HTMLInputElement>(null);

  const [selectedWorkTypes, setSelectedWorkTypes] = useState<JobWorkType[]>([]);
  const [locationValue, setLocationValue] = useState("");
  const [radius, setRadius] = useState<number | undefined>(undefined);
  const [selectedPlace, setSelectedPlace] = useState<{
    label: string;
    lat: number;
    lng: number;
  } | null>(null);

  const isRemoteOnly =
    selectedWorkTypes.length === 1 && selectedWorkTypes[0] === "remote";
  /** Hide location only for Remote-only; show for none or any Hybrid/Onsite. */
  const needsLocationFields = !isRemoteOnly;

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

  const submitSearch = useCallback(
    (location?: { label: string; lat?: number; lng?: number }) => {
      if (isRemoteOnly) {
        onSearch({
          label: "",
          workTypes: selectedWorkTypes,
        });
        return;
      }

      const label = location?.label.trim() ?? "";
      if (!label) return;

      onSearch({
        label,
        lat: location?.lat,
        lng: location?.lng,
        radius,
        workTypes: selectedWorkTypes,
      });
    },
    [isRemoteOnly, onSearch, radius, selectedWorkTypes],
  );

  const handleWorkTypeToggle = useCallback((workType: JobWorkType) => {
    setSelectedWorkTypes((current) => toggleWorkType(current, workType));
  }, []);

  const handlePlaceSelect = useCallback(
    (place: google.maps.places.PlaceResult) => {
      const resolved = userLocationFromPlace(place);
      if (!resolved) return;
      setLocation(resolved);
      const next = {
        label: resolved.label,
        lat: resolved.latitude,
        lng: resolved.longitude,
      };
      setSelectedPlace(next);
      setLocationValue(resolved.label);
      submitSearch(next);
    },
    [setLocation, submitSearch],
  );

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (isRemoteOnly) {
      submitSearch();
      return;
    }

    const label =
      (
        mapsEnabled
          ? locationRef.current?.getValue()
          : plainLocationRef.current?.value
      )?.trim() ?? "";
    if (!label) return;

    if (selectedPlace?.label === label) {
      submitSearch(selectedPlace);
      return;
    }

    submitSearch({ label });
  }

  const showClear = locationValue.trim() !== "";

  return (
    <div className="mx-auto w-full max-w-xl">
      <div
        role="group"
        aria-label="Work type"
        className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5"
      >
        {HERO_WORK_TYPE_OPTIONS.map((option) => {
          const active = selectedWorkTypes.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => handleWorkTypeToggle(option.value)}
              className={workTypeChipClass(active)}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="mt-5 sm:mt-6">
        {/* Collapses when Remote is the only selection */}
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
            needsLocationFields
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div
              className="rounded-2xl bg-white p-2 shadow-[0_2px_8px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.06] sm:p-2.5"
              aria-hidden={!needsLocationFields}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
                <div className="relative min-w-0 flex-1">
                  {mapsEnabled ? (
                    <LocationSearch
                      ref={locationRef}
                      id="v8-hero-location"
                      onPlaceSelect={handlePlaceSelect}
                      onClear={resetLocationState}
                      onBlur={(e: FocusEvent<HTMLInputElement>) => {
                        setLocationValue(e.target.value);
                      }}
                      placeholder="Town or postcode"
                      className={INPUT_CLASS}
                      disabled={!needsLocationFields}
                    />
                  ) : (
                    <input
                      ref={plainLocationRef}
                      id="v8-hero-location"
                      type="text"
                      value={locationValue}
                      disabled={!needsLocationFields}
                      onChange={(e) => {
                        setLocationValue(e.target.value);
                        setSelectedPlace(null);
                      }}
                      placeholder="Town or postcode"
                      className={`${INPUT_CLASS}${showClear ? " pr-10" : ""}`}
                      aria-label="Town or postcode"
                    />
                  )}
                  {!mapsEnabled && showClear && needsLocationFields ? (
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

                <div className="flex items-center gap-3 px-0.5 sm:px-0">
                  <JobsLocationRadiusSelect
                    radius={radius}
                    onChange={setRadius}
                    inline
                    compact
                    fullLabels
                    className="min-w-[10.5rem] flex-1 sm:flex-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`flex justify-center ${
            needsLocationFields ? "mt-3 sm:mt-4" : "mt-0"
          }`}
        >
          <button
            type="submit"
            aria-label="Search jobs"
            className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#235A0E] px-6 text-[15px] font-semibold text-white transition-[transform,opacity] hover:opacity-90 active:scale-95 sm:h-12 sm:px-7"
          >
            <Search className="h-[18px] w-[18px]" aria-hidden="true" />
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
