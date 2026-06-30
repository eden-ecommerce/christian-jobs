import { Briefcase } from "lucide-react";

const POST_JOB_HREF = "https://hub.eden.co.uk/dashboard/job-journey";

/**
 * Compact "Post a vacancy — FREE" pill for the sticky header bar.
 * Hidden on small mobile (sm:inline-flex) to avoid crowding the search row.
 */
export function PostVacancyPill() {
  return (
    <a
      href={POST_JOB_HREF}
      target="_blank"
      rel="noopener noreferrer"
      className="hidden shrink-0 items-center gap-1.5 rounded-full border border-[#2d6a4f] px-3.5 py-1.5 text-xs font-semibold text-[#2d6a4f] transition-colors hover:bg-[#2d6a4f] hover:text-white sm:inline-flex"
    >
      <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
      Post a vacancy — FREE
    </a>
  );
}
