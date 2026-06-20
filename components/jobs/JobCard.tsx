import { NsLink } from "@components/ns-link";
import { SaveJobButton } from "@components/jobs/SaveJobButton";
import { NAMESPACE_PATH } from "@lib/config";
import type { JobHit } from "@lib/algolia/jobs";
import { locationLine, formatDistance } from "@lib/format";
import { MapPin, Briefcase, Clock, BanknoteIcon } from "lucide-react";

export function JobCard({ job }: { job: JobHit }) {
  const location = locationLine(job);
  const distance = formatDistance(job.distanceMeters);

  const categories = [
    job.categoryLvl0,
    job.categoryLvl1,
    job.categoryLvl2,
  ].filter((c): c is string => Boolean(c));

  // Format posted date
  const postedLabel = (() => {
    if (!job.postedTimestamp) return null;
    const now = Date.now();
    const diffMs = now - job.postedTimestamp;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Posted today";
    if (diffDays === 1) return "Posted yesterday";
    if (diffDays < 7) return `Posted ${diffDays} days ago`;
    if (diffDays < 30) return `Posted ${Math.floor(diffDays / 7)} weeks ago`;
    return `Posted ${Math.floor(diffDays / 30)} months ago`;
  })();

  return (
    <NsLink
      href={`${NAMESPACE_PATH}/job/${job.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Org logo + name row */}
        <div className="flex items-center gap-2">
          {job.organiserLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={job.organiserLogo}
              alt=""
              className="h-8 w-8 shrink-0 rounded-lg border border-border bg-white object-contain p-0.5"
              loading="lazy"
            />
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted">
              <Briefcase className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </div>
          )}
          <span className="min-w-0 flex-1 truncate text-xs font-medium text-muted-foreground">
            {job.organisationName ?? "Christian organisation"}
          </span>
          {job.online ? (
            <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
              Remote
            </span>
          ) : null}
        </div>

        {/* Job title */}
        <h3 className="text-pretty text-base font-semibold leading-snug text-foreground group-hover:text-primary">
          {job.title}
        </h3>

        {/* Category pills */}
        {categories.length > 0 ? (
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            {categories.map((cat) => (
              <span
                key={cat}
                className="inline-flex shrink-0 items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground"
              >
                {cat}
              </span>
            ))}
          </div>
        ) : null}

        {/* Key details */}
        <div className="mt-auto flex flex-col gap-1.5 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate">{location}</span>
          </span>
          {job.jobType ? (
            <span className="inline-flex items-center gap-1.5">
              <Briefcase className="h-4 w-4 shrink-0 text-primary" />
              {job.jobType}
            </span>
          ) : null}
          {job.schedule ? (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 shrink-0 text-primary" />
              {job.schedule}
            </span>
          ) : null}
          {job.salary ? (
            <span className="inline-flex items-center gap-1.5">
              <BanknoteIcon className="h-4 w-4 shrink-0 text-primary" />
              <span className="truncate">{job.salary}</span>
            </span>
          ) : null}
          {distance ? (
            <span className="text-xs text-primary">{distance}</span>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">
            {postedLabel ?? ""}
          </span>
          <div className="flex items-center gap-2">
            <SaveJobButton jobId={job.id} variant="icon" />
            <span className="text-sm font-medium text-primary group-hover:underline">
              View job
            </span>
          </div>
        </div>
      </div>
    </NsLink>
  );
}
