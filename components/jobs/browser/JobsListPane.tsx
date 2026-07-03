"use client";

import { JobsActiveFilterBadges } from "@components/jobs/browser/JobsActiveFilterBadges";
import { JobsEmptyResultsSuggestions } from "@components/jobs/browser/JobsEmptyResultsSuggestions";
import { JobListItem } from "@components/jobs/browser/JobListItem";
import { NAMESPACE_PATH } from "@lib/config";
import type { JobFacet, JobHit } from "@lib/algolia/jobs";
import {
  countActiveFilters,
  hasActiveJobSearch,
  isLatestJobsBrowse,
  isNewestFirst,
  type JobsUrlState,
} from "@lib/jobs/search-params";
import { Bookmark, Loader2, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";

const POST_JOB_HREF = "https://hub.eden.co.uk/dashboard/job-journey";

type Props = {
  jobs: JobHit[];
  total: number;
  selectedId?: string;
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  filterState?: JobsUrlState;
  filterFacets?: {
    categories: JobFacet[];
    contractTypes: JobFacet[];
    organisationTypes: JobFacet[];
    denominations: JobFacet[];
  };
  onFilterChange?: (changes: Partial<JobsUrlState>) => void;
  onClearFilters?: () => void;
  onSelect: (jobId: string) => void;
  onLoadMore: () => void;
  onPrefetch?: (jobId: string) => void;
  /** Page scroll (Indeed-style) vs fixed-height column scroll. */
  listScroll?: "container" | "page";
  /** Hide the results toolbar — use when rendering it above a split layout. */
  hideToolbar?: boolean;
};

function resultsLabel(
  filterState: JobsUrlState | undefined,
  total: number,
  hasActiveFilters: boolean,
) {
  const latestBrowse = filterState ? isLatestJobsBrowse(filterState) : false;
  const newestFirst = filterState ? isNewestFirst(filterState) : false;

  if (latestBrowse) {
    return (
      <>
        <span className="font-semibold text-foreground">Latest jobs</span>
        <span className="font-normal text-muted-foreground">
          {" "}
          · {total.toLocaleString()} most recently added
        </span>
      </>
    );
  }

  if (newestFirst) {
    return (
      <>
        {total.toLocaleString()}{" "}
        {hasActiveFilters ? "filtered " : ""}
        {total === 1 ? "result" : "results"}
        <span className="font-normal text-muted-foreground"> · Newest first</span>
      </>
    );
  }

  return (
    <>
      {total.toLocaleString()}{" "}
      {hasActiveFilters ? "filtered " : ""}
      {total === 1 ? "result" : "results"}
    </>
  );
}

/** Results count and quick actions above the job list. */
export function JobsListToolbar({
  total,
  filterState,
  onClearSearch,
}: {
  total: number;
  filterState?: JobsUrlState;
  onClearSearch?: () => void;
}) {
  const hasActiveFilters = filterState
    ? countActiveFilters(filterState) > 0
    : false;

  return (
    <div className="flex items-center justify-between px-1 pb-2">
      <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
        <p className="text-sm text-foreground">
          {resultsLabel(filterState, total, hasActiveFilters)}
        </p>
        {filterState && onClearSearch && hasActiveJobSearch(filterState) ? (
          <button
            type="button"
            onClick={onClearSearch}
            className="text-sm font-medium text-[#2d6a4f] underline-offset-2 hover:underline"
          >
            Clear search
          </button>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <Link
          href={`${NAMESPACE_PATH}/saved`}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium text-foreground shadow-soft-sm transition-colors hover:border-[#2d6a4f]/30"
        >
          <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
          Saved
        </Link>
        <a
          href={POST_JOB_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#2d6a4f] px-3 py-1.5 text-xs font-semibold text-white shadow-soft-sm transition-opacity hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Post
        </a>
      </div>
    </div>
  );
}

/** Scrollable middle column with job cards and infinite scroll. */
export function JobsListPane({
  jobs,
  total,
  selectedId,
  loading,
  loadingMore,
  hasMore,
  filterState,
  filterFacets,
  onFilterChange,
  onClearFilters,
  onSelect,
  onLoadMore,
  onPrefetch,
  listScroll = "container",
  hideToolbar = false,
}: Props) {
  const pageScroll = listScroll === "page";

  const sentinelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0]?.isIntersecting && hasMore && !loadingMore && !loading) {
        onLoadMore();
      }
    },
    [hasMore, loadingMore, loading, onLoadMore],
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleIntersect, {
      root: pageScroll ? null : listRef.current,
      rootMargin: "200px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect, pageScroll]);

  return (
    <div className={pageScroll ? "flex flex-col" : "flex h-full min-h-0 flex-col"}>
      {hideToolbar ? null : (
        <JobsListToolbar
          total={total}
          filterState={filterState}
          onClearSearch={onClearFilters}
        />
      )}

      {filterState &&
      filterFacets &&
      onFilterChange &&
      onClearFilters ? (
        <JobsActiveFilterBadges
          state={filterState}
          facets={filterFacets}
          onChange={onFilterChange}
          onClearAll={onClearFilters}
        />
      ) : null}

      <div
        ref={listRef}
        className={
          pageScroll
            ? "space-y-3"
            : "min-h-0 flex-1 space-y-3 overflow-y-auto pr-1"
        }
        aria-label="Job results"
      >
        {loading && jobs.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <Loader2
              className="h-8 w-8 animate-spin text-[#2d6a4f]"
              aria-label="Loading jobs"
            />
          </div>
        ) : jobs.length === 0 ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white px-6 py-12 text-center shadow-soft">
              <Search className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
              <p className="text-base font-medium text-foreground">
                No jobs match your search
              </p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Try widening your search area or clearing some filters.
              </p>
              {filterState && onClearFilters && hasActiveJobSearch(filterState) ? (
                <button
                  type="button"
                  onClick={onClearFilters}
                  className="mt-1 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#2d6a4f] shadow-soft-sm transition-colors hover:border-[#2d6a4f]/30"
                >
                  Clear search
                </button>
              ) : null}
            </div>

            <JobsEmptyResultsSuggestions
              filterState={filterState}
              onSelect={onSelect}
              onPrefetch={onPrefetch}
            />
          </div>
        ) : (
          <>
            {jobs.map((job) => (
              <JobListItem
                key={job.objectID}
                job={job}
                selected={selectedId === job.id}
                onSelect={onSelect}
                onPrefetch={onPrefetch}
              />
            ))}

            <div ref={sentinelRef} className="h-1" aria-hidden="true" />

            {loadingMore ? (
              <div className="flex items-center justify-center py-6">
                <Loader2
                  className="h-6 w-6 animate-spin text-[#2d6a4f]"
                  aria-label="Loading more jobs"
                />
              </div>
            ) : null}

            {!hasMore && jobs.length > 0 ? (
              <p className="py-4 text-center text-xs text-muted-foreground">
                You&apos;ve seen all {total.toLocaleString()} jobs
              </p>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
