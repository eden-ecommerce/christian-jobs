"use client";

import { type Article } from "@lib/blog/get-articles";
import { ArticleGrid } from "@components/blog/ArticleGrid";

type BlogListingPageProps = {
  articles: Article[];
  tags: string[];
  activeTag: string | null;
  heading?: string;
  description?: string;
};

export function BlogListingPage({
  articles,
  tags,
  activeTag,
  heading,
  description,
}: BlogListingPageProps) {
  // Articles are already filtered server-side; no client re-filter needed.
  const filtered = articles;

  const title = heading ?? (activeTag ? `${activeTag} Articles` : "Articles");
  const subtitle =
    description ??
    (activeTag
      ? `Browse all Eden articles tagged "${activeTag}".`
      : "Encouraging and equipping Christians across the UK.");

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page header */}
      <header className="mb-10 border-b border-border pb-8">
        <h1 className="text-4xl font-bold text-foreground tracking-tight text-balance">
          {title}
        </h1>
        <p className="mt-3 text-muted-foreground text-base leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      </header>

      {/* Tag filter omitted — christian-jobs passes tags={[]} */}

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-6">
        {filtered.length === 1 ? "1 article" : `${filtered.length} articles`}
        {activeTag && (
          <>
            {" "}tagged{" "}
            <span className="font-medium text-foreground">{activeTag}</span>
          </>
        )}
      </p>

      {/* Grid */}
      <ArticleGrid articles={filtered} />
    </main>
  );
}
