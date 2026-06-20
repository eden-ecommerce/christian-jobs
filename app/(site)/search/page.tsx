import type { Metadata } from "next";
import { Search } from "lucide-react";
import { NsLink } from "@components/ns-link";
import { IntegrationEnvError } from "@components/common/IntegrationEnvError";
import { Breadcrumbs } from "@components/events/Breadcrumbs";
import { JobCard } from "@components/jobs/JobCard";
import { JobSearchFilters } from "@components/jobs/JobSearchFilters";
import { JobsActiveFilterBar } from "@components/jobs/JobsActiveFilterBar";
import { SearchPagination } from "@components/events/SearchPagination";
import { PostJobBanner, SavedJobsCard } from "@components/jobs/PromoteJobBanner";
import {
  searchJobs,
  type JobSort,
  type SearchJobsParams,
} from "@lib/algolia/jobs";
import { DEFAULT_LOCATION_RADIUS_METERS } from "@lib/algolia/constants";
import { buildBreadcrumbJsonLd, jsonLdScriptProps } from "@lib/seo/jsonld";

type SearchParams = Record<string, string | string[] | undefined>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const query = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  const category = Array.isArray(sp.category) ? sp.category[0] : sp.category;
  const place = Array.isArray(sp.place) ? sp.place[0] : sp.place;
  const hasFilters = !!(query || category || place || sp.org);

  const title = place
    ? `Christian jobs near ${place}`
    : query
      ? `"${query}" — Christian jobs`
      : category
        ? `${category} Christian jobs`
        : "Search Christian jobs";

  const description = place
    ? `Browse Christian jobs near ${place} — churches, charities and faith-based organisations.`
    : "Search Christian jobs across the UK by location, category or organisation.";

  return {
    title,
    description,
    ...(hasFilters
      ? { robots: { index: false, follow: true } }
      : {
          alternates: { canonical: "https://www.eden.co.uk/christian-jobs/search" },
          openGraph: {
            title,
            description,
            url: "https://www.eden.co.uk/christian-jobs/search",
            type: "website",
          },
        }),
  };
}

function one(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function JobSearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const query = one(sp.q) ?? "";
  const place = one(sp.place) ?? "";
  const latRaw = one(sp.lat);
  const lngRaw = one(sp.lng);
  const category = one(sp.category);
  const uncategorisedRaw = one(sp.uncategorised);
  const org = one(sp.org);
  const onlineRaw = one(sp.online);
  const radiusRaw = one(sp.radius);
  const pageRaw = one(sp.page);
  const sortRaw = one(sp.sort) as JobSort | undefined;

  const lat = latRaw ? Number(latRaw) : undefined;
  const lng = lngRaw ? Number(lngRaw) : undefined;
  const hasGeo =
    typeof lat === "number" &&
    Number.isFinite(lat) &&
    typeof lng === "number" &&
    Number.isFinite(lng);

  const page = pageRaw ? Math.max(0, Number(pageRaw) - 1) : 0;
  const sort: JobSort = sortRaw ?? (hasGeo ? "distance" : "relevance");

  const params: SearchJobsParams = {
    query,
    category,
    uncategorised: uncategorisedRaw === "true" ? true : undefined,
    organisationType: org,
    sort,
    page,
    hitsPerPage: 12,
  };
  if (hasGeo) {
    params.lat = lat;
    params.lng = lng;
    params.radiusMeters = radiusRaw ? Number(radiusRaw) : DEFAULT_LOCATION_RADIUS_METERS;
  }
  if (onlineRaw === "true") params.online = true;
  if (onlineRaw === "false") params.online = false;

  const result = await searchJobs(params);

  const headline = place
    ? `Jobs near ${place}`
    : query
      ? `Results for "${query}"`
      : uncategorisedRaw === "true"
        ? "Uncategorised jobs"
        : "All Christian jobs";

  if (!result.configured) {
    return (
      <main className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[{ label: "Christian Jobs", href: "/" }, { label: "Search" }]}
        />
        <div className="mt-8">
          <IntegrationEnvError integration="algolia" />
        </div>
      </main>
    );
  }

  const noResults = result.hits.length === 0;

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Eden", url: "https://www.eden.co.uk" },
    { name: "Christian Jobs", url: "https://www.eden.co.uk/christian-jobs" },
    { name: "Search", url: "https://www.eden.co.uk/christian-jobs/search" },
  ]);

  return (
    <main className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6 lg:px-8">
      <script {...jsonLdScriptProps(breadcrumbJsonLd)} />
      <Breadcrumbs
        items={[{ label: "Christian Jobs", href: "/" }, { label: "Search" }]}
      />

      <div className="mt-4 flex flex-col gap-1">
        <h1 className="text-pretty text-2xl font-bold text-foreground sm:text-3xl">
          {headline}
        </h1>
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          {result.nbHits.toLocaleString()}{" "}
          {result.nbHits === 1 ? "job" : "jobs"} found
        </p>
      </div>

      <div className="mt-3">
        <JobsActiveFilterBar />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto]">
        <PostJobBanner />
        <SavedJobsCard />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        <JobSearchFilters
          categories={result.facets.categories}
          categoryLvl1={result.facets.categoryLvl1}
          categoryLvl2={result.facets.categoryLvl2}
          categoryLvl3={result.facets.categoryLvl3}
          categoryLvl4={result.facets.categoryLvl4}
          organisationTypes={result.facets.organisationTypes}
          hasGeo={hasGeo}
        />

        <div className="min-w-0">
          {noResults ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center">
              <Search
                className="h-8 w-8 text-muted-foreground"
                aria-hidden="true"
              />
              <p className="text-base font-medium text-foreground">
                No jobs match your search
              </p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Try widening your distance, clearing filters, or browsing all
                categories instead.
              </p>
              <NsLink
                href="/"
                className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Browse all jobs
              </NsLink>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {result.hits.map((job) => (
                  <JobCard key={job.objectID} job={job} />
                ))}
              </div>
              <SearchPagination
                page={result.page}
                nbPages={result.nbPages}
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
