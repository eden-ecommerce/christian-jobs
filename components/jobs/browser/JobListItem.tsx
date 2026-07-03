"use client";

import { SaveJobButton } from "@components/jobs/SaveJobButton";
import { useImminentClosingLabel } from "@hooks/jobs/use-imminent-closing-label";
import { usePostedLabel } from "@hooks/jobs/use-posted-label";
import type { JobHit } from "@lib/algolia/jobs";
import {
  formatSalary,
  hasDisplayableSalary,
  humaniseJobType,
  jobLocationLine,
} from "@lib/jobs/format-job";
import { getAvatarColor, getOrgInitials } from "@lib/jobs/org-avatar";
import { validateBrandingColor } from "@lib/org-color";
import { Banknote, MapPin } from "lucide-react";

type Props = {
  job: JobHit;
  selected: boolean;
  onSelect: (jobId: string) => void;
  onPrefetch?: (jobId: string) => void;
  /** Card variant for list; compact for carousels; v3 for homepage editorial cards */
  variant?: "card" | "compact" | "v3";
  /** Equal-height layout for horizontal carousels only */
  matchHeight?: boolean;
};

/** Selectable job card for the results list. */
export function JobListItem({
  job,
  selected,
  onSelect,
  onPrefetch,
  variant = "card",
  matchHeight = false,
}: Props) {
  const logoUrl = job.logoUrl ?? job.organiserLogo ?? job.thumbnailUrl;
  const orgName = job.organisationName ?? "Christian organisation";
  const accentHex = validateBrandingColor(job.organisationBrandingColour);
  const avatarColor = getAvatarColor(orgName, accentHex);
  const initials = getOrgInitials(orgName);
  const location = jobLocationLine(job);
  const postedLabel = usePostedLabel(job.postedTimestamp);
  const closingLabel = useImminentClosingLabel(job);
  const contractLabel = job.jobType ? humaniseJobType(job.jobType) : null;
  const workLabel = job.online ? "Remote" : "Onsite";
  const showSalary = hasDisplayableSalary(job.salary);

  const isCard = variant === "card" || variant === "v3";
  const isV3 = variant === "v3";

  return (
    <article
      role="button"
      tabIndex={0}
      aria-current={selected ? "true" : undefined}
      onClick={() => onSelect(job.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(job.id);
        }
      }}
      onMouseEnter={() => onPrefetch?.(job.id)}
      onFocus={() => onPrefetch?.(job.id)}
      className={`relative cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d6a4f]/30 ${
        isV3
          ? `${matchHeight ? "flex h-full w-full flex-col " : ""}rounded-[20px] bg-white p-4 shadow-[0_4px_24px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] ${
              selected ? "ring-2 ring-[#235A0E]" : ""
            }`
          : isCard
          ? `${matchHeight ? "flex h-full w-full flex-col " : ""}rounded-2xl bg-white p-4 shadow-soft hover:shadow-[0_6px_24px_rgba(0,0,0,0.07)] ${
              selected
                ? "border-2 border-[#2d6a4f]"
                : "border border-[#E5E7EB]"
            }`
          : `border-b border-[#E5E7EB] bg-white px-4 py-4 ${
              selected ? "border-l-4 border-l-[#2d6a4f] bg-[#2d6a4f]/5" : ""
            }`
      }`}
    >
      <div className="absolute right-3 top-3">
        <SaveJobButton jobId={job.id} variant="icon" />
      </div>

      <div className={`flex gap-3 pr-8${matchHeight ? " flex-1" : ""}`}>
        <div className="shrink-0">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={`${orgName} logo`}
              className="h-11 w-11 rounded-[4px] border border-[#E5E7EB] bg-white object-contain p-0.5"
              loading="lazy"
            />
          ) : (
            <div
              className="flex h-11 w-11 items-center justify-center rounded-[4px] text-xs font-bold text-white"
              style={{ backgroundColor: avatarColor }}
              aria-hidden="true"
            >
              {initials}
            </div>
          )}
        </div>

        <div className={`min-w-0 flex-1${matchHeight ? " flex flex-col" : ""}`}>
          <h3 className="text-pretty text-[15px] font-bold leading-snug text-foreground line-clamp-2">
            {job.title}
          </h3>
          <p className="mt-0.5 truncate text-sm font-medium text-[#2d6a4f]">
            {orgName}
          </p>

          <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{location}</span>
            </span>
            {showSalary ? (
              <span className="inline-flex items-center gap-1.5">
                <Banknote className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{formatSalary(job.salary)}</span>
              </span>
            ) : null}
          </div>

          <div
            className={
              matchHeight
                ? "mt-auto flex flex-wrap gap-1.5 pt-2.5"
                : "mt-2.5 flex flex-wrap gap-1.5"
            }
          >
            {contractLabel ? (
              <span className="inline-flex rounded-full bg-[#F3F4F6] px-2.5 py-0.5 text-[11px] font-medium text-foreground">
                {contractLabel}
              </span>
            ) : null}
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                job.online
                  ? "bg-[#2d6a4f]/10 text-[#2d6a4f]"
                  : "bg-[#F3F4F6] text-foreground"
              }`}
            >
              {workLabel}
            </span>
            {postedLabel ? (
              <span className="inline-flex rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-[11px] font-medium text-[#92400E]">
                {postedLabel.replace("Posted ", "")}
              </span>
            ) : null}
            {closingLabel ? (
              <span className="inline-flex rounded-full bg-[#FEE2E2] px-2.5 py-0.5 text-[11px] font-semibold text-[#B91C1C]">
                {closingLabel}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
