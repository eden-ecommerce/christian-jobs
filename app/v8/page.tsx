import type { Metadata } from "next";
import { Suspense } from "react";
import { JobsHomepageV8 } from "@components/jobs/browser/v8/JobsHomepageV8";
import { BlogArticleCarousel } from "@components/blog/BlogArticleCarousel";
import { getJobCategoryFacets } from "@lib/algolia/jobs";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Christian Jobs v8 | Eden.co.uk",
  robots: "noindex, nofollow",
};

export default async function ChristianJobsV8HomePage() {
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
        <JobsHomepageV8
          categories={categories}
          blogCarousel={<BlogArticleCarousel />}
          resultsPath="/v8/search"
        />
      </Suspense>
    </main>
  );
}
