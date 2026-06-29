import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import {
  getArticleBySlug,
  getRelatedArticles,
  articleHref,
} from "@lib/blog";
import { ArticleDetailPage } from "@components/blog/ArticleDetailPage";
import { NAMESPACE_PATH, SITE_URL } from "@lib/config";
import { isSanityEnvConfigured } from "@lib/env-configured.server";
import { IntegrationEnvError } from "@components/common/IntegrationEnvError";
import { Breadcrumbs } from "@components/common/Breadcrumbs";
import { isChristianJobsArticle } from "@lib/blog";

export const dynamic = "force-dynamic";

// The article id (Sanity slug.current) is ALWAYS the last path segment.
// Earlier segments (tag/title) are SEO decoration, so legacy /blog/<id> links
// still resolve and then 308-redirect to the canonical URL.
function articleIdFromSlug(slug: string[]): string {
  return slug[slug.length - 1] ?? "";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(articleIdFromSlug(slug));

  // Don't leak metadata for off-topic or missing articles.
  if (!article || !isChristianJobsArticle(article)) {
    return { title: "Article not found", robots: { index: false } };
  }

  const canonical = `${SITE_URL ?? "https://www.eden.co.uk/christian-jobs"}${articleHref(article)}`;
  const description = article.excerpt ?? undefined;

  return {
    title: article.title,
    description,
    alternates: { canonical },
    openGraph: {
      title: article.title,
      description,
      url: canonical,
      type: "article",
      ...(article.thumbnailUrlHero
        ? { images: [{ url: article.thumbnailUrlHero }] }
        : {}),
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  if (!isSanityEnvConfigured()) {
    return <IntegrationEnvError integration="sanity" />;
  }

  const { slug } = await params;
  const article = await getArticleBySlug(articleIdFromSlug(slug));

  if (!article) notFound();

  if (!isChristianJobsArticle(article)) notFound();

  // Redirect legacy / non-canonical paths to the canonical articleHref URL.
  const canonical = articleHref(article);
  const currentPath = `${NAMESPACE_PATH ?? "/christian-jobs"}/blog/${slug.join("/")}`;
  if (currentPath !== canonical) {
    permanentRedirect(canonical);
  }

  const relatedRaw = await getRelatedArticles(article.slug, article.tags ?? []);
  const relatedArticles = {
    related: relatedRaw.related.filter(isChristianJobsArticle).slice(0, 4),
    latest: relatedRaw.latest.filter(isChristianJobsArticle).slice(0, 5),
  };

  return (
    <>
      <div className="mx-auto max-w-screen-xl px-4 pt-6 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Eden", href: "https://www.eden.co.uk" },
            { label: "Christian Jobs", href: NAMESPACE_PATH ?? "/christian-jobs" },
            { label: "Jobs Blog", href: `${NAMESPACE_PATH ?? "/christian-jobs"}/blog` },
            { label: article.title },
          ]}
        />
      </div>
      <ArticleDetailPage
        article={article}
        relatedArticles={relatedArticles}
      />
    </>
  );
}
