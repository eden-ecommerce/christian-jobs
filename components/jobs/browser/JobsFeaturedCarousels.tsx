"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { JobListItem } from "@components/jobs/browser/JobListItem";
import { JobsScrollReveal } from "@components/jobs/browser/JobsScrollReveal";
import { jobsHomepageContainerClassName } from "@components/jobs/browser/jobs-homepage-layout";
import type { JobHit } from "@lib/algolia/jobs";
import { useFeaturedJobs } from "@hooks/jobs/use-featured-jobs";
import { latestJobsResultsHref } from "@lib/jobs/category-results-href";
import { jobsSearchPath } from "@lib/jobs/routes";
import { ArrowRight } from "lucide-react";

type Props = {
  onSelectJob: (jobId: string) => void;
  onPrefetch?: (jobId: string) => void;
  blogCarousel?: ReactNode;
  showBackToSearch?: boolean;
  /** Editorial styling for the v3 homepage */
  variant?: "default" | "homepage";
  /** Results route for section heading links — defaults to namespace search. */
  resultsPath?: string;
};

function JobCarousel({
  title,
  href,
  jobs,
  onSelectJob,
  onPrefetch,
  variant = "default",
}: {
  title: string;
  href: string;
  jobs: JobHit[];
  onSelectJob: (jobId: string) => void;
  onPrefetch?: (jobId: string) => void;
  variant?: "default" | "homepage";
}) {
  if (jobs.length === 0) return null;

  const isHomepage = variant === "homepage";

  return (
    <section className={isHomepage ? "py-3 sm:py-8" : "py-4"}>
      <div
        className={`${jobsHomepageContainerClassName} flex items-end justify-between gap-4`}
      >
        <h2
          className={
            isHomepage
              ? "text-[26px] font-semibold tracking-[-0.02em] text-[#1d1d1f] sm:text-[28px]"
              : "text-lg font-semibold text-foreground"
          }
        >
          <Link
            href={href}
            className="group inline-flex items-center gap-1.5 transition-colors hover:text-[#235A0E]"
          >
            {title}
            <ArrowRight
              className="h-5 w-5 shrink-0 text-[#235A0E]/70 transition-transform group-hover:translate-x-0.5 group-hover:text-[#235A0E] sm:h-6 sm:w-6"
              aria-hidden="true"
            />
          </Link>
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

/** Latest and featured job carousels below the hero / results split-pane. */
export function JobsFeaturedCarousels({
  onSelectJob,
  onPrefetch,
  blogCarousel,
  showBackToSearch = true,
  variant = "default",
  resultsPath = jobsSearchPath(),
}: Props) {
  const { data } = useFeaturedJobs();
  const isHomepage = variant === "homepage";
  const latestHref = latestJobsResultsHref(resultsPath);
  /** Full featured list — same newest browse until a distinct featured filter exists. */
  const featuredHref = latestHref;

  const latestCarousel = (
    <JobCarousel
      title="Latest Jobs"
      href={latestHref}
      jobs={data?.latest ?? []}
      onSelectJob={onSelectJob}
      onPrefetch={onPrefetch}
      variant={variant}
    />
  );

  const featuredCarousel = (
    <JobCarousel
      title="Featured Christian Jobs"
      href={featuredHref}
      jobs={data?.featured ?? []}
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
      {isHomepage && (data?.latest?.length ?? 0) > 0 ? (
        <JobsScrollReveal>{latestCarousel}</JobsScrollReveal>
      ) : (
        latestCarousel
      )}
      {isHomepage && (data?.featured?.length ?? 0) > 0 ? (
        <JobsScrollReveal delayMs={80}>{featuredCarousel}</JobsScrollReveal>
      ) : (
        featuredCarousel
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
            className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-[#2d6a4f] hover:underline"
          >
            Back to search <ArrowRight className="h-4 w-4 rotate-[-90deg]" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
