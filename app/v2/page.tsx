import type { Metadata } from "next";
import { Suspense } from "react";
import { JobsBrowserV2 } from "@components/jobs/browser/v2/JobsBrowserV2";
import { BlogArticleCarousel } from "@components/blog/BlogArticleCarousel";
import { IntegrationEnvError } from "@components/common/IntegrationEnvError";
import { searchJobs, getJobFilterOptions } from "@lib/algolia/jobs";
import { parseJobsUrlState, toSearchJobsParams } from "@lib/jobs/search-params";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Christian Jobs v2 | Eden.co.uk",
  robots: "noindex, nofollow",
};

export default async function ChristianJobsV2Page({
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

  if (!result.configured) {
    return (
      <main className="mx-auto max-w-screen-xl px-4 py-8">
        <IntegrationEnvError integration="algolia" />
      </main>
    );
  }

  return (
    <main>
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
