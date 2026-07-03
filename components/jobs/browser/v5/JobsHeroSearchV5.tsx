"use client";

import { JobsCategoryCombobox } from "@components/jobs/browser/JobsCategoryCombobox";
import { JobsLocationRadiusSelect } from "@components/jobs/browser/JobsLocationRadiusSelect";
import {
  LocationSearch,
  type LocationSearchHandle,
} from "@components/google-maps/LocationSearch";
import { useRecentJobSearches } from "@hooks/jobs/use-recent-job-searches";
import { useUserLocation } from "@hooks/google-maps/use-user-location";
import type { JobFacet } from "@lib/algolia/jobs";
import { isGoogleMapsEnvConfigured } from "@lib/env-configured";
import { userLocationFromPlace } from "@lib/google-maps/location-labels";
import {
  HERO_CONTRACT_TYPE_OPTIONS,
  HERO_WORK_TYPE_OPTIONS,
  type JobWorkType,
  type JobsHeroSearchSubmit,
} from "@lib/jobs/search-params";
import { Search } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
} from "react";

type Props = {
  category?: string;
  workTypes?: JobWorkType[];
  contractTypes?: string[];
  location: string;
  lat?: number;
  lng?: number;
  radius?: number;
  categories?: JobFacet[];
  formClassName?: string;
  onSearch: (values: JobsHeroSearchSubmit) => void;
  onBrowseLatest?: () => void;
  onRadiusChange?: (radius: number | undefined) => void;
};

const INPUT_CLASS =
  "h-[52px] w-full border-0 bg-transparent pb-0.5 pl-4 pr-3 pt-[22px] text-[16px] text-[#1d1d1f] shadow-none outline-none placeholder:text-transparent focus-visible:ring-0 [&::-webkit-search-cancel-button]:hidden";

const EMPTY_WORK_TYPES: JobWorkType[] = [];
const EMPTY_CONTRACT_TYPES: string[] = [];

function toggleValue<T extends string>(current: T[], value: T): T[] {
  return current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value];
}

const pillClass = (active: boolean) =>
  `rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
    active
      ? "bg-[#235A0E] text-white"
      : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#ececf0]"
  }`;

