import type { Metadata } from "next";
import { Suspense } from "react";
import { JobsBrowserV2 } from "@components/jobs/browser/v2/JobsBrowserV2";
import { BlogArticleCarousel } from "@components/blog/BlogArticleCarousel";
import { IntegrationEnvError } from "@components/common/IntegrationEnvError";
import {
  searchJobs,
  getJobFilterOptions,
} from "@lib/algolia/jobs";
import {
  parseJobsUrlState,
  toSearchJobsParams,
} from "@lib/jobs/search-params";
import { buildBreadcrumbJsonLd, jsonLdScriptProps } from "@lib/seo/jsonld";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Christian Jobs | Eden.co.uk",
  description:
    "Find meaningful Christian jobs at churches, charities and faith-based organisations across the UK. Employers can list a vacancy for free.",
  alternates: { canonical: "https://www.eden.co.uk/christian-jobs" },
  openGraph: {
    title: "Christian Jobs | Eden.co.uk",
    description:
      "Find meaningful Christian jobs at churches, charities and faith-based organisations across the UK.",
    url: "https://www.eden.co.uk/christian-jobs",
    type: "website",
  },
};

export default async function ChristianJobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const urlState = parseJobsUrlState(sp);
  const searchParams_ = toSearchJobsParams(urlState);

  const [result, facets] = await Promise.all([
    searchJobs(searchParams_),
    getJobFilterOptions(),
  ]);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Eden", url: "https://www.eden.co.uk" },
    { name: "Christian Jobs", url: "https://www.eden.co.uk/christian-jobs" },
  ]);

  if (!result.configured) {
    return (
      <main className="mx-auto max-w-screen-xl px-4 py-8">
        <IntegrationEnvError integration="algolia" />
      </main>
    );
  }

  return (
    <main>
      <script {...jsonLdScriptProps(breadcrumbJsonLd)} />
      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading jobs…</p>
          </div>
        }
      >
        <JobsBrowserV2
          initialResult={result}
          initialFacets={facets}
          blogCarousel={<BlogArticleCarousel />}
        />
      </Suspense>
    </main>
  );
}
