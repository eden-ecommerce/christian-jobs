import type { Metadata } from "next";
import { Suspense } from "react";
import { JobsHomepageV3 } from "@components/jobs/browser/v3/JobsHomepageV3";
import { BlogArticleCarousel } from "@components/blog/BlogArticleCarousel";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Christian Jobs v3 | Eden.co.uk",
  robots: "noindex, nofollow",
};

export default function ChristianJobsV3HomePage() {
  return (
    <main>
      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading…</p>
          </div>
        }
      >
        <JobsHomepageV3 blogCarousel={<BlogArticleCarousel />} />
      </Suspense>
    </main>
  );
}
