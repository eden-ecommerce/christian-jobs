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
  jobsUrlStateToSearchParams,
  latestJobsBrowseState,
  parseJobsUrlState,
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
    () => parseJobsUrlState(Object.fromEntries(searchParams.entries())),
    [searchParams],
  );

  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
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

  const total = listQuery.data?.pages[0]?.nbHits ?? initialResult.nbHits;
  const facets = listQuery.data?.pages[0]?.facets ?? initialFacets;
  const configured = initialResult.configured;
  const loading = listQuery.isFetching && !listQuery.isFetchingNextPage;
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
      updateUrl({ ...urlState, vjk: jobId });
      if (window.matchMedia("(max-width: 767px)").matches) {
        listScrollRef.current = window.scrollY;
        setMobileDetailOpen(true);
      }
    },
    [urlState, updateUrl],
  );

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
        workTypes: values.workTypes,
        contractTypes: values.contractTypes ?? [],
        location: values.location.label,
        place: values.location.label || undefined,
        lat: values.location.lat,
        lng: values.location.lng,
        radius: values.radius,
        sort: hasGeo ? "distance" : "date_desc",
      });
      setMobileDetailOpen(false);
    },
    [updateUrl],
  );

  const handleBrowseLatest = useCallback(() => {
    autoSelectedRef.current = false;
    restoreScrollRef.current = window.scrollY;
    updateUrl(latestJobsBrowseState());
    setMobileDetailOpen(false);
  }, [updateUrl]);

  const handleRadiusChange = useCallback(
    (radius: number | undefined) => {
      updateUrl({
        ...urlState,
        radius,
        sort:
          urlState.lat !== undefined && urlState.lng !== undefined
            ? "distance"
            : urlState.sort,
        page: 0,
        vjk: undefined,
      });
    },
    [urlState, updateUrl],
  );

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

  const detailData = detailQuery.data ?? null;
  const detailLoading = detailQuery.isLoading && Boolean(urlState.vjk);
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
    selectedId: urlState.vjk,
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
    onRadiusChange: handleRadiusChange,
  };

  const detailPanel = (
    <JobDetailPanel
      data={detailData}
      loading={detailLoading}
      error={detailError}
      selectedId={urlState.vjk}
      onSelectSimilar={selectJob}
      onPrefetch={prefetchDetail}
    />
  );

  const page = (
    <div className="font-[family-name:var(--font-outfit)] bg-[#F9FAFB]">
      {/* Search + filters — white band with breathing room */}
      <div className="border-b border-[#E5E7EB]/80 bg-[#FFFFFF]">
        <div className="mx-auto w-full max-w-[1100px] px-4 py-4 sm:px-6 sm:py-5">
          <div className="mx-auto w-full max-w-4xl">
            <JobsHeroSearchV5 {...sharedSearchProps} />
          </div>
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

      <div className="px-4 pb-4 pt-2 sm:px-6 sm:pb-5">
        <div className="mx-auto w-full max-w-[1100px]">
          <div className="hidden md:block">
            <JobsListToolbar
              total={total}
              filterState={urlState}
              onClearSearch={handleClearFilters}
            />
          </div>

          {/* Tablet + desktop: listings 2/5, sticky detail 3/5 */}
          <div className="hidden md:flex md:items-start md:gap-5">
            <div className="min-w-0 flex-[2]">
              <JobsListPane {...listPaneProps} hideToolbar />
            </div>
            <JobsDetailStickyPane>{detailPanel}</JobsDetailStickyPane>
          </div>

          {/* Phone: list only, detail opens as full-screen overlay */}
          <div className="md:hidden">
            <JobsListPane {...listPaneProps} />
          </div>
        </div>
      </div>

      <JobsMobileDetail
        open={mobileDetailOpen && Boolean(urlState.vjk)}
        data={detailData}
        loading={detailLoading}
        error={detailError}
        selectedId={urlState.vjk}
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
