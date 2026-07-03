"use client";

import { JobListItem } from "@components/jobs/browser/JobListItem";
import { useJobSearchFallbacks } from "@hooks/jobs/use-job-search-fallbacks";
import type { JobsUrlState } from "@lib/jobs/search-params";
import { Loader2 } from "lucide-react";

type Props = {
  filterState?: JobsUrlState;
  onSelect: (jobId: string) => void;
  onPrefetch?: (jobId: string) => void;
};

/** Suggested jobs when a filtered search returns no results. */
export function JobsEmptyResultsSuggestions({
  filterState,
  onSelect,
  onPrefetch,
}: Props) {
  const { data: sections, isLoading } = useJobSearchFallbacks(
    filterState,
    true,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2
          className="h-6 w-6 animate-spin text-[#2d6a4f]"
          aria-label="Loading suggestions"
        />
      </div>
    );
  }

  if (!sections?.length) return null;

  return (
    <div className="space-y-8 pt-2">
      {sections.map((section) => (
        <section key={section.id} aria-labelledby={`${section.id}-heading`}>
          <div className="px-1 pb-3">
            <h3
              id={`${section.id}-heading`}
              className="text-base font-semibold text-foreground"
            >
              {section.title}
            </h3>
            {section.description ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {section.description}
              </p>
            ) : null}
          </div>

          <div className="space-y-3">
            {section.jobs.map((job) => (
              <JobListItem
                key={job.objectID}
                job={job}
                selected={false}
                onSelect={onSelect}
                onPrefetch={onPrefetch}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
