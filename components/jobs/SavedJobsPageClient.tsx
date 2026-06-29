"use client";

import { useState } from "react";
import { JobCard } from "@components/jobs/JobCard";
import { NsLink } from "@components/ns-link";
import { useSavedJobs } from "@lib/jobs/use-saved-jobs";
import { apiUrl, NAMESPACE_PATH } from "@lib/config";
import { cn } from "@eden-ecommerce/lib/utils";
import type { JobHit } from "@lib/algolia/jobs";
import { Bookmark, Loader2 } from "lucide-react";
import useSWR from "swr";

async function fetchSavedJobs(ids: string[]): Promise<JobHit[]> {
  if (ids.length === 0) return [];
  // Raw fetch does not apply Next.js basePath, so build the URL with apiUrl().
  const res = await fetch(apiUrl("/api/saved"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.jobs as JobHit[];
}

function SavedJobCard({
  job,
  onRemoved,
}: {
  job: JobHit;
  onRemoved: (id: string) => void;
}) {
  const { isSaved } = useSavedJobs();

  // Derived directly from saved state: once a job is unsaved it animates out,
  // and onTransitionEnd removes it. No effect/state needed.
  const leaving = !isSaved(job.id);

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-in-out",
        leaving
          ? "scale-90 -rotate-2 opacity-0"
          : "scale-100 rotate-0 opacity-100",
      )}
      onTransitionEnd={() => {
        if (leaving) onRemoved(job.id);
      }}
      aria-hidden={leaving}
    >
      <JobCard job={job} />
    </div>
  );
}

export function SavedJobsPageClient() {
  const { ids, hydrated } = useSavedJobs();

  const { data: jobs, isLoading } = useSWR(
    hydrated && ids.length > 0 ? ["saved-jobs", ...ids] : null,
    () => fetchSavedJobs(ids),
    { revalidateOnFocus: false },
  );

  // Accumulate fetched jobs so a card stays mounted (to animate out) even after
  // it's removed from saved ids. Uses React's "adjust state during render"
  // pattern instead of an effect: when a new `jobs` array arrives, merge any
  // additions immediately during render.
  const [displayed, setDisplayed] = useState<JobHit[]>([]);
  const [lastJobs, setLastJobs] = useState<JobHit[] | undefined>(undefined);

  if (jobs && jobs !== lastJobs) {
    setLastJobs(jobs);
    const seen = new Set(displayed.map((j) => j.id));
    const additions = jobs.filter((j) => !seen.has(j.id));
    if (additions.length > 0) setDisplayed((prev) => [...prev, ...additions]);
  }

  const handleRemoved = (id: string) => {
    setDisplayed((prev) => prev.filter((j) => j.id !== id));
  };

  if (!hydrated || (isLoading && ids.length > 0 && displayed.length === 0)) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        <span className="text-sm">Loading saved jobs...</span>
      </div>
    );
  }

  if (ids.length === 0 && displayed.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Bookmark className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
        </div>
        <div>
          <p className="font-semibold text-foreground">No saved jobs yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tap the bookmark on any job to save it here.
          </p>
        </div>
        <NsLink
          href={NAMESPACE_PATH ?? "/christian-jobs"}
          className="mt-2 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Browse jobs
        </NsLink>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {displayed.map((job) => (
        <SavedJobCard
          key={job.id}
          job={job}
          onRemoved={handleRemoved}
        />
      ))}
    </div>
  );
}
