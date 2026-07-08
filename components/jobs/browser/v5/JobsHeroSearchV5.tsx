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
  useSyncExternalStore,
  type FocusEvent,
} from "react";

function subscribeNarrowHeroSearch(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia("(max-width: 1023px)");
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getNarrowHeroSearchSnapshot() {
  return window.matchMedia("(max-width: 1023px)").matches;
}

function getNarrowHeroSearchServerSnapshot() {
  return false;
}

function useNarrowHeroSearch() {
  return useSyncExternalStore(
    subscribeNarrowHeroSearch,
    getNarrowHeroSearchSnapshot,
    getNarrowHeroSearchServerSnapshot,
  );
}

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
  /** Desktop radius dropdown — hidden on homepage, shown on search results. */
  showRadiusSelect?: boolean;
  /** Centre refine pills row (homepage hero). */
  centreRefinePills?: boolean;
  /** Quick-filter pills — homepage only; results use filter dropdowns below. */
  showRefinePills?: boolean;
  /** Subtle lift on results page so the search card reads above the page. */
  elevated?: boolean;
  /** Homepage hero — white centred heading above the card (default: dark, left-aligned). */
  headingOutside?: boolean;
};

const INPUT_CLASS =
  "h-[52px] w-full border-0 bg-transparent pb-0.5 pl-4 pr-3 pt-[22px] text-[16px] text-[#1d1d1f] shadow-none outline-none placeholder:text-transparent focus-visible:ring-0 [&::-webkit-search-cancel-button]:hidden";

const MOBILE_INPUT_CLASS = `${INPUT_CLASS} max-lg:h-[56px]`;

const EMPTY_WORK_TYPES: JobWorkType[] = [];
const EMPTY_CONTRACT_TYPES: string[] = [];

function toggleValue<T extends string>(current: T[], value: T): T[] {
  return current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value];
}

const pillClass = (active: boolean) =>
  `shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
    active
      ? "bg-[#235A0E] text-white"
      : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#ececf0]"
  }`;

const zoneDividerClass = "border-t border-[#ececf0]";

/** V5 hero search — category, then location, then optional refine pills. */
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
  showRadiusSelect = true,
  centreRefinePills = false,
  showRefinePills = false,
  elevated = false,
  headingOutside = false,
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
  const [latestSelected, setLatestSelected] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<{
    label: string;
    lat: number;
    lng: number;
  } | null>(null);

  const hasGeoFromUrl = lat !== undefined && lng !== undefined;
  const isNarrow = useNarrowHeroSearch();

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
        workTypes: isNarrow ? [] : selectedWorkTypes,
        contractTypes: isNarrow ? [] : selectedContractTypes,
        location: {
          label: resolved.label,
          lat: resolved.latitude,
          lng: resolved.longitude,
        },
        radius: isNarrow || !showRadiusSelect ? undefined : radius,
      });
    },
    [
      setLocation,
      runSearch,
      selectedCategory,
      selectedWorkTypes,
      selectedContractTypes,
      radius,
      isNarrow,
      showRadiusSelect,
    ],
  );

  function buildSearchSubmit(): JobsHeroSearchSubmit {
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

    return {
      category: selectedCategory,
      workTypes: isNarrow ? [] : selectedWorkTypes,
      contractTypes: isNarrow ? [] : selectedContractTypes,
      location: { label: locationLabel, ...coords },
      radius: isNarrow || !showRadiusSelect ? undefined : radius,
    };
  }

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    runSearch(buildSearchSubmit());
  }

  const locationUp = locationFocused || locationValue.trim() !== "";

  const labelClass = (up: boolean) =>
    `pointer-events-none absolute left-4 select-none transition-all duration-200 ease-out ${
      up
        ? "top-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#86868b]"
        : "top-1/2 -translate-y-1/2 text-[16px] font-normal text-[#86868b]"
    }`;

  const refinePills = (
    <>
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
        aria-pressed={centreRefinePills ? latestSelected : undefined}
        onClick={() =>
          centreRefinePills
            ? setLatestSelected((current) => !current)
            : onBrowseLatest?.()
        }
        className={pillClass(centreRefinePills ? latestSelected : false)}
      >
        Latest
      </button>
    </>
  );

  const heading = (
    <p
      className={
        headingOutside
          ? "mb-1.5 text-center text-[15px] font-bold text-white sm:mb-2 sm:text-[16px]"
          : "mb-2 text-left text-[15px] font-semibold text-[#1d1d1f] sm:mb-2.5"
      }
    >
      Search Christian jobs
    </p>
  );

  return (
    <form onSubmit={handleSubmit} className={formClassName}>
      {heading}
      <div
        className={`w-full rounded-2xl bg-white ring-1 ring-black/[0.04] ${
          elevated
            ? "shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)]"
            : ""
        }`}
      >

        {/* 1 — Category + location (desktop: one row) */}
        <div className="p-2 sm:p-2.5">
          <div className="min-w-0 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-center lg:gap-3">
            <div className="min-w-0">
              <JobsCategoryCombobox
                id="v5-hero-category"
                categories={categories}
                value={selectedCategory}
                onChange={setSelectedCategory}
                fetchWhenEmpty
                fieldLabel="Category"
                inputClassName={`${MOBILE_INPUT_CLASS} pr-11`}
                labelClassName={labelClass}
              />
            </div>

            {/* Location — desktop: town/postcode with radius on the right; mobile: town only */}
            <div className="min-w-0 max-lg:border-t max-lg:border-[#ececf0] max-lg:pt-2 lg:flex lg:flex-row lg:items-center lg:gap-2 lg:border-0 lg:border-l lg:border-[#ececf0] lg:pl-3 lg:pt-0">
              <div className="relative flex min-w-0 flex-1 lg:items-center">
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
                      className={MOBILE_INPUT_CLASS}
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
                      className={`${MOBILE_INPUT_CLASS} outline-none`}
                      aria-label="Town or postcode"
                    />
                  )}
                </div>

                {showRadiusSelect ? (
                  <div className="hidden shrink-0 items-center self-center pl-2 lg:flex">
                    <JobsLocationRadiusSelect
                      radius={radius}
                      onChange={(nextRadius) => onRadiusChange?.(nextRadius)}
                      inline
                      compact
                      fullLabels
                      className="min-w-[9.5rem]"
                    />
                  </div>
                ) : null}
              </div>
            </div>

            <button
              type="submit"
              aria-label="Search jobs"
              className="hidden h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#235A0E] text-white transition-[transform,opacity] hover:opacity-90 active:scale-95 lg:flex"
            >
              <Search className="h-[18px] w-[18px]" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Search — mobile/tablet primary CTA */}
        <div className={`${zoneDividerClass} px-2 pb-2 pt-2 sm:px-2.5 lg:hidden`}>
          <button
            type="submit"
            aria-label="Search jobs"
            className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#235A0E] px-4 text-[15px] font-semibold text-white transition-[transform,opacity] hover:opacity-90 active:scale-95"
          >
            <Search className="h-[18px] w-[18px]" aria-hidden="true" />
            Search jobs
          </button>
        </div>

        {/* Refine filters — homepage desktop only */}
        {showRefinePills ? (
          <div className={`${zoneDividerClass} hidden p-2 sm:p-2.5 lg:block`}>
            <div
              className={`flex flex-wrap items-center gap-1.5 px-1 lg:px-0 ${
                centreRefinePills ? "justify-center" : ""
              }`}
              role="group"
              aria-label="Refine search"
            >
              {refinePills}
            </div>
          </div>
        ) : null}
      </div>
    </form>
  );
}
