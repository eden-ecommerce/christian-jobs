"use client";

import type { JobFacet } from "@lib/algolia/jobs";
import type { JobSort } from "@lib/algolia/jobs";
import type { DatePosted, JobWorkType, JobsUrlState } from "@lib/jobs/search-params";
import { JobsSalaryRangeFilter } from "@components/jobs/browser/JobsSalaryRangeFilter";
import {
  CONTRACT_TYPE_OPTIONS,
  DATE_POSTED_OPTIONS,
  ORGANISATION_TYPE_OPTIONS,
  SORT_OPTIONS,
  WORK_TYPE_OPTIONS,
  countActiveFilters,
  isNewestFirst,
} from "@lib/jobs/search-params";
import {
  mergeFacetOptions,
  SidebarCheckboxGroup,
  SidebarFilterSection,
  SidebarRadioGroup,
  SidebarRadioOption,
  toggleFilterValue,
} from "@components/jobs/browser/JobsSidebarFilterSection";
import {
  ArrowRight,
  Briefcase,
  Cross,
  Globe,
  Heart,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

const POST_JOB_HREF = "https://hub.eden.co.uk/dashboard/job-journey";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Ministry & Pastoral": <Cross className="h-4 w-4" aria-hidden="true" />,
  "Children & Youth": <Users className="h-4 w-4" aria-hidden="true" />,
  "Worship & Creative Arts": <Sparkles className="h-4 w-4" aria-hidden="true" />,
  "Administration & Operations": <Briefcase className="h-4 w-4" aria-hidden="true" />,
  "Missions & Outreach": <Globe className="h-4 w-4" aria-hidden="true" />,
  "Counselling & Care": <Heart className="h-4 w-4" aria-hidden="true" />,
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

function QuickPill({
  label,
  active,
  icon,
  onClick,
}: {
  label: string;
  active: boolean;
  icon?: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "bg-[#2d6a4f] text-white shadow-soft-sm"
          : "border border-[#E5E7EB] bg-white text-foreground hover:border-[#2d6a4f]/40"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

const VISIBLE_CATEGORY_COUNT = 6;

function CategoryListSection({
  categories,
  selectedCategory,
  onChange,
}: {
  categories: JobFacet[];
  selectedCategory?: string;
  onChange: Props["onChange"];
}) {
  const selectedIndex = categories.findIndex(
    (category) => category.value === selectedCategory,
  );
  const [showAll, setShowAll] = useState(selectedIndex >= VISIBLE_CATEGORY_COUNT);

  if (categories.length === 0) return null;

  const hasMore = categories.length > VISIBLE_CATEGORY_COUNT;
  const visibleCategories = showAll
    ? categories
    : categories.slice(0, VISIBLE_CATEGORY_COUNT);
  const hiddenCount = categories.length - VISIBLE_CATEGORY_COUNT;

  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Job Categories
      </p>
      <ul className="mt-2 space-y-0.5">
        <li>
          <button
            type="button"
            onClick={() => onChange({ category: undefined, page: 0 })}
            className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-[#F9FAFB] ${
              !selectedCategory
                ? "font-semibold text-[#2d6a4f]"
                : "text-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              All categories
            </span>
          </button>
        </li>
        {visibleCategories.map((cat) => (
          <li key={cat.value}>
            <button
              type="button"
              onClick={() =>
                onChange({
                  category:
                    selectedCategory === cat.value ? undefined : cat.value,
                  page: 0,
                })
              }
              className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-[#F9FAFB] ${
                selectedCategory === cat.value
                  ? "font-semibold text-[#2d6a4f]"
                  : "text-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-muted-foreground">
                  {CATEGORY_ICONS[cat.label] ?? (
                    <Briefcase className="h-4 w-4" aria-hidden="true" />
                  )}
                </span>
                {cat.label}
              </span>
              <span className="text-xs tabular-nums text-muted-foreground">
                ({cat.count})
              </span>
            </button>
          </li>
        ))}
      </ul>
      {hasMore ? (
        <button
          type="button"
          onClick={() => setShowAll((expanded) => !expanded)}
          className="mt-1 cursor-pointer px-2 text-xs font-medium text-[#2d6a4f] hover:underline"
          aria-expanded={showAll}
        >
          {showAll ? "Show less" : `Show ${hiddenCount} more`}
        </button>
      ) : null}
    </>
  );
}

function SidebarAdvancedFilters({
  state,
  contractOptions,
  organisationOptions,
  denominationOptions,
  activeDatePosted,
  activeSort,
  onChange,
}: {
  state: JobsUrlState;
  contractOptions: ReturnType<typeof mergeFacetOptions>;
  organisationOptions: ReturnType<typeof mergeFacetOptions>;
  denominationOptions: { label: string; value: string; count: number }[];
  activeDatePosted?: string;
  activeSort?: JobSort;
  onChange: Props["onChange"];
}) {
  return (
    <>
      <SidebarFilterSection title="Contract Type">
        <SidebarCheckboxGroup
          options={contractOptions}
          values={state.contractTypes}
          onToggle={(value) =>
            onChange({
              contractTypes: toggleFilterValue(state.contractTypes, value),
              page: 0,
            })
          }
        />
      </SidebarFilterSection>

      <SidebarFilterSection title="Organisation Type">
        <SidebarCheckboxGroup
          options={organisationOptions}
          values={state.organisationTypes}
          onToggle={(value) =>
            onChange({
              organisationTypes: toggleFilterValue(state.organisationTypes, value),
              page: 0,
            })
          }
        />
      </SidebarFilterSection>

      <SidebarFilterSection title="Work Type">
        <SidebarCheckboxGroup
          options={WORK_TYPE_OPTIONS.filter((option) => option.value !== "any").map(
            (option) => ({
              label: option.label,
              value: option.value,
            }),
          )}
          values={state.workTypes}
          onToggle={(value) =>
            onChange({
              workTypes: toggleFilterValue(
                state.workTypes,
                value,
              ) as JobWorkType[],
              page: 0,
            })
          }
        />
      </SidebarFilterSection>

      <SidebarFilterSection title="Salary">
        <JobsSalaryRangeFilter
          minSalary={state.minSalary}
          maxSalary={state.maxSalary}
          onChange={(changes) => onChange({ ...changes, page: 0 })}
        />
      </SidebarFilterSection>

      {denominationOptions.length > 0 ? (
        <SidebarFilterSection title="Denomination">
          <SidebarCheckboxGroup
            options={denominationOptions}
            values={state.denominations}
            onToggle={(value) =>
              onChange({
                denominations: toggleFilterValue(state.denominations, value),
                page: 0,
              })
            }
          />
        </SidebarFilterSection>
      ) : null}

      <SidebarFilterSection title="Date Posted" defaultOpen={false}>
        <SidebarRadioGroup
          allLabel="Any time"
          value={activeDatePosted}
          options={DATE_POSTED_OPTIONS.filter((option) => option.value !== "any").map(
            (option) => ({
              label: option.label,
              value: option.value,
            }),
          )}
          onChange={(value) =>
            onChange({
              datePosted: (value ?? "any") as DatePosted,
              page: 0,
            })
          }
        />
      </SidebarFilterSection>

      <SidebarFilterSection title="Sort By" defaultOpen={false}>
        <>
          <SidebarRadioOption
            label="Most recent"
            checked={!activeSort}
            onSelect={() => onChange({ sort: "date_desc", page: 0 })}
          />
          {SORT_OPTIONS.filter((option) => option.value !== "date_desc").map(
            (option) => (
              <SidebarRadioOption
                key={option.value}
                label={option.label}
                checked={state.sort === option.value}
                onSelect={() =>
                  onChange({ sort: option.value as JobSort, page: 0 })
                }
              />
            ),
          )}
          {state.lat !== undefined && state.lng !== undefined ? (
            <SidebarRadioOption
              label="Distance"
              checked={state.sort === "distance"}
              onSelect={() => onChange({ sort: "distance", page: 0 })}
            />
          ) : null}
        </>
      </SidebarFilterSection>
    </>
  );
}

/** Left sidebar filters panel matching the boutique jobs design. */
export function JobsFilterSidebar({
  state,
  facets,
  onChange,
  onClearAll,
}: Props) {
  const isLatest = isNewestFirst(state);
  const isRemote = state.workTypes.includes("remote");
  const isHybrid = state.workTypes.includes("hybrid");
  const isFullTime = state.contractTypes.includes("fullTime");
  const activeFilterCount = countActiveFilters(state);

  const contractOptions = mergeFacetOptions(
    facets.contractTypes,
    CONTRACT_TYPE_OPTIONS,
  );
  const organisationOptions = mergeFacetOptions(
    facets.organisationTypes,
    ORGANISATION_TYPE_OPTIONS,
  );
  const denominationOptions = facets.denominations.map((option) => ({
    label: option.label,
    value: option.value,
    count: option.count,
  }));

  const activeSort = state.sort === "date_desc" ? undefined : state.sort;
  const activeDatePosted =
    state.datePosted === "any" ? undefined : state.datePosted;

  return (
    <aside className="flex h-full min-h-0 flex-col rounded-2xl bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-bold text-foreground">Filters</h2>
        {activeFilterCount > 0 ? (
          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full border border-[#E5E7EB] bg-[#F9FAFB] px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-[#2d6a4f]/30 hover:bg-white hover:text-[#2d6a4f]"
          >
            Clear filters
            <X className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="sr-only">
              ({activeFilterCount} active{" "}
              {activeFilterCount === 1 ? "filter" : "filters"})
            </span>
          </button>
        ) : null}
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Quick Filters
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <QuickPill
            label="Latest"
            active={isLatest}
            onClick={() =>
              onChange({ sort: "date_desc", datePosted: "any", page: 0 })
            }
          />
          <QuickPill
            label="Full-time"
            active={isFullTime}
            onClick={() =>
              onChange({
                contractTypes: isFullTime ? [] : ["fullTime"],
                page: 0,
              })
            }
          />
          <QuickPill
            label="Hybrid"
            active={isHybrid}
            onClick={() =>
              onChange({
                workTypes: isHybrid
                  ? state.workTypes.filter((item) => item !== "hybrid")
                  : [...state.workTypes, "hybrid"],
                page: 0,
              })
            }
          />
          <QuickPill
            label="Remote"
            active={isRemote}
            onClick={() =>
              onChange({
                workTypes: isRemote
                  ? state.workTypes.filter((item) => item !== "remote")
                  : [...state.workTypes, "remote"],
                page: 0,
              })
            }
          />
        </div>
      </div>

      <div className="mt-6 min-h-0 flex-1 overflow-y-auto pr-1">
        <CategoryListSection
          categories={facets.categories}
          selectedCategory={state.category}
          onChange={onChange}
        />

        <SidebarAdvancedFilters
          state={state}
          contractOptions={contractOptions}
          organisationOptions={organisationOptions}
          denominationOptions={denominationOptions}
          activeDatePosted={activeDatePosted}
          activeSort={activeSort}
          onChange={onChange}
        />
      </div>

      <div className="mt-6 shrink-0 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
        <p className="text-sm font-bold text-foreground">Hire Your Next Leader</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Post your vacancy for free and reach thousands of Christian job seekers.
        </p>
        <a
          href={POST_JOB_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#2d6a4f] hover:underline"
        >
          Post a vacancy <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </aside>
  );
}
