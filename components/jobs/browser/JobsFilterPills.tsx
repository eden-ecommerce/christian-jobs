"use client";

import { FilterOption, FilterPopover } from "@components/jobs/browser/FilterPopover";
import type { JobFacet } from "@lib/algolia/jobs";
import { DEFAULT_LOCATION_RADIUS_METERS } from "@lib/algolia/constants";
import { X } from "lucide-react";
import {
  CONTRACT_TYPE_OPTIONS,
  DATE_POSTED_OPTIONS,
  hasActiveJobSearch,
  LOCATION_RADIUS_OPTIONS,
  ORGANISATION_TYPE_OPTIONS,
  resolveLocationRadiusMeters,
  SALARY_OPTIONS,
  SORT_OPTIONS,
  WORK_TYPE_OPTIONS,
  type DatePosted,
  type JobWorkType,
  type JobsUrlState,
} from "@lib/jobs/search-params";
import type { JobSort } from "@lib/algolia/jobs";

type Props = {
  state: JobsUrlState;
  facets: {
    contractTypes: JobFacet[];
    organisationTypes: JobFacet[];
    denominations: JobFacet[];
    categories: JobFacet[];
  };
  onChange: (changes: Partial<JobsUrlState>) => void;
  onClearAll: () => void;
  compact?: boolean;
};

