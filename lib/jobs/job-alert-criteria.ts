import { cleanCategoryLabel } from "@lib/algolia/category-label";
import type { JobFacet } from "@lib/algolia/jobs";
import {
  CONTRACT_TYPE_OPTIONS,
  DATE_POSTED_OPTIONS,
  formatSalaryRangeLabel,
  hasActiveSalaryRange,
  ORGANISATION_TYPE_OPTIONS,
  WORK_TYPE_OPTIONS,
  formatLocationRadiusLabel,
  resolveLocationRadiusMeters,
  type JobsUrlState,
} from "@lib/jobs/search-params";

export type JobAlertCriteriaPill = {
  key: string;
  label: string;
  prefix?: string;
};

function labelFromFacet(facets: JobFacet[], value: string): string {
  const facetLabel = facets.find((facet) => facet.value === value)?.label;
  return cleanCategoryLabel(facetLabel) ?? facetLabel ?? value;
}

function labelFromOptions(
  options: readonly { label: string; value: string }[],
  value: string,
): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

function categoryLabel(
  category: string,
  facets: JobFacet[],
): string {
  return (
    cleanCategoryLabel(labelFromFacet(facets, category)) ??
    cleanCategoryLabel(category) ??
    category
  );
}

/** Read-only criteria pills for the zero-results job alert signup. */
export function buildJobAlertCriteriaPills(
  state: JobsUrlState,
  facets: {
    categories: JobFacet[];
    contractTypes: JobFacet[];
    organisationTypes: JobFacet[];
    denominations: JobFacet[];
  },
): JobAlertCriteriaPill[] {
  const pills: JobAlertCriteriaPill[] = [];

  if (state.q.trim()) {
    pills.push({
      key: "q",
      label: state.q.trim(),
      prefix: "Keyword",
    });
  }

  if (state.category) {
    pills.push({
      key: "category",
      label: categoryLabel(state.category, facets.categories),
    });
  }

  if (state.uncategorised) {
    pills.push({
      key: "uncategorised",
      label: "Uncategorised",
    });
  }

  if (state.location.trim()) {
    pills.push({
      key: "location",
      label: state.location.trim(),
    });
  }

  if (state.lat !== undefined && state.lng !== undefined) {
    pills.push({
      key: "radius",
      label: formatLocationRadiusLabel(
        resolveLocationRadiusMeters(state.radius),
      ),
    });
  }

  for (const value of state.workTypes) {
    pills.push({
      key: `workType-${value}`,
      label: labelFromOptions(WORK_TYPE_OPTIONS, value),
    });
  }

  for (const value of state.contractTypes) {
    pills.push({
      key: `contractType-${value}`,
      label:
        labelFromFacet(facets.contractTypes, value) ||
        labelFromOptions(CONTRACT_TYPE_OPTIONS, value),
    });
  }

  for (const value of state.organisationTypes) {
    pills.push({
      key: `organisationType-${value}`,
      label:
        labelFromFacet(facets.organisationTypes, value) ||
        labelFromOptions(ORGANISATION_TYPE_OPTIONS, value),
    });
  }

  for (const value of state.denominations) {
    pills.push({
      key: `denomination-${value}`,
      label: labelFromFacet(facets.denominations, value) || value,
    });
  }

  if (hasActiveSalaryRange(state)) {
    pills.push({
      key: "salary",
      label: formatSalaryRangeLabel(state.minSalary, state.maxSalary)!,
    });
  }

  if (state.datePosted !== "any") {
    pills.push({
      key: "datePosted",
      label: labelFromOptions(DATE_POSTED_OPTIONS, state.datePosted),
    });
  }

  return pills;
}
