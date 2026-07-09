import type { Metadata } from "next";
import { Suspense } from "react";
import { JobsHomepageV6 } from "@components/jobs/browser/v6/JobsHomepageV6";
import { BlogArticleCarousel } from "@components/blog/BlogArticleCarousel";
import { getJobCategoryFacets } from "@lib/algolia/jobs";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Christian Jobs v6 | Eden.co.uk",
  robots: "noindex, nofollow",
};

export default async function ChristianJobsV6HomePage() {
  const { categories } = await getJobCategoryFacets();

  return (
    <main>
      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading…</p>
          </div>
        }
      >
        <JobsHomepageV6
          categories={categories}
          blogCarousel={<BlogArticleCarousel />}
          resultsPath="/v6/search"
        />
      </Suspense>
    </main>
  );
}
