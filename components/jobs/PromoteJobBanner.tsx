"use client";

import { useSavedJobs } from "@lib/jobs/use-saved-jobs";
import { ArrowRight, Bookmark, Briefcase } from "lucide-react";
import Link from "next/link";
import { NAMESPACE_PATH } from "@lib/config";

const POST_JOB_HREF = "https://hub.eden.co.uk/dashboard/job-journey";

/**
 * CTA encouraging employers to post a job for free.
 */
export function PostJobBanner() {
  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 px-6 py-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Briefcase
            className="mt-0.5 h-5 w-5 shrink-0 text-primary"
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-semibold text-foreground">
              Post a job vacancy — it&apos;s free
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Reach thousands of Christians looking for meaningful work. Add
              your vacancy to the Eden directory in minutes.
            </p>
          </div>
        </div>
        <a
          href={POST_JOB_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Post a vacancy
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

/**
 * Card showing the number of saved jobs, links to the saved jobs page.
 */
export function SavedJobsCard() {
  const { ids } = useSavedJobs();
  const count = ids.length;

  return (
    <Link
      href={`${NAMESPACE_PATH}/saved`}
      className="flex flex-col justify-between rounded-xl border border-primary/20 bg-primary/5 px-6 py-5 transition-colors hover:border-primary/40 hover:bg-primary/10"
    >
      <div className="flex items-start gap-3">
        <span className="relative mt-0.5 shrink-0">
          <Bookmark
            className="h-5 w-5 fill-primary text-primary"
            aria-hidden="true"
          />
          {count > 0 ? (
            <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold tabular-nums text-primary-foreground">
              {count}
            </span>
          ) : null}
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">
            Your saved jobs
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {count === 0 ? (
              "Tap the bookmark on any job to save it here."
            ) : (
              <>
                You have{" "}
                <span className="font-medium text-primary">
                  {count} {count === 1 ? "job" : "jobs"}
                </span>{" "}
                saved.
              </>
            )}
          </p>
        </div>
      </div>
      <p className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
        {count === 0 ? "View saved jobs" : "View saved jobs"}{" "}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </p>
    </Link>
  );
}

/**
 * Compact sidebar variant for the job detail page aside panel.
 */
export function PostJobSidebarCta() {
  return (
    <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
        Hiring?
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        List your vacancy for free and reach thousands of Christian job seekers.
      </p>
      <a
        href={POST_JOB_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        Post a vacancy — free
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
  );
}
