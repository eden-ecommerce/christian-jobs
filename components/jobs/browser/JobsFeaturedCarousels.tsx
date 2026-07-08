"use client";

import type { ReactNode } from "react";
import { JobListItem } from "@components/jobs/browser/JobListItem";
import { JobsScrollReveal } from "@components/jobs/browser/JobsScrollReveal";
import { jobsHomepageContainerClassName } from "@components/jobs/browser/jobs-homepage-layout";
import type { JobHit } from "@lib/algolia/jobs";
import { useFeaturedJobs } from "@hooks/jobs/use-featured-jobs";
import { ArrowRight } from "lucide-react";

type Props = {
  onSelectJob: (jobId: string) => void;
  onPrefetch?: (jobId: string) => void;
  blogCarousel?: ReactNode;
  showBackToSearch?: boolean;
  /** Editorial styling for the v3 homepage */
  variant?: "default" | "homepage";
};

function JobCarousel({
  title,
  jobs,
  onSelectJob,
  onPrefetch,
  variant = "default",
}: {
  title: string;
  jobs: JobHit[];
  onSelectJob: (jobId: string) => void;
  onPrefetch?: (jobId: string) => void;
  variant?: "default" | "homepage";
}) {
  if (jobs.length === 0) return null;

  const isHomepage = variant === "homepage";

  return (
    <section className={isHomepage ? "py-3 sm:py-8" : "py-4"}>
      <div className={`${jobsHomepageContainerClassName} flex items-end justify-between gap-4`}>
        <h2
          className={
            isHomepage
              ? "text-[26px] font-semibold tracking-[-0.02em] text-[#1d1d1f] sm:text-[28px]"
              : "text-lg font-semibold text-foreground"
          }
        >
          {title}
        </h2>
      </div>
      <div className={jobsHomepageContainerClassName}>
        <div className="mt-3 overflow-x-auto pb-2 pt-0.5 sm:mt-4 sm:pb-4 sm:pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-stretch gap-4 px-0.5">
            {jobs.map((job) => (
              <div key={job.objectID} className="flex w-[19rem] shrink-0 sm:w-80">
                <JobListItem
                  job={job}
                  selected={false}
                  matchHeight
                  variant={isHomepage ? "v3" : "card"}
                  onSelect={onSelectJob}
                  onPrefetch={onPrefetch}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Featured and charity job carousels below the split-pane. */
export function JobsFeaturedCarousels({
  onSelectJob,
  onPrefetch,
  blogCarousel,
  showBackToSearch = true,
  variant = "default",
}: Props) {
  const { data } = useFeaturedJobs();
  const isHomepage = variant === "homepage";

  const featuredCarousel = (
    <JobCarousel
      title="Featured Christian Jobs"
      jobs={data?.featured ?? []}
      onSelectJob={onSelectJob}
      onPrefetch={onPrefetch}
      variant={variant}
    />
  );

  const charityCarousel = (
    <JobCarousel
      title="Christian Charity Jobs"
      jobs={data?.charity ?? []}
      onSelectJob={onSelectJob}
      onPrefetch={onPrefetch}
      variant={variant}
    />
  );

  return (
    <div
      className={`border-t ${
        isHomepage
          ? "border-[#e8e8ed] bg-[#fbfbfd] py-4 sm:py-8"
          : "border-[#E5E7EB] bg-[#F9FAFB] px-4 py-4 sm:px-6 sm:py-6"
      }`}
    >
      {isHomepage && (data?.featured?.length ?? 0) > 0 ? (
        <JobsScrollReveal>{featuredCarousel}</JobsScrollReveal>
      ) : (
        featuredCarousel
      )}
      {isHomepage && (data?.charity?.length ?? 0) > 0 ? (
        <JobsScrollReveal delayMs={80}>{charityCarousel}</JobsScrollReveal>
      ) : (
        charityCarousel
      )}
      {blogCarousel ? (
        isHomepage ? (
          <JobsScrollReveal delayMs={80}>
            <div className={jobsHomepageContainerClassName}>{blogCarousel}</div>
          </JobsScrollReveal>
        ) : (
          <div className={jobsHomepageContainerClassName}>{blogCarousel}</div>
        )
      ) : null}
      {showBackToSearch ? (
      <div className="mx-auto max-w-[1600px] px-4 pb-8 sm:px-6">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex items-center gap-1 text-sm font-medium text-[#2d6a4f] hover:underline"
        >
          Back to search <ArrowRight className="h-4 w-4 rotate-[-90deg]" />
        </button>
      </div>
      ) : null}
    </div>
  );
}
