import { JobCard } from "@components/jobs/JobCard";
import { IntegrationEnvError } from "@components/common/IntegrationEnvError";
import { NsLink } from "@components/ns-link";
import { buttonVariants } from "@components/ui/button";
import { NAMESPACE_PATH } from "@lib/config";
import { getJobCategoryFacets, searchJobs } from "@lib/algolia/jobs";
import { PostJobBanner, SavedJobsCard } from "@components/jobs/PromoteJobBanner";
import { buildBreadcrumbJsonLd, jsonLdScriptProps } from "@lib/seo/jsonld";
import type { Metadata } from "next";
import { ArrowRight, Briefcase, Search } from "lucide-react";
import { HomeLocationSearch } from "@components/events/HomeLocationSearch";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Christian Jobs | Eden.co.uk",
  description:
    "Find meaningful Christian jobs at churches, charities and faith-based organisations across the UK. Browse by category or search by location.",
  alternates: { canonical: "https://www.eden.co.uk/christian-jobs" },
  openGraph: {
    title: "Christian Jobs | Eden.co.uk",
    description:
      "Find meaningful Christian jobs at churches, charities and faith-based organisations across the UK.",
    url: "https://www.eden.co.uk/christian-jobs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Christian Jobs | Eden.co.uk",
    description:
      "Find meaningful Christian jobs at churches, charities and faith-based organisations across the UK.",
  },
};

export default async function ChristianJobsHomePage() {
  const [recent, { categories, totalCount, uncategorisedCount }] = await Promise.all([
    searchJobs({ hitsPerPage: 6, sort: "date_desc" }),
    getJobCategoryFacets(),
  ]);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Eden", url: "https://www.eden.co.uk" },
    { name: "Christian Jobs", url: "https://www.eden.co.uk/christian-jobs" },
  ]);

  return (
    <main>
      <script {...jsonLdScriptProps(breadcrumbJsonLd)} />

      {/* Hero */}
      <section className="border-b border-border bg-accent/40">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:py-20">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-primary">
            <Briefcase className="h-3.5 w-3.5" /> UK Christian Jobs Directory
          </span>
          <h1 className="mt-5 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Find meaningful Christian jobs near you
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Roles at churches, charities and faith-based organisations across the
            UK. Search by location or browse by category.
          </p>

          <div className="mx-auto mt-8 max-w-2xl">
            <HomeLocationSearch />
          </div>

          <div className="mt-4">
            <NsLink
              href={`${NAMESPACE_PATH}/search`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <Search className="h-4 w-4" />
              Advanced search
            </NsLink>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Categories */}
        {categories.length > 0 ? (
          <section className="mb-12">
            <h2 className="text-lg font-semibold text-foreground">
              Browse by category
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <NsLink
                href={`${NAMESPACE_PATH}/search`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                See all
                <span className="text-xs text-muted-foreground">{totalCount}</span>
              </NsLink>

              {categories.map((cat) => (
                <NsLink
                  key={cat.value}
                  href={`${NAMESPACE_PATH}/search?category=${encodeURIComponent(cat.value)}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {cat.label}
                  <span className="text-xs text-muted-foreground">{cat.count}</span>
                </NsLink>
              ))}

              {uncategorisedCount > 0 ? (
                <NsLink
                  href={`${NAMESPACE_PATH}/search?uncategorised=true`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  Uncategorised
                  <span className="text-xs text-muted-foreground">{uncategorisedCount}</span>
                </NsLink>
              ) : null}
            </div>
          </section>
        ) : null}

        {/* Post a job + saved jobs CTA */}
        <section className="mb-12">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto]">
            <PostJobBanner />
            <SavedJobsCard />
          </div>
        </section>

        {/* Recent jobs */}
        <section>
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-lg font-semibold text-foreground">
              Latest jobs
            </h2>
            <NsLink
              href={`${NAMESPACE_PATH}/search`}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              See all <ArrowRight className="h-4 w-4" />
            </NsLink>
          </div>

          {recent.hits.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {recent.hits.map((job) => (
                <JobCard key={job.objectID} job={job} />
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-border p-10 text-center">
              {recent.configured ? (
                <p className="text-sm text-muted-foreground">
                  No jobs to show right now. Please check back soon.
                </p>
              ) : (
                <IntegrationEnvError integration="algolia" className="border-0 bg-transparent" />
              )}
              <NsLink
                href={`${NAMESPACE_PATH}/search`}
                className={`${buttonVariants({ variant: "outline" })} mt-4`}
              >
                Search all jobs
              </NsLink>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
