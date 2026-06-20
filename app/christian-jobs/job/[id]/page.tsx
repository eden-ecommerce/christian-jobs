import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  MapPin,
  Globe,
  Building2,
  Mail,
  BanknoteIcon,
  Briefcase,
  Clock,
  CalendarDays,
  BookOpen,
} from "lucide-react";
import { NsLink } from "@components/ns-link";
import { Breadcrumbs } from "@components/events/Breadcrumbs";
import { JobCard } from "@components/jobs/JobCard";
import { ShareButton } from "@components/events/ShareButton";
import { SaveJobButton } from "@components/jobs/SaveJobButton";
import { PostJobSidebarCta } from "@components/jobs/PromoteJobBanner";
import { HostedByCard } from "@components/events/HostedByCard";
import { getJobById, getOrganisationById, searchJobs } from "@lib/algolia/jobs";
import { validateBrandingColor, pickOrgAccentColor, contrastForeground } from "@lib/org-color";
import { NAMESPACE_PATH } from "@lib/config";
import { buildBreadcrumbJsonLd, jsonLdScriptProps } from "@lib/seo/jsonld";

export const revalidate = 3600;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const job = await getJobById(id);
  if (!job) return { title: "Job not found" };

  const description =
    job.description?.slice(0, 155).replace(/\s+$/, "") || undefined;
  const canonicalUrl = `https://www.eden.co.uk/christian-jobs/job/${job.id}`;

  return {
    title: job.title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: job.title,
      description,
      url: canonicalUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: job.title,
      description,
    },
  };
}

