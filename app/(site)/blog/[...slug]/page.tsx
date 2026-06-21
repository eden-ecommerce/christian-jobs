import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import {
  getArticleBySlug,
  getArticlesByTag,
  articleHref,
} from "@eden-ecommerce/blog-kit";
import { ArticleDetailPage } from "@eden-ecommerce/blog-kit/components";
import { isSanityEnvConfigured } from "@lib/env-configured.server";
import { IntegrationEnvError } from "@components/common/IntegrationEnvError";
import { Breadcrumbs } from "@components/common/Breadcrumbs";
import { CHRISTIAN_JOBS_TAG, isChristianJobsArticle } from "@lib/blog";

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

  const canonical = `https://www.eden.co.uk/christian-jobs${articleHref(article)}`;
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

  // Tag guard: getArticleBySlug is NOT tag-filtered, so without this anyone
  // could reach any Eden article by guessing its id. This site is
  // christian-jobs-only — anything else is a 404.
  if (!isChristianJobsArticle(article)) notFound();

  // Redirect legacy / non-canonical paths (e.g. /blog/<id>) to the canonical
  // /blog/<tag>/<title>/<id> URL. articleHref returns a namespace-relative path;
  // Next.js basePath prepends /christian-jobs automatically (do NOT add it here).
  const canonical = articleHref(article);
  if (`/blog/${slug.join("/")}` !== canonical) {
    permanentRedirect(canonical);
  }

  // Related reading scoped to the same tag. getRelatedArticles' "latest" list
  // spans all tags, so we build the cross-promotion set from the tag-scoped
  // article list to keep every link on-topic.
  const tagArticles = await getArticlesByTag(CHRISTIAN_JOBS_TAG);
  const others = tagArticles.filter((a) => a.slug !== article.slug);
  const relatedArticles = {
    related: others.slice(0, 4),
    latest: others.slice(4, 9),
  };

  return (
    <>
      <div className="mx-auto max-w-screen-xl px-4 pt-6 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Eden", href: "https://www.eden.co.uk" },
            { label: "Christian Jobs", href: "/" },
            { label: "Jobs Blog", href: "/blog" },
            { label: article.title },
          ]}
        />
      </div>
      <ArticleDetailPage
        article={article}
        relatedArticles={relatedArticles}
        carouselProductMap={new Map()}
      />
    </>
  );
}
