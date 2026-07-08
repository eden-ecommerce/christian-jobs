"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { JobsSearchBar } from "@components/jobs/browser/JobsSearchBar";
import { JobsPageHero } from "@components/jobs/browser/JobsPageHero";
import { GoogleMapsProvider } from "@components/google-maps/GoogleMapsProvider";
import { JobsFilterPills } from "@components/jobs/browser/JobsFilterPills";
import { JobsFilterSidebar } from "@components/jobs/browser/JobsFilterSidebar";
import { JobsListPane } from "@components/jobs/browser/JobsListPane";
import { JobDetailPanel } from "@components/jobs/browser/JobDetailPanel";
import { JobsMobileDetail } from "@components/jobs/browser/JobsMobileDetail";
import { JobsFeaturedCarousels } from "@components/jobs/browser/JobsFeaturedCarousels";
import { IntegrationEnvError } from "@components/common/IntegrationEnvError";
import { isGoogleMapsEnvConfigured } from "@lib/env-configured";
import { useJobDetail } from "@hooks/jobs/use-job-detail";
import { useJobsInfiniteList } from "@hooks/jobs/use-jobs-infinite";
import { getJobDetailQueryOptions } from "@hooks/jobs/get-options";
import type { JobFacets, SearchJobsResult } from "@lib/algolia/jobs";
import {
  isLatestJobsBrowse,
  jobsUrlStateToSearchParams,
  latestJobsBrowseState,
  parseJobsUrlSearchParams,
  type JobsUrlState,
} from "@lib/jobs/search-params";

type Props = {
  initialResult: SearchJobsResult;
  initialFacets: JobFacets;
  blogCarousel?: ReactNode;
};

/**
 * Three-column jobs browser — filters sidebar, results list, detail pane.
 */
export function JobsBrowser({ initialResult, initialFacets, blogCarousel }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const urlState = useMemo(
    () => parseJobsUrlSearchParams(searchParams),
    [searchParams],
  );

  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const listScrollRef = useRef(0);
  const autoSelectedRef = useRef(false);

  // Open full-screen detail on phone when URL contains vjk (client-only)
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

  // Auto-select the first job on desktop/tablet when the page loads with no selection
  useEffect(() => {
    if (autoSelectedRef.current || urlState.vjk) return;
    const isDesktopOrTablet = window.matchMedia("(min-width: 768px)").matches;
    if (isDesktopOrTablet && initialResult.hits.length > 0) {
      autoSelectedRef.current = true;
      updateUrl({ ...urlState, vjk: initialResult.hits[0].id });
    }
  }, [urlState, updateUrl, initialResult.hits]);

  const prefetchDetail = useCallback(
    (jobId: string) => {
      void queryClient.prefetchQuery(getJobDetailQueryOptions(jobId));
    },
    [queryClient],
  );

  const selectJob = useCallback(
    (jobId: string) => {
      updateUrl({ ...urlState, vjk: jobId });
      // Full-screen overlay only on phone; tablet uses inline 2-column detail pane
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
      updateUrl({ ...urlState, ...changes, vjk: undefined, page: 0 });
      setMobileDetailOpen(false);
    },
    [urlState, updateUrl],
  );

  const handleSearch = useCallback(
    (
      query: string,
      location: { label: string; lat?: number; lng?: number },
    ) => {
      const hasGeo =
        location.lat !== undefined && location.lng !== undefined;
      updateUrl({
        ...urlState,
        q: query,
        location: location.label,
        place: location.label || undefined,
        lat: location.lat ?? urlState.lat,
        lng: location.lng ?? urlState.lng,
        sort: hasGeo ? "distance" : urlState.sort,
        page: 0,
        vjk: undefined,
      });
      setMobileDetailOpen(false);
    },
    [urlState, updateUrl],
  );

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

  const listPaneProps = {
    jobs,
    total,
    selectedId: urlState.vjk,
    loading,
    loadingMore,
    hasMore,
    filterState: urlState,
    filterFacets: {
      categories: facets.categories,
      contractTypes: facets.contractTypes,
      organisationTypes: facets.organisationTypes,
      denominations: facets.denominations,
    },
    onFilterChange: handleFilterChange,
    onClearFilters: handleClearFilters,
    onSelect: selectJob,
    onLoadMore: () => void listQuery.fetchNextPage(),
    onPrefetch: prefetchDetail,
  };

  const showLandingSearch = isLatestJobsBrowse(urlState);

  const page = (
    <div className="bg-[#F9FAFB]">
      <JobsPageHero />

      {/* Search — sticky so jobs stay reachable while scrolling */}
      <div className="sticky top-0 z-40 border-b border-[#E5E7EB]/80 bg-[#F9FAFB]/95 backdrop-blur-sm">
        <JobsSearchBar
          query={urlState.q}
          location={urlState.location}
          lat={urlState.lat}
          lng={urlState.lng}
          radius={urlState.radius}
          onSearch={handleSearch}
          onRadiusChange={handleRadiusChange}
          showEmployerHint={showLandingSearch}
        />
        {/* Mobile filter pills */}
        <div className="lg:hidden">
          <JobsFilterPills
            state={urlState}
            facets={{
              contractTypes: facets.contractTypes,
              organisationTypes: facets.organisationTypes,
              denominations: facets.denominations,
              categories: facets.categories,
            }}
            onChange={handleFilterChange}
            onClearAll={handleClearFilters}
          />
        </div>
      </div>

      {/* Three-column layout — starts immediately below search */}
      <div className="mx-auto w-full max-w-[1600px] px-4 py-4 sm:px-6 sm:py-5">
        {/* Desktop: 3 columns (filters + list + detail) */}
        <div className="hidden min-h-[calc(100vh-160px)] gap-5 lg:grid lg:grid-cols-[260px_minmax(300px,380px)_1fr]">
          <div className="sticky top-[120px] h-[calc(100vh-140px)] self-start overflow-hidden">
            <JobsFilterSidebar
              state={urlState}
              facets={{
                categories: facets.categories,
                contractTypes: facets.contractTypes,
                organisationTypes: facets.organisationTypes,
                denominations: facets.denominations,
              }}
              onChange={handleFilterChange}
              onClearAll={handleClearFilters}
            />
          </div>

          <div className="sticky top-[120px] h-[calc(100vh-140px)] self-start overflow-hidden">
            <JobsListPane {...listPaneProps} />
          </div>

          <div className="sticky top-[120px] h-[calc(100vh-140px)] self-start overflow-hidden">
            <JobDetailPanel
              data={detailData}
              loading={detailLoading}
              error={detailError}
              selectedId={urlState.vjk}
              onSelectSimilar={selectJob}
              onPrefetch={prefetchDetail}
            />
          </div>
        </div>

        {/* Tablet: 2 columns (list + detail), filters via pills in header */}
        <div className="hidden min-h-[calc(100vh-160px)] gap-5 md:grid md:grid-cols-[minmax(280px,360px)_1fr] lg:hidden">
          <div className="sticky top-[120px] h-[calc(100vh-140px)] self-start overflow-hidden">
            <JobsListPane {...listPaneProps} />
          </div>

          <div className="sticky top-[120px] h-[calc(100vh-140px)] self-start overflow-hidden">
            <JobDetailPanel
              data={detailData}
              loading={detailLoading}
              error={detailError}
              selectedId={urlState.vjk}
              onSelectSimilar={selectJob}
              onPrefetch={prefetchDetail}
            />
          </div>
        </div>

        {/* Phone: list only, detail opens as full-screen overlay */}
        <div className="md:hidden">
          <JobsListPane {...listPaneProps} />
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
