import type { Metadata } from "next";
import { Suspense } from "react";
import { JobsHomepageV7 } from "@components/jobs/browser/v7/JobsHomepageV7";
import { BlogArticleCarousel } from "@components/blog/BlogArticleCarousel";
import { getJobCategoryFacets } from "@lib/algolia/jobs";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Christian Jobs v7 | Eden.co.uk",
  robots: "noindex, nofollow",
};

export default async function ChristianJobsV7HomePage() {
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
        <JobsHomepageV7
          categories={categories}
          blogCarousel={<BlogArticleCarousel />}
          resultsPath="/v7/search"
        />
      </Suspense>
    </main>
  );
}
