"use client";

import { NsLink } from "@components/ns-link";
import { SaveJobButton } from "@components/jobs/SaveJobButton";
import { usePostedLabel } from "@hooks/jobs/use-posted-label";
import { NAMESPACE_PATH } from "@lib/config";
import type { JobHit } from "@lib/algolia/jobs";
import { locationLine, formatDistance } from "@lib/format";
import { validateBrandingColor } from "@lib/org-color";
import { MapPin, BanknoteIcon, Clock, CalendarDays } from "lucide-react";

export function JobCard({ job }: { job: JobHit }) {
  const location = locationLine(job);
  const distance = formatDistance(job.distanceMeters);
  const postedLabel = usePostedLabel(job.postedTimestamp);

  // Closing date label
  const closesLabel = (() => {
    if (!job.closingDate) return null;
    const d = new Date(job.closingDate);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Europe/London",
    });
  })();

  // Split camelCase/PascalCase into spaced words: "partTime" -> "Part Time"
  const humanise = (s: string) =>
    s
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (c) => c.toUpperCase());

  // Badge list — jobType is primary, schedule is secondary
  const badges: { label: string; primary: boolean }[] = [
    job.jobType ? { label: humanise(job.jobType), primary: true } : null,
    job.schedule ? { label: humanise(job.schedule), primary: false } : null,
  ].filter((b): b is { label: string; primary: boolean } => b !== null);

  const accentHex = validateBrandingColor(job.organisationBrandingColour);
  const logoUrl = job.logoUrl ?? job.organiserLogo ?? job.thumbnailUrl;

  // Trim description to ~120 chars
  const snippet =
    job.description && job.description.length > 120
      ? job.description.slice(0, 120).trimEnd() + "…"
      : job.description ?? null;

  return (
    <NsLink
      href={`${NAMESPACE_PATH}/job/${job.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex flex-1 flex-col gap-3 p-4">

        {/* Top row: logo + title block + bookmark */}
        <div className="flex items-start gap-3">
          {/* Logo */}
          <div className="shrink-0">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt=""
                className="h-12 w-12 rounded-xl border border-border bg-white object-contain p-0.5"
                loading="lazy"
              />
            ) : (
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-border text-sm font-bold uppercase text-white"
                style={
                  accentHex
                    ? { backgroundColor: accentHex }
                    : { backgroundColor: "hsl(var(--primary))" }
                }
                aria-hidden="true"
              >
                {(job.organisationName ?? "?").charAt(0)}
              </div>
            )}
          </div>

          {/* Title + org */}
          <div className="min-w-0 flex-1">
            <h3 className="text-pretty text-base font-bold leading-snug text-foreground group-hover:text-primary line-clamp-2">
              {job.title}
            </h3>
            <p className="mt-0.5 truncate text-sm text-muted-foreground">
              {job.organisationName ?? "Christian organisation"}
            </p>
          </div>

          {/* Bookmark */}
          <div className="shrink-0">
            <SaveJobButton jobId={job.id} variant="icon" />
          </div>
        </div>

        {/* Meta rows */}
        <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
          {(location || distance) && (
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground/70" aria-hidden="true" />
              <span className="truncate">{distance ? `${location} · ${distance}` : location}</span>
            </span>
          )}
          {job.salary && (
            <span className="inline-flex items-center gap-2">
              <BanknoteIcon className="h-4 w-4 shrink-0 text-muted-foreground/70" aria-hidden="true" />
              <span className="truncate">{job.salary}</span>
            </span>
          )}
          {job.schedule && (
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-muted-foreground/70" aria-hidden="true" />
              {job.schedule}
            </span>
          )}
          {postedLabel && (
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground/70" aria-hidden="true" />
              {postedLabel}
            </span>
          )}
          {closesLabel && (
            <span className="text-sm text-muted-foreground">
              Closes: {closesLabel}
            </span>
          )}
        </div>

        {/* Description snippet */}
        {snippet && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {snippet}
          </p>
        )}

        {/* Type badges */}
        {badges.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2 pt-1">
            {badges.map(({ label, primary }) =>
              primary ? (
                <span
                  key={label}
                  className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white"
                  style={
                    accentHex
                      ? { backgroundColor: accentHex }
                      : { backgroundColor: "hsl(var(--primary))" }
                  }
                >
                  {label}
                </span>
              ) : (
                <span
                  key={label}
                  className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground"
                >
                  {label}
                </span>
              )
            )}
          </div>
        )}
      </div>
    </NsLink>
  );
}
