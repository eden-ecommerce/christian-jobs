"use client";

import { useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { JobsHeroSectionV5 } from "@components/jobs/browser/v5/JobsHeroSectionV5";
import { JobsFeaturedCarousels } from "@components/jobs/browser/JobsFeaturedCarousels";
import { GoogleMapsProvider } from "@components/google-maps/GoogleMapsProvider";
import { isGoogleMapsEnvConfigured } from "@lib/env-configured";
import { jobsSearchPath } from "@lib/jobs/routes";
import {
  jobsUrlStateToSearchParams,
  latestJobsBrowseState,
  type JobsHeroSearchSubmit,
  type JobsUrlState,
} from "@lib/jobs/search-params";

type Props = {
  blogCarousel?: ReactNode;
  /** Where hero search and featured job picks navigate — defaults to namespace search. */
  resultsPath?: string;
};

const defaultBrowseState = (): JobsUrlState => latestJobsBrowseState();

/** V5 landing page — Rightmove-inspired hero card, featured jobs and blog. */
export function JobsHomepageV5({
  blogCarousel,
  resultsPath = jobsSearchPath(),
}: Props) {
  const router = useRouter();

  const handleSearch = useCallback(
    (values: JobsHeroSearchSubmit) => {
      const hasGeo =
        values.location.lat !== undefined && values.location.lng !== undefined;
      const params = jobsUrlStateToSearchParams({
        ...defaultBrowseState(),
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
      router.push(`${resultsPath}?${params.toString()}`);
    },
    [router, resultsPath],
  );

  const handleBrowseLatest = useCallback(() => {
    router.push(resultsPath);
  }, [router, resultsPath]);

  const handleSelectJob = useCallback(
    (jobId: string) => {
      const params = jobsUrlStateToSearchParams({
        ...defaultBrowseState(),
        vjk: jobId,
      });
      router.push(`${resultsPath}?${params.toString()}`);
    },
    [router, resultsPath],
  );

  const page = (
    <div className="font-[family-name:var(--font-outfit)] bg-[#fbfbfd]">
      <JobsHeroSectionV5
        onSearch={handleSearch}
        onBrowseLatest={handleBrowseLatest}
      />

      <JobsFeaturedCarousels
        onSelectJob={handleSelectJob}
        blogCarousel={blogCarousel}
        showBackToSearch={false}
        variant="homepage"
      />
    </div>
  );

  if (isGoogleMapsEnvConfigured()) {
    return <GoogleMapsProvider>{page}</GoogleMapsProvider>;
  }

  return page;
}
