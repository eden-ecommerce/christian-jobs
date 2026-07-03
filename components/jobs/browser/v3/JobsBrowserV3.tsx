"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { JobsHeroSearchV5 } from "@components/jobs/browser/v5/JobsHeroSearchV5";
import { GoogleMapsProvider } from "@components/google-maps/GoogleMapsProvider";
import { JobsFilterPills } from "@components/jobs/browser/JobsFilterPills";
import { JobsListPane, JobsListToolbar } from "@components/jobs/browser/JobsListPane";
import { JobDetailPanel } from "@components/jobs/browser/JobDetailPanel";
import { JobsDetailStickyPane } from "@components/jobs/browser/v3/JobsDetailStickyPane";
import { JobsMobileDetail } from "@components/jobs/browser/JobsMobileDetail";
import { JobsFeaturedCarousels } from "@components/jobs/browser/JobsFeaturedCarousels";
import { IntegrationEnvError } from "@components/common/IntegrationEnvError";
import { isGoogleMapsEnvConfigured } from "@lib/env-configured";
import { useJobDetail } from "@hooks/jobs/use-job-detail";
import { useJobsInfiniteList } from "@hooks/jobs/use-jobs-infinite";
import { getJobDetailQueryOptions } from "@hooks/jobs/get-options";
import type { JobFacets, SearchJobsResult } from "@lib/algolia/jobs";
import {
  hasActiveJobSearch,
  isLatestJobsBrowse,
  jobsUrlStateToSearchParams,
  latestJobsBrowseState,
  parseJobsUrlSearchParams,
  type JobsHeroSearchSubmit,
  type JobsUrlState,
} from "@lib/jobs/search-params";

type Props = {
  initialResult: SearchJobsResult;
  initialFacets: JobFacets;
  blogCarousel?: ReactNode;
};

/**
 * V3 jobs browser — Indeed-style layout: compact search and filter pills above a
 * 2/5 + 3/5 split. List scrolls with the page; detail pane stays sticky.
 */
