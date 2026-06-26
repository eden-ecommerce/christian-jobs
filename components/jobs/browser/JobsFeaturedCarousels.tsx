"use client";

import type { ReactNode } from "react";
import { JobListItem } from "@components/jobs/browser/JobListItem";
import type { JobHit } from "@lib/algolia/jobs";
import { useFeaturedJobs } from "@hooks/jobs/use-featured-jobs";
import { ArrowRight } from "lucide-react";

type Props = {
  onSelectJob: (jobId: string) => void;
  onPrefetch?: (jobId: string) => void;
  blogCarousel?: ReactNode;
};

function JobCarousel({
  title,
  jobs,
  onSelectJob,
  onPrefetch,
}: {
  title: string;
  jobs: JobHit[];
  onSelectJob: (jobId: string) => void;
  onPrefetch?: (jobId: string) => void;
}) {
  if (jobs.length === 0) return null;

  return (
    <section className="py-8">
      <div className="mx-auto flex max-w-[1600px] items-end justify-between gap-4 px-4 sm:px-6">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
        <div className="mt-4 overflow-x-auto pb-6 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-stretch gap-3 px-0.5">
            {jobs.map((job) => (
              <div key={job.objectID} className="flex w-80 shrink-0">
                <JobListItem
                  job={job}
                  selected={false}
                  matchHeight
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
}: Props) {
  const { data } = useFeaturedJobs();

  return (
    <div className="border-t border-[#E5E7EB] bg-[#F9FAFB] px-4 py-8 font-[family-name:var(--font-outfit)] sm:px-6">
      <div className="mx-auto mb-2 max-w-[1600px] px-4 sm:px-6">
        <h2 className="text-lg font-semibold text-foreground">
          More Christian jobs &amp; career advice
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Browse featured roles, charity vacancies and articles for your next
          step in Christian ministry and workplace mission.
        </p>
      </div>
      <JobCarousel
        title="Featured Christian Jobs"
        jobs={data?.featured ?? []}
        onSelectJob={onSelectJob}
        onPrefetch={onPrefetch}
      />
      <JobCarousel
        title="Christian Charity Jobs"
        jobs={data?.charity ?? []}
        onSelectJob={onSelectJob}
        onPrefetch={onPrefetch}
      />
      {blogCarousel ? (
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6">{blogCarousel}</div>
      ) : null}
      <div className="mx-auto max-w-[1600px] px-4 pb-8 sm:px-6">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex items-center gap-1 text-sm font-medium text-[#2d6a4f] hover:underline"
        >
          Back to search <ArrowRight className="h-4 w-4 rotate-[-90deg]" />
        </button>
      </div>
    </div>
  );
}