export default async function JobPage({ params }: Props) {
  const { id } = await params;
  const job = await getJobById(id);
  if (!job) notFound();

  const org = job.organisationId
    ? await getOrganisationById(job.organisationId)
    : null;

  // Resolve the best accent colour: validated hex from job hit first,
  // then palette-derived from the org record.
  const accentHex =
    validateBrandingColor(job.organisationBrandingColour) ??
    (org ? pickOrgAccentColor(org.logoPalette, org.bannerPalette) : null);
  const accentFg = accentHex ? contrastForeground(accentHex) : null;

  // Logo URL — prefer org-level logo, fall back to hit-level fields.
  const logoUrl = org?.logoUrl ?? job.logoUrl ?? job.organiserLogo;

  const location = [
    job.locationName,
    job.locationStreet,
    job.locationCity,
    job.locationState,
    job.locationPostalCode,
  ]
    .filter(Boolean)
    .join(", ");

  // Nearby jobs (exclude this one)
  let nearby = [] as Awaited<ReturnType<typeof searchJobs>>["hits"];
  if (typeof job.lat === "number" && typeof job.lng === "number") {
    const res = await searchJobs({
      lat: job.lat,
      lng: job.lng,
      radiusMeters: 80000,
      hitsPerPage: 4,
    });
    nearby = res.hits.filter((j) => j.objectID !== job.objectID).slice(0, 3);
  }

  // Organisation profile link
  const orgHref = job.organisationSlug
    ? `https://www.eden.co.uk/o/${job.organisationSlug}`
    : job.organisationId
      ? `https://www.eden.co.uk/o/${job.organisationId}`
      : null;

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Eden", url: "https://www.eden.co.uk" },
    { name: "Christian Jobs", url: "https://www.eden.co.uk/christian-jobs" },
    { name: "Search", url: "https://www.eden.co.uk/christian-jobs/search" },
    { name: job.title, url: `https://www.eden.co.uk/christian-jobs/job/${job.id}` },
  ]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <script {...jsonLdScriptProps(breadcrumbJsonLd)} />
      <Breadcrumbs
        items={[
          { label: "Christian Jobs", href: NAMESPACE_PATH },
          { label: "Search", href: `${NAMESPACE_PATH}/search` },
          { label: job.title },
        ]}
      />

      <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <article>
          {/* Header */}
          <div className="flex items-start gap-4">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt={job.organisationName ?? ""}
                className="h-16 w-16 shrink-0 rounded-xl border border-border bg-white object-contain p-1"
              />
            ) : (
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-border"
                style={
                  accentHex
                    ? { backgroundColor: accentHex + "18" }
                    : undefined
                }
              >
                <Building2
                  className="h-8 w-8"
                  aria-hidden="true"
                  style={
                    accentHex
                      ? { color: accentHex }
                      : { color: "hsl(var(--muted-foreground) / 0.4)" }
                  }
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-balance text-2xl font-bold text-foreground sm:text-3xl">
                {job.title}
              </h1>
              {job.organisationName && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {orgHref ? (
                    <a
                      href={orgHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:underline"
                      style={accentHex ? { color: accentHex } : undefined}
                    >
                      {job.organisationName}
                    </a>
                  ) : (
                    <span className="font-medium text-foreground">{job.organisationName}</span>
                  )}
                </p>
              )}
            </div>
          </div>

          {/* Category badge */}
          {job.categoryLvl0 && (
            <span
              className="mt-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
              style={
                accentHex && accentFg
                  ? { backgroundColor: accentHex, color: accentFg }
                  : { backgroundColor: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }
              }
            >
              {job.categoryLvl0}
            </span>
          )}

          {/* Organisation card */}
          {job.organisationName && (
            <HostedByCard
              byLabel="Posted by"
              organisationName={job.organisationName}
              organisationType={job.organisationType}
              organiserLogo={job.organiserLogo}
              orgHref={orgHref}
              org={org}
            />
          )}

          {/* Job description */}
          {job.description && (
            <div className="mt-6 border-t border-border pt-6">
              <h2 className="mb-3 text-lg font-semibold text-foreground">
                About this role
              </h2>
              <p className="whitespace-pre-line text-pretty leading-relaxed text-muted-foreground">
                {job.description}
              </p>
            </div>
          )}

          {/* Application instructions */}
          {job.applicationInstructions && (
            <div className="mt-6 border-t border-border pt-6">
              <h2 className="mb-3 text-lg font-semibold text-foreground">
                How to apply
              </h2>
              <p className="whitespace-pre-line text-pretty leading-relaxed text-muted-foreground">
                {job.applicationInstructions}
              </p>
            </div>
          )}
        </article>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-xl border border-border bg-card p-5">
            <dl className="flex flex-col gap-4">
              {/* Salary */}
              <div className="flex items-start gap-3">
                <BanknoteIcon
                  className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Salary
                  </dt>
                  <dd className="text-sm font-medium text-foreground">
                    {job.salary ?? "Not specified"}
                  </dd>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                {job.online ? (
                  <Globe
                    className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                ) : (
                  <MapPin
                    className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                )}
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Location
                  </dt>
                  <dd className="text-sm font-medium text-foreground">
                    {job.online ? "Remote" : location || "See job listing"}
                  </dd>
                </div>
              </div>

              {/* Job type */}
              {job.jobType && (
                <div className="flex items-start gap-3">
                  <Briefcase
                    className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Job type
                    </dt>
                    <dd className="text-sm font-medium text-foreground">
                      {job.jobType}
                    </dd>
                  </div>
                </div>
              )}

              {/* Schedule */}
              {job.schedule && (
                <div className="flex items-start gap-3">
                  <Clock
                    className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Schedule
                    </dt>
                    <dd className="text-sm font-medium text-foreground">
                      {job.schedule}
                    </dd>
                  </div>
                </div>
              )}

              {/* Closing date */}
              {job.closingDate && (
                <div className="flex items-start gap-3">
                  <CalendarDays
                    className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Closes
                    </dt>
                    <dd className="text-sm font-medium text-foreground">
                      {new Date(job.closingDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </dd>
                  </div>
                </div>
              )}

              {/* Application instructions summary */}
              {job.applicationInstructions && (
                <div className="flex items-start gap-3">
                  <BookOpen
                    className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Application instructions
                    </dt>
                    <dd className="mt-0.5 text-sm text-muted-foreground line-clamp-3">
                      {job.applicationInstructions}
                    </dd>
                  </div>
                </div>
              )}
            </dl>

            {/* Apply CTA */}
            <a
              href={job.externalUrl ?? "https://www.eden.co.uk"}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 block w-full rounded-md px-4 py-2.5 text-center text-sm font-semibold transition-opacity hover:opacity-90"
              style={
                accentHex && accentFg
                  ? { backgroundColor: accentHex, color: accentFg }
                  : { backgroundColor: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }
              }
            >
              {job.externalUrl ? "Apply now" : "View on Eden"}
            </a>

            {/* Quick actions */}
            <div className="mt-3 flex flex-col gap-1.5">
              <SaveJobButton jobId={job.id} variant="full" />
              <ShareButton
                url={`https://www.eden.co.uk/christian-jobs/job/${job.id}`}
                title={job.title}
              />
              {orgHref && (
                <a
                  href={orgHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                  Contact employer
                </a>
              )}
            </div>
          </div>
          <PostJobSidebarCta />
        </aside>
      </div>

      {nearby.length > 0 && (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="mb-5 text-xl font-bold text-foreground">
            More jobs nearby
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {nearby.map((j) => (
              <JobCard key={j.objectID} job={j} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
