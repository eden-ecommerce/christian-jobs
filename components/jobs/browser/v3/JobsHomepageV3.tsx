"use client";

import { useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { JobsHeroSectionV3 } from "@components/jobs/browser/v3/JobsHeroSectionV3";
import { JobsFeaturedCarousels } from "@components/jobs/browser/JobsFeaturedCarousels";
import { GoogleMapsProvider } from "@components/google-maps/GoogleMapsProvider";
import { isGoogleMapsEnvConfigured } from "@lib/env-configured";
import { jobsSearchPath } from "@lib/jobs/routes";
import {
  jobsUrlStateToSearchParams,
  type JobsHeroSearchSubmit,
  type JobsUrlState,
} from "@lib/jobs/search-params";

type Props = {
  blogCarousel?: ReactNode;
  /** Where hero search and featured job picks navigate — defaults to namespace search. */
  resultsPath?: string;
};

const defaultBrowseState = (): JobsUrlState => ({
  q: "",
  location: "",
  contractTypes: [],
  organisationTypes: [],
  workTypes: [],
  denominations: [],
  datePosted: "any",
  sort: "date_desc",
  page: 0,
});

/** V3 landing page — hero search, post-vacancy link, featured jobs and blog. */
export function JobsHomepageV3({
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
      <JobsHeroSectionV3 onSearch={handleSearch} />

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
