"use client";

import { useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { JobsHeroSectionV6 } from "@components/jobs/browser/v6/JobsHeroSectionV6";
import { JobsFeaturedCarousels } from "@components/jobs/browser/JobsFeaturedCarousels";
import type { CategoryFacet } from "@lib/algolia/jobs";
import { jobsSearchPath } from "@lib/jobs/routes";
import {
  jobsUrlStateToSearchParams,
  latestJobsBrowseState,
  type JobsUrlState,
} from "@lib/jobs/search-params";

type Props = {
  categories: CategoryFacet[];
  blogCarousel?: ReactNode;
  /** Where featured job picks navigate — defaults to namespace search. */
  resultsPath?: string;
};

const defaultBrowseState = (): JobsUrlState => latestJobsBrowseState();

/** V6 landing — category chips (plus Latest) as one-step paths to results. */
export function JobsHomepageV6({
  categories,
  blogCarousel,
  resultsPath = jobsSearchPath(),
}: Props) {
  const router = useRouter();

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

  return (
    <div className="bg-[#fbfbfd]">
      <JobsHeroSectionV6
        categories={categories}
        resultsPath={resultsPath}
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
}