/** V5 hero search — category + location on top row; work and contract pills below. */
export function JobsHeroSearchV5({
  category,
  workTypes,
  contractTypes,
  location,
  lat,
  lng,
  radius,
  categories = [],
  formClassName = "w-full",
  onSearch,
  onBrowseLatest,
  onRadiusChange,
}: Props) {
  const mapsEnabled = isGoogleMapsEnvConfigured();
  const { setLocation } = useUserLocation();
  const { addRecent } = useRecentJobSearches();
  const locationRef = useRef<LocationSearchHandle>(null);
  const plainLocationRef = useRef<HTMLInputElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    category,
  );
  const resolvedWorkTypes = workTypes ?? EMPTY_WORK_TYPES;
  const resolvedContractTypes = contractTypes ?? EMPTY_CONTRACT_TYPES;
  const [selectedWorkTypes, setSelectedWorkTypes] =
    useState<JobWorkType[]>(resolvedWorkTypes);
  const [selectedContractTypes, setSelectedContractTypes] = useState<string[]>(
    resolvedContractTypes,
  );
  const [locationValue, setLocationValue] = useState(location);
  const [locationFocused, setLocationFocused] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<{
    label: string;
    lat: number;
    lng: number;
  } | null>(null);

  const hasGeoFromUrl = lat !== undefined && lng !== undefined;

  useEffect(() => {
    setSelectedCategory(category);
    setSelectedWorkTypes(resolvedWorkTypes);
    setSelectedContractTypes(resolvedContractTypes);
    setLocationValue(location);
    setSelectedPlace(null);
  }, [category, resolvedWorkTypes, resolvedContractTypes, location]);

  useEffect(() => {
    if (!mapsEnabled && plainLocationRef.current) {
      plainLocationRef.current.value = location;
    }
  }, [location, mapsEnabled]);

  const runSearch = useCallback(
    (values: JobsHeroSearchSubmit) => {
      setSelectedCategory(values.category);
      setSelectedWorkTypes(values.workTypes);
      setSelectedContractTypes(values.contractTypes ?? []);
      if (
        values.location.lat !== undefined &&
        values.location.lng !== undefined
      ) {
        setSelectedPlace({
          label: values.location.label,
          lat: values.location.lat,
          lng: values.location.lng,
        });
      } else {
        setSelectedPlace(null);
      }
      addRecent({
        query: values.category ?? "",
        location: values.location.label,
      });
      onSearch(values);
    },
    [addRecent, onSearch],
  );

  const handlePlaceSelect = useCallback(
    (place: google.maps.places.PlaceResult) => {
      const resolved = userLocationFromPlace(place);
      if (!resolved) return;
      setLocation(resolved);
      runSearch({
        category: selectedCategory,
        workTypes: selectedWorkTypes,
        contractTypes: selectedContractTypes,
        location: {
          label: resolved.label,
          lat: resolved.latitude,
          lng: resolved.longitude,
        },
        radius,
      });
    },
    [
      setLocation,
      runSearch,
      selectedCategory,
      selectedWorkTypes,
      selectedContractTypes,
      radius,
    ],
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
    runSearch({
      category: selectedCategory,
      workTypes: selectedWorkTypes,
      contractTypes: selectedContractTypes,
      location: { label: locationLabel, ...coords },
      radius,
    });
  }

  const locationUp = locationFocused || locationValue.trim() !== "";

  const labelClass = (up: boolean) =>
    `pointer-events-none absolute left-4 select-none transition-all duration-200 ease-out ${
      up
        ? "top-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#86868b]"
        : "top-1/2 -translate-y-1/2 text-[16px] font-normal text-[#86868b]"
    }`;

  return (
    <form onSubmit={handleSubmit} className={formClassName}>
      <div className="w-full rounded-2xl bg-white ring-1 ring-black/[0.04]">
        <div className="flex flex-col gap-2 p-2 sm:p-2.5 lg:flex-row lg:items-center lg:gap-3">
          <div className="min-w-0 flex-1 basis-0">
            <JobsCategoryCombobox
              id="v5-hero-category"
              categories={categories}
              value={selectedCategory}
              onChange={setSelectedCategory}
              fetchWhenEmpty
              inputClassName={`${INPUT_CLASS} pr-10`}
              labelClassName={labelClass}
            />
          </div>

          <div
            className="hidden h-7 w-px shrink-0 bg-[#d2d2d7] lg:block"
            aria-hidden="true"
          />

          <div className="flex min-w-0 flex-1 basis-0 items-center gap-2">
            <div className="flex shrink-0 items-center gap-2 pl-1 sm:pl-0">
              <span className="text-[13px] font-medium text-[#86868b]">
                Within
              </span>
              <JobsLocationRadiusSelect
                radius={radius}
                onChange={(nextRadius) => onRadiusChange?.(nextRadius)}
                inline
                compact
                className="min-w-[5.5rem]"
              />
              <span className="text-[13px] font-medium text-[#86868b]">of</span>
            </div>

            <div className="relative min-w-0 flex-1">
              <label
                htmlFor="v5-hero-location"
                className={labelClass(locationUp)}
              >
                Town or postcode
              </label>
              {mapsEnabled ? (
                <LocationSearch
                  ref={locationRef}
                  id="v5-hero-location"
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
                  id="v5-hero-location"
                  type="text"
                  defaultValue={location}
                  onFocus={() => setLocationFocused(true)}
                  onBlur={(e) => {
                    setLocationFocused(false);
                    setLocationValue(e.target.value);
                  }}
                  onChange={(e) => setLocationValue(e.target.value)}
                  className={`${INPUT_CLASS} outline-none`}
                  aria-label="Town or postcode"
                />
              )}
            </div>

            <button
              type="submit"
              aria-label="Search jobs"
              className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#235A0E] text-white transition-[transform,opacity] hover:opacity-90 active:scale-95 lg:flex"
            >
              <Search className="h-[18px] w-[18px]" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mx-2.5 border-t border-[#ececf0] sm:mx-3" />

        <div className="flex flex-col gap-2 p-2 sm:flex-row sm:items-center sm:justify-between sm:p-2.5">
          <div className="flex flex-wrap items-center gap-1.5 px-1 sm:px-0">
            <div role="group" aria-label="Work type" className="flex flex-wrap gap-1.5">
              {HERO_WORK_TYPE_OPTIONS.map((option) => {
                const active = selectedWorkTypes.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      setSelectedWorkTypes((current) =>
                        toggleValue(current, option.value),
                      )
                    }
                    className={pillClass(active)}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <div
              className="hidden h-5 w-px shrink-0 bg-[#d2d2d7] sm:block"
              aria-hidden="true"
            />

            <div
              role="group"
              aria-label="Contract type and shortcuts"
              className="flex flex-wrap gap-1.5"
            >
              {HERO_CONTRACT_TYPE_OPTIONS.map((option) => {
                const active = selectedContractTypes.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      setSelectedContractTypes((current) =>
                        toggleValue(current, option.value),
                      )
                    }
                    className={pillClass(active)}
                  >
                    {option.label}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => onBrowseLatest?.()}
                className={pillClass(false)}
              >
                Latest
              </button>
            </div>
          </div>

          <button
            type="submit"
            aria-label="Search jobs"
            className="flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#235A0E] px-4 text-[15px] font-semibold text-white transition-[transform,opacity] hover:opacity-90 active:scale-95 sm:w-auto lg:hidden"
          >
            <Search className="h-[18px] w-[18px]" aria-hidden="true" />
            Search
          </button>
        </div>
      </div>
    </form>
  );
}
