"use client";

import { useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { JobsHeroSectionV7 } from "@components/jobs/browser/v7/JobsHeroSectionV7";
import type { JobsLocationSearchSubmit } from "@components/jobs/browser/v7/JobsLocationSearchV7";
import { JobsFeaturedCarousels } from "@components/jobs/browser/JobsFeaturedCarousels";
import { GoogleMapsProvider } from "@components/google-maps/GoogleMapsProvider";
import type { CategoryFacet } from "@lib/algolia/jobs";
import { isGoogleMapsEnvConfigured } from "@lib/env-configured";
import { locationResultsHref } from "@lib/jobs/category-results-href";
import { jobsSearchPath } from "@lib/jobs/routes";
import {
  jobsUrlStateToSearchParams,
  latestJobsBrowseState,
  type JobsUrlState,
} from "@lib/jobs/search-params";

type Props = {
  categories: CategoryFacet[];
  blogCarousel?: ReactNode;
  /** Where search and featured job picks navigate — defaults to namespace search. */
  resultsPath?: string;
};

const defaultBrowseState = (): JobsUrlState => latestJobsBrowseState();

/** V7 landing — tabbed Category / Location / Work Type one-step paths. */
export function JobsHomepageV7({
  categories,
  blogCarousel,
  resultsPath = jobsSearchPath(),
}: Props) {
  const router = useRouter();

  const handleLocationSearch = useCallback(
    (location: JobsLocationSearchSubmit) => {
      router.push(locationResultsHref(resultsPath, location));
    },
    [router, resultsPath],
  );

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
    <div className="bg-[#fbfbfd]">
      <JobsHeroSectionV7
        categories={categories}
        resultsPath={resultsPath}
        onLocationSearch={handleLocationSearch}
      />

      <JobsFeaturedCarousels
        onSelectJob={handleSelectJob}
        blogCarousel={blogCarousel}
        showBackToSearch={false}
        variant="homepage"
        resultsPath={resultsPath}
      />
    </div>
  );

  if (isGoogleMapsEnvConfigured()) {
    return <GoogleMapsProvider>{page}</GoogleMapsProvider>;
  }

  return page;
}
