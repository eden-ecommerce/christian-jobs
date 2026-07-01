"use client";

import { FilterOption, FilterPopover } from "@components/jobs/browser/FilterPopover";
import type { JobFacet } from "@lib/algolia/jobs";
import {
  CONTRACT_TYPE_OPTIONS,
  DATE_POSTED_OPTIONS,
  ORGANISATION_TYPE_OPTIONS,
  SALARY_OPTIONS,
  SORT_OPTIONS,
  WORK_TYPE_OPTIONS,
  type DatePosted,
  type JobsUrlState,
  type WorkType,
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
  const hasActive =
    state.contractTypes.length > 0 ||
    state.organisationTypes.length > 0 ||
    state.workType !== "any" ||
    state.denominations.length > 0 ||
    !!state.minSalary ||
    state.datePosted !== "any" ||
    state.sort === "relevance" ||
    !!state.category;

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

  return (
    <div className={compact ? undefined : "border-b border-border bg-background"}>
      <div className={compact ? "py-1" : "mx-auto max-w-[1600px] px-4 py-2 sm:px-6"}>
        <div className="relative min-w-0">
          <div
            className={`flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden${
              hasActive ? " pr-32" : ""
            }`}
          >
          <FilterPopover
            label="Salary"
            active={!!state.minSalary}
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

          <FilterPopover label="Work Type" active={state.workType !== "any"}>
            <div className="flex flex-col">
              {WORK_TYPE_OPTIONS.map((opt) => (
                <FilterOption
                  key={opt.value}
                  type="radio"
                  name="workType"
                  label={opt.label}
                  checked={state.workType === opt.value}
                  onChange={() =>
                    onChange({
                      workType: opt.value as WorkType,
                      page: 0,
                    })
                  }
                />
              ))}
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

          {facets.categories.length > 0 ? (
            <FilterPopover label="Categories" active={!!state.category}>
              <div className="flex max-h-64 flex-col overflow-y-auto">
                <FilterOption
                  type="radio"
                  name="category"
                  label="All categories"
                  checked={!state.category}
                  onChange={() => onChange({ category: undefined, page: 0 })}
                />
                {facets.categories.map((cat) => (
                  <FilterOption
                    key={cat.value}
                    type="radio"
                    name="category"
                    label={`${cat.label} (${cat.count})`}
                    checked={state.category === cat.value}
                    onChange={() =>
                      onChange({ category: cat.value, page: 0 })
                    }
                  />
                ))}
              </div>
            </FilterPopover>
          ) : null}
          </div>

          {hasActive ? (
            <>
              <div
                className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-32 bg-gradient-to-r from-transparent to-background"
                aria-hidden="true"
              />
              <button
                type="button"
                onClick={onClearAll}
                className="absolute inset-y-0 right-0 z-[2] flex items-center bg-background pl-4 text-sm font-medium text-[#2d6a4f] hover:underline"
              >
                Clear all filters
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
