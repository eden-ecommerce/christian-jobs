import type { Metadata } from "next";
import { getArticlesByTag } from "@eden-ecommerce/blog-kit";
import { BlogListingPage } from "@eden-ecommerce/blog-kit/components";
import { isSanityEnvConfigured } from "@lib/env-configured.server";
import { IntegrationEnvError } from "@components/common/IntegrationEnvError";
import { CHRISTIAN_JOBS_TAG } from "@lib/blog";

export const dynamic = "force-dynamic";

const CANONICAL = "https://www.eden.co.uk/christian-jobs/blog";

export const metadata: Metadata = {
  title: "Christian Jobs Articles & Career Advice",
  description:
    "Articles, guidance and inspiration for finding meaningful Christian jobs and building a career in churches, charities and faith-based organisations.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Christian Jobs Articles & Career Advice",
    description:
      "Articles, guidance and inspiration for finding meaningful Christian jobs across the UK.",
    url: CANONICAL,
    type: "website",
  },
};

export default async function BlogPage() {
  if (!isSanityEnvConfigured()) {
    return <IntegrationEnvError integration="sanity" />;
  }

  // Christian-jobs-only site: fetch by the single tag and pass tags={[]} so the
  // BlogListingPage hides its category filter (it only renders when tags > 0).
  const articles = await getArticlesByTag(CHRISTIAN_JOBS_TAG);

  return (
    <BlogListingPage
      articles={articles}
      tags={[]}
      activeTag={null}
      heading="Christian Jobs Articles"
      description="Advice, encouragement and inspiration for your calling — from finding the right role to thriving in Christian ministry and charity work."
    />
  );
}
