import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { JobsHomepageV5 } from "@components/jobs/browser/v5/JobsHomepageV5";
import { BlogArticleCarousel } from "@components/blog/BlogArticleCarousel";
import {
  isLatestJobsBrowse,
  jobsUrlStateToSearchParams,
  parseJobsUrlState,
} from "@lib/jobs/search-params";
import { jobsSearchPath } from "@lib/jobs/routes";
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

  if (!isLatestJobsBrowse(urlState) || urlState.vjk) {
    const qs = jobsUrlStateToSearchParams(urlState).toString();
    redirect(qs ? `${jobsSearchPath()}?${qs}` : jobsSearchPath());
  }

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Eden", url: "https://www.eden.co.uk" },
    { name: "Christian Jobs", url: "https://www.eden.co.uk/christian-jobs" },
  ]);

  return (
    <main>
      <script {...jsonLdScriptProps(breadcrumbJsonLd)} />
      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading…</p>
          </div>
        }
      >
        <JobsHomepageV5 blogCarousel={<BlogArticleCarousel />} />
      </Suspense>
    </main>
  );
}
