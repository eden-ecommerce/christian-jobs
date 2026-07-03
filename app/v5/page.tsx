import type { Metadata } from "next";
import { Suspense } from "react";
import { JobsHomepageV5 } from "@components/jobs/browser/v5/JobsHomepageV5";
import { BlogArticleCarousel } from "@components/blog/BlogArticleCarousel";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Christian Jobs v5 | Eden.co.uk",
  robots: "noindex, nofollow",
};

export default function ChristianJobsV5HomePage() {
  return (
    <main>
      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading…</p>
          </div>
        }
      >
        <JobsHomepageV5
          blogCarousel={<BlogArticleCarousel />}
          resultsPath="/v5/search"
        />
      </Suspense>
    </main>
  );
}
