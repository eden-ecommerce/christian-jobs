import { type Article } from "@lib/blog/get-articles";
import { NAMESPACE_PATH } from "@lib/config";
import { ArticleCard } from "@components/blog/ArticleCard";
import Link from "next/link";

type RelatedArticlesProps = {
  latest: Article[];
  related: Article[];
  /** Tags of the current article, used to label/link the related section. */
  tags: string[];
};

export function RelatedArticles({ latest, related, tags }: RelatedArticlesProps) {
  if (latest.length === 0 && related.length === 0) return null;

  const relatedTag = tags[0] ?? null;

  const blogPath = `${NAMESPACE_PATH ?? "/christian-jobs"}/blog`;

  return (
    <section
      aria-label="More articles"
      className="max-w-5xl mx-auto px-4 sm:px-6 py-12 border-t border-border"
    >
      {related.length > 0 && (
        <div className="mb-12">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-6">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              Related reading
            </h2>
            {relatedTag && (
              <Link
                href={`${blogPath}?tag=${encodeURIComponent(relatedTag)}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                More on {relatedTag}
              </Link>
            )}
          </div>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((article) => (
              <ArticleCard key={article.id} article={article} compact />
            ))}
          </div>
        </div>
      )}

      {latest.length > 0 && (
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-6">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              Latest articles
            </h2>
            <Link
              href={blogPath}
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {latest.map((article) => (
              <ArticleCard key={article.id} article={article} compact />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
