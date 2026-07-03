"use client";

import { useSavedJobs } from "@lib/jobs/use-saved-jobs";
import { jobsNamespacePath } from "@lib/jobs/routes";
import { Bookmark } from "lucide-react";
import { NsLink } from "@components/ns-link";

/** Header link to saved jobs with live count. */
export function SavedJobsHeaderLink() {
  const { ids, hydrated } = useSavedJobs();
  const count = hydrated ? ids.length : 0;

  return (
    <li>
      <NsLink
        href={`${jobsNamespacePath()}/saved`}
        className="inline-flex h-full flex-col items-center gap-0.5 text-primary-900 no-underline"
        aria-label={
          count > 0 ? `${count} saved job${count === 1 ? "" : "s"}` : "Saved jobs"
        }
      >
        <span className="relative leading-none text-primary-900">
          <Bookmark className="size-5 sm:size-6" aria-hidden="true" />
          {count > 0 ? (
            <span className="absolute -right-1.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#235A0E] px-1 text-[10px] font-semibold text-white">
              {count > 9 ? "9+" : count}
            </span>
          ) : null}
        </span>
        <span className="text-xs font-medium">Saved</span>
      </NsLink>
    </li>
  );
}
