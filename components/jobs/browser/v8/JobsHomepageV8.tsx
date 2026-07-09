"use client";

import { useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { JobsHeroSectionV8 } from "@components/jobs/browser/v8/JobsHeroSectionV8";
import type { JobsLocationTabSubmit } from "@components/jobs/browser/v8/JobsLocationTabV8";
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

/** V8 landing — Category / Location tabs; Work Type nested under Location. */
export function JobsHomepageV8({
  categories,
  blogCarousel,
  resultsPath = jobsSearchPath(),
}: Props) {
  const router = useRouter();

  const handleLocationSearch = useCallback(
    (values: JobsLocationTabSubmit) => {
      router.push(
        locationResultsHref(resultsPath, {
          label: values.label,
          lat: values.lat,
          lng: values.lng,
          radius: values.radius,
          workTypes: values.workTypes,
        }),
      );
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
      <JobsHeroSectionV8
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