export function JobsBrowserV3({ initialResult, initialFacets, blogCarousel }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const urlState = useMemo(
    () => parseJobsUrlSearchParams(searchParams),
    [searchParams],
  );

  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  // Tracks the job the user just clicked before the URL round-trip settles.
  // This lets us highlight the card and show the detail spinner instantly.
  const [pendingId, setPendingId] = useState<string | null>(null);
  const listScrollRef = useRef(0);
  const autoSelectedRef = useRef(false);
  const restoreScrollRef = useRef<number | null>(null);

  useEffect(() => {
    const isPhone = window.matchMedia("(max-width: 767px)").matches;
    if (urlState.vjk && isPhone) {
      setMobileDetailOpen(true);
    } else if (!isPhone) {
      setMobileDetailOpen(false);
    }
  }, [urlState.vjk]);

  const listQuery = useJobsInfiniteList(urlState);
  const detailQuery = useJobDetail(urlState.vjk);

  const jobs = useMemo(
    () => listQuery.data?.pages.flatMap((p) => p.hits) ?? initialResult.hits,
    [listQuery.data, initialResult.hits],
  );

  const fetchedNbHits = listQuery.data?.pages[0]?.nbHits;
  const loading = listQuery.isFetching && !listQuery.isFetchingNextPage;
  const total =
    fetchedNbHits ??
    (isLatestJobsBrowse(urlState) ? initialResult.nbHits : undefined);
  const resultsLoading =
    loading && fetchedNbHits === undefined && hasActiveJobSearch(urlState);
  const facets = listQuery.data?.pages[0]?.facets ?? initialFacets;
  const configured = initialResult.configured;
  const loadingMore = listQuery.isFetchingNextPage;
  const hasMore = listQuery.hasNextPage ?? false;

  const updateUrl = useCallback(
    (next: JobsUrlState) => {
      const params = jobsUrlStateToSearchParams(next);
      const qs = params.toString();
      const href = qs ? `${pathname}?${qs}` : pathname;
      router.replace(href, { scroll: false });
    },
    [pathname, router],
  );

  useEffect(() => {
    if (autoSelectedRef.current || urlState.vjk) return;
    const isDesktopOrTablet = window.matchMedia("(min-width: 768px)").matches;
    if (isDesktopOrTablet && jobs.length > 0) {
      autoSelectedRef.current = true;
      updateUrl({ ...urlState, vjk: jobs[0].id });
    }
  }, [jobs, urlState, updateUrl]);

  // Keep scroll position when filters update the URL and refetch results.
  useLayoutEffect(() => {
    if (restoreScrollRef.current === null) return;
    window.scrollTo({ top: restoreScrollRef.current, behavior: "instant" });
  }, [urlState]);

  useEffect(() => {
    if (restoreScrollRef.current === null || loading) return;
    window.scrollTo({ top: restoreScrollRef.current, behavior: "instant" });
    restoreScrollRef.current = null;
  }, [jobs, loading]);

  const prefetchDetail = useCallback(
    (jobId: string) => {
      void queryClient.prefetchQuery(getJobDetailQueryOptions(jobId));
    },
    [queryClient],
  );

  const selectJob = useCallback(
    (jobId: string) => {
      // Set pendingId synchronously so the card highlights and the detail
      // spinner appears before the URL round-trip completes (~1 second).
      setPendingId(jobId);
      updateUrl({ ...urlState, vjk: jobId });
      if (window.matchMedia("(max-width: 767px)").matches) {
        listScrollRef.current = window.scrollY;
        setMobileDetailOpen(true);
      }
    },
    [urlState, updateUrl],
  );

  // Clear pendingId once the URL has caught up so the real urlState.vjk takes over.
  useEffect(() => {
    if (pendingId && urlState.vjk === pendingId) {
      setPendingId(null);
    }
  }, [urlState.vjk, pendingId]);

  const closeMobileDetail = useCallback(() => {
    setMobileDetailOpen(false);
    updateUrl({ ...urlState, vjk: undefined });
    requestAnimationFrame(() => {
      window.scrollTo({ top: listScrollRef.current, behavior: "instant" });
    });
  }, [urlState, updateUrl]);

  const handleFilterChange = useCallback(
    (changes: Partial<JobsUrlState>) => {
      restoreScrollRef.current = window.scrollY;
      updateUrl({ ...urlState, ...changes, page: 0 });
      setMobileDetailOpen(false);
    },
    [urlState, updateUrl],
  );

  const handleSearch = useCallback(
    (values: JobsHeroSearchSubmit) => {
      autoSelectedRef.current = false;
      const hasGeo =
        values.location.lat !== undefined && values.location.lng !== undefined;
      updateUrl({
        ...latestJobsBrowseState(),
        category: values.category,
        workTypes: urlState.workTypes,
        contractTypes: urlState.contractTypes,
        location: values.location.label,
        place: values.location.label || undefined,
        lat: values.location.lat,
        lng: values.location.lng,
        radius: hasGeo ? urlState.radius : undefined,
        sort: hasGeo ? "distance" : "date_desc",
      });
      setMobileDetailOpen(false);
    },
    [updateUrl, urlState.workTypes, urlState.contractTypes, urlState.radius],
  );

  const handleBrowseLatest = useCallback(() => {
    autoSelectedRef.current = false;
    restoreScrollRef.current = window.scrollY;
    updateUrl(latestJobsBrowseState());
    setMobileDetailOpen(false);
  }, [updateUrl]);

  const handleClearFilters = useCallback(() => {
    restoreScrollRef.current = window.scrollY;
    updateUrl(latestJobsBrowseState());
    setMobileDetailOpen(false);
  }, [updateUrl]);

  if (!configured) {
    return (
      <div className="mx-auto max-w-screen-xl px-4 py-8">
        <IntegrationEnvError integration="algolia" />
      </div>
    );
  }

  // Treat the card as selected and the detail pane as loading as soon as the
  // user clicks, before the URL round-trip resolves (pendingId covers that gap).
  const activeId = urlState.vjk ?? pendingId ?? undefined;
  const detailData = detailQuery.data ?? null;
  const detailLoading =
    (detailQuery.isLoading && Boolean(urlState.vjk)) || Boolean(pendingId);
  const detailError = detailQuery.isError ? "Unable to load job details." : null;

  const sharedFilterFacets = {
    categories: facets.categories,
    contractTypes: facets.contractTypes,
    organisationTypes: facets.organisationTypes,
    denominations: facets.denominations,
  };

  const listPaneProps = {
    jobs,
    total,
    selectedId: activeId,
    loading,
    loadingMore,
    hasMore,
    filterState: urlState,
    filterFacets: sharedFilterFacets,
    onFilterChange: handleFilterChange,
    onClearFilters: handleClearFilters,
    onSelect: selectJob,
    onLoadMore: () => void listQuery.fetchNextPage(),
    onPrefetch: prefetchDetail,
    listScroll: "page" as const,
    resultsLoading,
  };

  const sharedSearchProps = {
    category: urlState.category,
    workTypes: urlState.workTypes,
    contractTypes: urlState.contractTypes,
    location: urlState.location,
    lat: urlState.lat,
    lng: urlState.lng,
    radius: urlState.radius,
    categories: facets.categories,
    onSearch: handleSearch,
    onBrowseLatest: handleBrowseLatest,
    showRadiusSelect: false,
    elevated: true,
  };

  const detailPanel = (
    <JobDetailPanel
      data={detailData}
      loading={detailLoading}
      error={detailError}
      selectedId={activeId}
      onSelectSimilar={selectJob}
      onPrefetch={prefetchDetail}
      scrollWithPage
    />
  );

  const page = (
    <div className="font-[family-name:var(--font-outfit)] bg-[#F9FAFB]">
      {/* Search + filters — white band with breathing room */}
      <div className="border-b border-[#E5E7EB]/80 bg-[#FFFFFF]">
        <div className="px-4 py-4 sm:px-6 sm:py-5">
          <div className="mx-auto w-full max-w-[1100px]">
            <JobsHeroSearchV5 {...sharedSearchProps} />
            <div className="mt-3">
              <JobsFilterPills
                state={urlState}
                facets={sharedFilterFacets}
                onChange={handleFilterChange}
                onClearAll={handleClearFilters}
                compact
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 pt-2 sm:px-6 sm:pb-5">
        <div className="mx-auto w-full max-w-[1100px]">
          <div className="hidden md:block">
            <JobsListToolbar
              total={total}
              filterState={urlState}
              loading={resultsLoading}
            />
          </div>

          {/* Tablet + desktop: listings 2/5, sticky detail 3/5 */}
          <div className="hidden md:flex md:items-start md:gap-5">
            <div className="min-w-0 flex-[2]">
              <JobsListPane {...listPaneProps} hideToolbar />
            </div>
            <JobsDetailStickyPane pageScroll>{detailPanel}</JobsDetailStickyPane>
          </div>

          {/* Phone: list only, detail opens as full-screen overlay */}
          <div className="md:hidden">
            <JobsListPane {...listPaneProps} />
          </div>
        </div>
      </div>

      <JobsMobileDetail
        open={mobileDetailOpen && Boolean(activeId)}
        data={detailData}
        loading={detailLoading}
        error={detailError}
        selectedId={activeId}
        onClose={closeMobileDetail}
        onSelectSimilar={selectJob}
        onPrefetch={prefetchDetail}
      />

      <JobsFeaturedCarousels
        onSelectJob={selectJob}
        onPrefetch={prefetchDetail}
        blogCarousel={blogCarousel}
      />
    </div>
  );

  if (isGoogleMapsEnvConfigured()) {
    return <GoogleMapsProvider>{page}</GoogleMapsProvider>;
  }

  return page;
}
