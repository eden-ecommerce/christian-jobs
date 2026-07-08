"use client";

import { JobsEmptyResultsSuggestions } from "@components/jobs/browser/JobsEmptyResultsSuggestions";
import { JobListItem } from "@components/jobs/browser/JobListItem";
import { NAMESPACE_PATH } from "@lib/config";
import type { JobFacet, JobHit } from "@lib/algolia/jobs";
import {
  hasActiveJobSearch,
  isLatestJobsBrowse,
  isNewestFirst,
  type JobsUrlState,
} from "@lib/jobs/search-params";
import { Bookmark, Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";

type Props = {
  jobs: JobHit[];
  total?: number;
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
  resultsLoading?: boolean;
  /** Replace the default empty-state card; pass `null` to hide it. */
  emptyStateCard?: React.ReactNode | null;
};

function resultsLabel(
  filterState: JobsUrlState | undefined,
  total: number,
) {
  const count = total.toLocaleString();
  const latestBrowse = filterState ? isLatestJobsBrowse(filterState) : true;

  if (latestBrowse) {
    return (
      <>
        <span className="font-semibold text-foreground">Latest jobs</span>
        <span className="font-normal text-muted-foreground"> · {count}</span>
      </>
    );
  }

  const newestFirst = filterState ? isNewestFirst(filterState) : false;

  return (
    <>
      <span className="font-semibold text-foreground">{count} jobs</span>
      {newestFirst ? (
        <span className="hidden font-normal text-muted-foreground sm:inline">
          {" "}
          · Newest first
        </span>
      ) : null}
    </>
  );
}

/** Results count and quick actions above the job list. */
export function JobsListToolbar({
  total,
  filterState,
  loading = false,
}: {
  total?: number;
  filterState?: JobsUrlState;
  onClearSearch?: () => void;
  loading?: boolean;
}) {
  const showCount = typeof total === "number";

  return (
    <div className="flex items-center justify-between gap-2 px-1 pb-2">
      <p className="min-w-0 flex-1 truncate whitespace-nowrap text-sm text-foreground">
        {loading || !showCount ? (
          <span className="text-muted-foreground">Updating…</span>
        ) : (
          resultsLabel(filterState, total)
        )}
      </p>
      <div className="flex shrink-0 items-center gap-2">
        <Link
          href={`${NAMESPACE_PATH}/saved`}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium text-foreground shadow-soft-sm transition-colors hover:border-[#2d6a4f]/30"
        >
          <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
          Saved
        </Link>
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
  resultsLoading = false,
  emptyStateCard,
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
          loading={resultsLoading}
        />
      )}

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
            {emptyStateCard === undefined ? (
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
                    className="mt-1 cursor-pointer rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#2d6a4f] shadow-soft-sm transition-colors hover:border-[#2d6a4f]/30"
                  >
                    Clear search
                  </button>
                ) : null}
              </div>
            ) : emptyStateCard ? (
              emptyStateCard
            ) : null}

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

            {!hasMore && jobs.length > 0 && typeof total === "number" ? (
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