export function JobsFilterPills({
  state,
  facets,
  onChange,
  onClearAll,
  compact = false,
}: Props) {
  const hasActive = hasActiveJobSearch(state);
  const hasGeo = state.lat !== undefined && state.lng !== undefined;
  const activeRadiusMeters = resolveLocationRadiusMeters(state.radius);
  const radiusLabel =
    LOCATION_RADIUS_OPTIONS.find((option) => option.value === activeRadiusMeters)
      ?.label ?? "Within 25 miles";

  const contractOptions =
    facets.contractTypes.length > 0
      ? facets.contractTypes
      : CONTRACT_TYPE_OPTIONS.map((o) => ({ ...o, count: 0 }));

  const orgOptions =
    facets.organisationTypes.length > 0
      ? facets.organisationTypes
      : ORGANISATION_TYPE_OPTIONS.map((o) => ({ ...o, count: 0 }));

  const denominationOptions = facets.denominations;

  function toggleArrayValue(values: string[], value: string): string[] {
    return values.includes(value)
      ? values.filter((v) => v !== value)
      : [...values, value];
  }

  const fadeGradientClass = compact
    ? "bg-gradient-to-r from-transparent via-white/70 to-white"
    : "bg-gradient-to-r from-transparent via-background/70 to-background";
  const clearBackdropClass = compact ? "bg-white" : "bg-background";

  return (
    <div className={compact ? undefined : "border-b border-border bg-background"}>
      <div className={compact ? "py-1" : "mx-auto max-w-[1600px] px-4 py-2 sm:px-6"}>
        <div className="relative min-w-0 w-full">
          <div
            className={`flex w-full items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden${
              hasActive ? " pr-44" : ""
            }`}
          >
          <FilterPopover
            label={radiusLabel}
            active={state.radius !== undefined || hasGeo}
            activeCount={state.radius !== undefined || hasGeo ? 1 : undefined}
          >
            <div className="flex flex-col">
              {LOCATION_RADIUS_OPTIONS.map((option) => (
                <FilterOption
                  key={option.value}
                  type="radio"
                  name="radius"
                  label={option.label}
                  checked={activeRadiusMeters === option.value}
                  onChange={() =>
                    onChange({
                      radius:
                        option.value === DEFAULT_LOCATION_RADIUS_METERS
                          ? undefined
                          : option.value,
                      page: 0,
                      sort:
                        hasGeo && state.lat !== undefined
                          ? "distance"
                          : state.sort,
                    })
                  }
                />
              ))}
            </div>
          </FilterPopover>

          <FilterPopover
            label="Salary"
            active={!!state.minSalary}
            activeCount={state.minSalary ? 1 : undefined}
          >
            <div className="flex flex-col">
              {SALARY_OPTIONS.map((opt) => (
                <FilterOption
                  key={opt.value || "any"}
                  type="radio"
                  name="salary"
                  label={opt.label}
                  checked={
                    opt.value
                      ? String(state.minSalary) === opt.value
                      : !state.minSalary
                  }
                  onChange={() =>
                    onChange({
                      minSalary: opt.value ? Number(opt.value) : undefined,
                      page: 0,
                    })
                  }
                />
              ))}
            </div>
          </FilterPopover>

          <FilterPopover
            label="Contract Type"
            active={state.contractTypes.length > 0}
            activeCount={state.contractTypes.length}
          >
            <div className="flex max-h-64 flex-col overflow-y-auto">
              {contractOptions.map((opt) => (
                <FilterOption
                  key={opt.value}
                  type="checkbox"
                  name="contractType"
                  label={`${opt.label}${opt.count ? ` (${opt.count})` : ""}`}
                  checked={state.contractTypes.includes(opt.value)}
                  onChange={() =>
                    onChange({
                      contractTypes: toggleArrayValue(
                        state.contractTypes,
                        opt.value,
                      ),
                      page: 0,
                    })
                  }
                />
              ))}
            </div>
          </FilterPopover>

          <FilterPopover
            label="Organisation Type"
            active={state.organisationTypes.length > 0}
            activeCount={state.organisationTypes.length}
          >
            <div className="flex max-h-64 flex-col overflow-y-auto">
              {orgOptions.map((opt) => (
                <FilterOption
                  key={opt.value}
                  type="checkbox"
                  name="organisationType"
                  label={`${opt.label}${opt.count ? ` (${opt.count})` : ""}`}
                  checked={state.organisationTypes.includes(opt.value)}
                  onChange={() =>
                    onChange({
                      organisationTypes: toggleArrayValue(
                        state.organisationTypes,
                        opt.value,
                      ),
                      page: 0,
                    })
                  }
                />
              ))}
            </div>
          </FilterPopover>

          <FilterPopover
            label="Work Type"
            active={state.workTypes.length > 0}
            activeCount={state.workTypes.length}
          >
            <div className="flex flex-col">
              {WORK_TYPE_OPTIONS.filter((opt) => opt.value !== "any").map(
                (opt) => (
                  <FilterOption
                    key={opt.value}
                    type="checkbox"
                    name="workType"
                    label={opt.label}
                    checked={state.workTypes.includes(opt.value as JobWorkType)}
                    onChange={() =>
                      onChange({
                        workTypes: toggleArrayValue(
                          state.workTypes,
                          opt.value,
                        ) as JobWorkType[],
                        page: 0,
                      })
                    }
                  />
                ),
              )}
            </div>
          </FilterPopover>

          {denominationOptions.length > 0 ? (
            <FilterPopover
              label="Denomination"
              active={state.denominations.length > 0}
              activeCount={state.denominations.length}
            >
              <div className="flex max-h-64 flex-col overflow-y-auto">
                {denominationOptions.map((opt) => (
                  <FilterOption
                    key={opt.value}
                    type="checkbox"
                    name="denomination"
                    label={`${opt.label}${opt.count ? ` (${opt.count})` : ""}`}
                    checked={state.denominations.includes(opt.value)}
                    onChange={() =>
                      onChange({
                        denominations: toggleArrayValue(
                          state.denominations,
                          opt.value,
                        ),
                        page: 0,
                      })
                    }
                  />
                ))}
              </div>
            </FilterPopover>
          ) : null}

          <FilterPopover
            label="Date Posted"
            active={state.datePosted !== "any"}
            activeCount={state.datePosted !== "any" ? 1 : undefined}
          >
            <div className="flex flex-col">
              {DATE_POSTED_OPTIONS.map((opt) => (
                <FilterOption
                  key={opt.value}
                  type="radio"
                  name="datePosted"
                  label={opt.label}
                  checked={state.datePosted === opt.value}
                  onChange={() =>
                    onChange({
                      datePosted: opt.value as DatePosted,
                      page: 0,
                    })
                  }
                />
              ))}
            </div>
          </FilterPopover>

          <FilterPopover
            label="Sort By"
            active={state.sort === "relevance"}
          >
            <div className="flex flex-col">
              {SORT_OPTIONS.map((opt) => (
                <FilterOption
                  key={opt.value}
                  type="radio"
                  name="sort"
                  label={opt.label}
                  checked={state.sort === opt.value}
                  onChange={() =>
                    onChange({
                      sort: opt.value as JobSort,
                      page: 0,
                    })
                  }
                />
              ))}
            </div>
          </FilterPopover>
          </div>

          {hasActive ? (
            <div className="absolute inset-y-0 right-0 z-[2] flex items-stretch pointer-events-none">
              <div
                className={`w-16 shrink-0 ${fadeGradientClass}`}
                aria-hidden="true"
              />
              <div
                className={`flex items-center pl-2 pointer-events-auto ${clearBackdropClass}`}
              >
                <button
                  type="button"
                  onClick={onClearAll}
                  className={
                    compact
                      ? "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#2d6a4f]/35 bg-[#2d6a4f]/[0.07] px-3 py-1.5 text-sm font-medium text-[#2d6a4f] transition-colors hover:border-[#2d6a4f]/55 hover:bg-[#2d6a4f]/10"
                      : "inline-flex items-center gap-1.5 text-sm font-medium text-[#2d6a4f] hover:underline"
                  }
                >
                  <X className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  Clear search
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
