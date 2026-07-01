"use client";

import { useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { JobsHeroSectionV3 } from "@components/jobs/browser/v3/JobsHeroSectionV3";
import { JobsFeaturedCarousels } from "@components/jobs/browser/JobsFeaturedCarousels";
import { GoogleMapsProvider } from "@components/google-maps/GoogleMapsProvider";
import { isGoogleMapsEnvConfigured } from "@lib/env-configured";
import { jobsUrlStateToSearchParams } from "@lib/jobs/search-params";
import type { JobsUrlState } from "@lib/jobs/search-params";

export const V3_RESULTS_PATH = "/v3/search";

type Props = {
  blogCarousel?: ReactNode;
};

const defaultBrowseState = (): JobsUrlState => ({
  q: "",
  location: "",
  contractTypes: [],
  organisationTypes: [],
  workType: "any",
  denominations: [],
  datePosted: "any",
  sort: "date_desc",
  page: 0,
});

/** V3 landing page — hero search, post-vacancy link, featured jobs and blog. */
export function JobsHomepageV3({ blogCarousel }: Props) {
  const router = useRouter();

  const handleSearch = useCallback(
    (
      query: string,
      location: { label: string; lat?: number; lng?: number },
    ) => {
      const hasGeo = location.lat !== undefined && location.lng !== undefined;
      const params = jobsUrlStateToSearchParams({
        ...defaultBrowseState(),
        q: query,
        location: location.label,
        place: location.label || undefined,
        lat: location.lat,
        lng: location.lng,
        sort: hasGeo ? "distance" : "date_desc",
      });
      router.push(`${V3_RESULTS_PATH}?${params.toString()}`);
    },
    [router],
  );

  const handleSelectJob = useCallback(
    (jobId: string) => {
      const params = jobsUrlStateToSearchParams({
        ...defaultBrowseState(),
        vjk: jobId,
      });
      router.push(`${V3_RESULTS_PATH}?${params.toString()}`);
    },
    [router],
  );

  const page = (
    <div className="font-[family-name:var(--font-outfit)] bg-[#fbfbfd]">
      <JobsHeroSectionV3 onSearch={handleSearch} />

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
