"use client";

import { FilterBadgePrimitive } from "@components/ui/FilterBadgePrimitive";
import { DEFAULT_LOCATION_RADIUS_METERS } from "@lib/algolia/constants";
import { cleanCategoryLabel } from "@lib/algolia/category-label";
import type { JobFacet } from "@lib/algolia/jobs";
import {
  CONTRACT_TYPE_OPTIONS,
  DATE_POSTED_OPTIONS,
  formatLocationRadiusLabel,
  formatSalaryRangeLabel,
  hasActiveJobSearch,
  hasActiveSalaryRange,
  ORGANISATION_TYPE_OPTIONS,
  WORK_TYPE_OPTIONS,
  type JobsUrlState,
} from "@lib/jobs/search-params";
import { useMemo } from "react";

type Badge = {
  key: string;
  label: string;
  prefix?: string;
  onRemove: () => void;
};

type Props = {
  state: JobsUrlState;
  facets: {
    categories: JobFacet[];
    contractTypes: JobFacet[];
    organisationTypes: JobFacet[];
    denominations: JobFacet[];
  };
  onChange: (changes: Partial<JobsUrlState>) => void;
  onClearAll: () => void;
};

function labelFromFacet(facets: JobFacet[], value: string): string {
  return facets.find((f) => f.value === value)?.label ?? value;
}

function labelFromOptions(
  options: readonly { label: string; value: string }[],
  value: string,
): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

/** Removable chips for active job filters, shown above the results list. */
export function JobsActiveFilterBadges({
  state,
  facets,
  onChange,
  onClearAll,
}: Props) {
  const badges = useMemo(() => {
    const items: Badge[] = [];

    if (state.location.trim()) {
      const hasGeo = state.lat !== undefined && state.lng !== undefined;
      const radiusLabel = hasGeo
        ? formatLocationRadiusLabel(state.radius ?? DEFAULT_LOCATION_RADIUS_METERS)
        : undefined;
      items.push({
        key: "location",
        prefix: "Near",
        label: radiusLabel
          ? `${state.location} (${radiusLabel})`
          : state.location,
        onRemove: () =>
          onChange({
            location: "",
            lat: undefined,
            lng: undefined,
            place: undefined,
            radius: undefined,
            page: 0,
          }),
      });
    }

    if (state.category) {
      const label =
        labelFromFacet(facets.categories, state.category) ||
        cleanCategoryLabel(state.category) ||
        state.category;
      items.push({
        key: "category",
        label,
        onRemove: () => onChange({ category: undefined, page: 0 }),
      });
    }

    for (const value of state.contractTypes) {
      items.push({
        key: `contractType-${value}`,
        label: labelFromFacet(facets.contractTypes, value) ||
          labelFromOptions(CONTRACT_TYPE_OPTIONS, value),
        onRemove: () =>
          onChange({
            contractTypes: state.contractTypes.filter((v) => v !== value),
            page: 0,
          }),
      });
    }

    for (const value of state.organisationTypes) {
      items.push({
        key: `organisationType-${value}`,
        label: labelFromFacet(facets.organisationTypes, value) ||
          labelFromOptions(ORGANISATION_TYPE_OPTIONS, value),
        onRemove: () =>
          onChange({
            organisationTypes: state.organisationTypes.filter((v) => v !== value),
            page: 0,
          }),
      });
    }

    for (const value of state.workTypes) {
      items.push({
        key: `workType-${value}`,
        label: labelFromOptions(WORK_TYPE_OPTIONS, value),
        onRemove: () =>
          onChange({
            workTypes: state.workTypes.filter((item) => item !== value),
            page: 0,
          }),
      });
    }

    for (const value of state.denominations) {
      items.push({
        key: `denomination-${value}`,
        label: labelFromFacet(facets.denominations, value) || value,
        onRemove: () =>
          onChange({
            denominations: state.denominations.filter((v) => v !== value),
            page: 0,
          }),
      });
    }

    if (hasActiveSalaryRange(state)) {
      const salaryLabel = formatSalaryRangeLabel(state.minSalary, state.maxSalary)!;
      items.push({
        key: "salary",
        label: salaryLabel,
        onRemove: () =>
          onChange({ minSalary: undefined, maxSalary: undefined, page: 0 }),
      });
    }

    if (state.datePosted !== "any") {
      items.push({
        key: "datePosted",
        label: labelFromOptions(DATE_POSTED_OPTIONS, state.datePosted),
        onRemove: () => onChange({ datePosted: "any", page: 0 }),
      });
    }

    return items;
  }, [state, facets, onChange]);

  if (badges.length === 0 && !hasActiveJobSearch(state)) return null;

  const showClearSearch = hasActiveJobSearch(state);

  return (
    <div className="flex flex-wrap items-center gap-2 px-1 pb-3">
      {badges.map((badge) => (
        <FilterBadgePrimitive
          key={badge.key}
          prefix={badge.prefix}
          label={badge.label}
          onRemove={badge.onRemove}
        />
      ))}
      {showClearSearch ? (
        <button
          type="button"
          onClick={onClearAll}
          className="cursor-pointer text-xs font-medium text-[#2d6a4f] underline-offset-2 hover:underline"
        >
          Clear search
        </button>
      ) : null}
    </div>
  );
}
