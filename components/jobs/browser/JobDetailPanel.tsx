"use client";

import { ShareButton } from "@components/events/ShareButton";
import { JobListItem } from "@components/jobs/browser/JobListItem";
import { SaveJobButton } from "@components/jobs/SaveJobButton";
import { usePostedLabel } from "@hooks/jobs/use-posted-label";
import type { JobHit } from "@lib/algolia/jobs";
import type { OrganisationHit } from "@lib/algolia/organisations";
import {
  formatJobDescriptionHtml,
  formatSalary,
  getClosingUrgency,
  hasDisplayableSalary,
  humaniseJobType,
  jobLocationLine,
} from "@lib/jobs/format-job";
import { getAvatarColor, getOrgInitials } from "@lib/jobs/org-avatar";
import {
  validateBrandingColor,
  pickOrgAccentColor,
  contrastForeground,
} from "@lib/org-color";
import { SITE_URL } from "@lib/config";
import {
  Banknote,
  Briefcase,
  Building2,
  CalendarDays,
  Check,
  ExternalLink,
  Globe,
  Loader2,
  MapPin,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type JobDetailData = {
  job: JobHit;
  organisation: OrganisationHit | null;
  similarJobs: JobHit[];
};

type Props = {
  data: JobDetailData | null;
  loading: boolean;
  error?: string | null;
  selectedId?: string;
  onSelectSimilar?: (jobId: string) => void;
  onPrefetch?: (jobId: string) => void;
  /** Page scrolls through detail content — no nested scroll trap (V3 split layout). */
  scrollWithPage?: boolean;
};

function MetaCell({
  icon,
  label,
  value,
  valueClassName,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-[#2d6a4f]">{icon}</span>
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p
          className={`text-sm font-semibold text-foreground${valueClassName ? ` ${valueClassName}` : ""}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

/** Right-pane job detail card. */
export function JobDetailPanel({
  data,
  loading,
  error,
  selectedId,
  onSelectSimilar,
  onPrefetch,
  scrollWithPage = false,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const postedLabel = usePostedLabel(data?.job.postedTimestamp ?? null);
  const [now] = useState(() => Date.now());
  const closingUrgency = data?.job
    ? getClosingUrgency(data.job, now)
    : null;

  useEffect(() => {
    if (data?.job.id && panelRef.current) {
      panelRef.current.focus({ preventScroll: true });
    }
    if (data?.job.id && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [data?.job.id, scrollWithPage]);

  const emptyShellClass = scrollWithPage
    ? "flex min-h-[280px] items-center justify-center rounded-2xl bg-white p-8 text-center shadow-soft"
    : "flex h-full items-center justify-center rounded-2xl bg-white p-8 text-center shadow-soft";

  if (!selectedId && !loading) {
    return (
      <div className={emptyShellClass}>
        <div>
          <Briefcase
            className="mx-auto h-12 w-12 text-muted-foreground/40"
            aria-hidden="true"
          />
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            Select a job to view details
          </p>
        </div>
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div
        className={
          scrollWithPage
            ? "flex min-h-[280px] items-center justify-center rounded-2xl bg-white shadow-soft"
            : "flex h-full items-center justify-center rounded-2xl bg-white shadow-soft"
        }
      >
        <Loader2
          className="h-8 w-8 animate-spin text-[#2d6a4f]"
          aria-label="Loading job details"
        />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={emptyShellClass}>
        <p className="text-sm text-destructive">
          {error ?? "Unable to load job details. Please try again."}
        </p>
      </div>
    );
  }

  const { job, organisation, similarJobs } = data;
  const orgName = job.organisationName ?? "Christian organisation";
  const accentHex =
    validateBrandingColor(job.organisationBrandingColour) ??
    (organisation
      ? pickOrgAccentColor(organisation.logoPalette, organisation.bannerPalette)
      : null);
  const accentFg = accentHex ? contrastForeground(accentHex) : null;
  const avatarColor = getAvatarColor(orgName, accentHex);
  const initials = getOrgInitials(orgName);
  const logoUrl =
    organisation?.logoUrl ?? job.logoUrl ?? job.organiserLogo ?? job.thumbnailUrl;
  const location = jobLocationLine(job);

  const orgHref = job.organisationSlug
    ? `https://www.eden.co.uk/o/${job.organisationSlug}`
    : job.organisationId
      ? `https://www.eden.co.uk/o/${job.organisationId}`
      : null;

  const shareUrl = `${SITE_URL}?vjk=${job.id}`;

  const orgDescription =
    organisation?.description ?? organisation?.mission ?? null;

  const panelShellClass = scrollWithPage
    ? "flex flex-col rounded-2xl bg-white shadow-soft outline-none"
    : "flex h-full min-h-0 flex-col overflow-hidden rounded-2xl bg-white shadow-soft outline-none";
  const panelBodyClass = scrollWithPage
    ? "p-6"
    : "min-h-0 flex-1 overflow-y-auto overscroll-contain p-6";

  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      className={panelShellClass}
      aria-label={`Job details: ${job.title}`}
    >
      <div ref={scrollRef} className={panelBodyClass}>
        {/* Header: logo, title, and actions on one row */}
        <header className="flex items-start gap-3">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={`${orgName} logo`}
              className="h-14 w-14 shrink-0 rounded-[4px] border border-[#E5E7EB] bg-white object-contain p-1"
            />
          ) : (
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[4px] text-base font-bold text-white"
              style={{ backgroundColor: avatarColor }}
              aria-hidden="true"
            >
              {initials}
            </div>
          )}

          <div className="min-w-0 flex-1">
            {closingUrgency?.isImminent ? (
              <span className="mb-1.5 inline-flex rounded-full bg-[#FEE2E2] px-2.5 py-0.5 text-[11px] font-semibold text-[#B91C1C]">
                {closingUrgency.label}
              </span>
            ) : null}
            <h1 className="text-balance text-xl font-bold leading-snug text-foreground sm:text-2xl">
              {job.title}
            </h1>
            {orgHref ? (
              <a
                href={orgHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 inline-block text-sm font-semibold text-[#2d6a4f] hover:underline"
              >
                {orgName}
              </a>
            ) : (
              <p className="mt-0.5 text-sm font-semibold text-[#2d6a4f]">
                {orgName}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-0.5">
            <SaveJobButton jobId={job.id} variant="icon" />
            <ShareButton url={shareUrl} title={job.title} variant="icon" />
            {job.externalUrl ? (
              <a
                href={job.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open external application link"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-[#F3F4F6] hover:text-foreground"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : null}
          </div>
        </header>

        {/* Metadata grid */}
        <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 sm:grid-cols-3">
          <MetaCell
            icon={<MapPin className="h-4 w-4" aria-hidden="true" />}
            label="Location"
            value={location}
          />
          {hasDisplayableSalary(job.salary) ? (
            <MetaCell
              icon={<Banknote className="h-4 w-4" aria-hidden="true" />}
              label="Salary"
              value={formatSalary(job.salary)}
            />
          ) : null}
          {job.jobType ? (
            <MetaCell
              icon={<Briefcase className="h-4 w-4" aria-hidden="true" />}
              label="Job Type"
              value={humaniseJobType(job.jobType)}
            />
          ) : null}
          <MetaCell
            icon={<Globe className="h-4 w-4" aria-hidden="true" />}
            label="Work Style"
            value={job.online ? "Remote" : "Onsite"}
          />
          {postedLabel ? (
            <MetaCell
              icon={<CalendarDays className="h-4 w-4" aria-hidden="true" />}
              label="Date Posted"
              value={postedLabel.replace("Added ", "")}
            />
          ) : null}
          {closingUrgency?.isImminent ? (
            <MetaCell
              icon={<CalendarDays className="h-4 w-4" aria-hidden="true" />}
              label="Closing Date"
              value={closingUrgency.label}
              valueClassName="text-[#B91C1C]"
            />
          ) : null}
          {job.categoryLvl0 ? (
            <MetaCell
              icon={<Building2 className="h-4 w-4" aria-hidden="true" />}
              label="Category"
              value={job.categoryLvl0}
            />
          ) : null}
        </dl>

        {job.categoryLvl0 ? (
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#2d6a4f] px-4 py-2 text-sm font-semibold text-white">
            <Building2 className="h-4 w-4" aria-hidden="true" />
            {job.categoryLvl0}
          </div>
        ) : null}

        {/* Apply CTA */}
        <a
          href={job.externalUrl ?? "https://www.eden.co.uk"}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Apply for ${job.title} at ${orgName}`}
          className="mt-5 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-bold transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#235A0E", color: "#ffffff" }}
        >
          Apply Now
        </a>

        {/* Description */}
        {job.description ? (
          <section className="mt-8">
            <h2 className="mb-3 text-base font-bold text-foreground">
              About this Role
            </h2>
            <div
              className="prose prose-sm max-w-none text-muted-foreground prose-headings:font-bold prose-li:marker:text-[#2d6a4f]"
              dangerouslySetInnerHTML={{
                __html: formatJobDescriptionHtml(job.description),
              }}
            />
          </section>
        ) : null}

        {job.applicationInstructions ? (
          <section className="mt-8">
            <h2 className="mb-3 text-base font-bold text-foreground">
              How to Apply
            </h2>
            <ul className="space-y-2">
              {job.applicationInstructions
                .split(/\n+/)
                .filter(Boolean)
                .map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#2d6a4f]"
                      aria-hidden="true"
                    />
                    {line}
                  </li>
                ))}
            </ul>
          </section>
        ) : null}

        {orgDescription ? (
          <section className="mt-8 border-t border-[#E5E7EB] pt-8">
            <h2 className="mb-3 text-base font-bold text-foreground">
              About the Organisation
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {orgDescription}
            </p>
          </section>
        ) : null}

        {similarJobs.length > 0 && onSelectSimilar ? (
          <section className="mt-8 border-t border-[#E5E7EB] pt-8">
            <h2 className="mb-4 text-base font-bold text-foreground">
              Similar Jobs
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {similarJobs.map((similar) => (
                <div key={similar.objectID} className="w-72 shrink-0">
                  <JobListItem
                    job={similar}
                    selected={false}
                    onSelect={onSelectSimilar}
                    onPrefetch={onPrefetch}
                    variant="card"
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
