import { type Article, type RelatedArticles as RelatedArticlesData } from "@lib/blog/get-articles";
import { NAMESPACE_PATH } from "@lib/config";
import { BlogPortableText } from "@components/blog/BlogPortableText";
import { RelatedArticles } from "@components/blog/RelatedArticles";
import Image from "next/image";
import Link from "next/link";

type ArticleDetailPageProps = {
  article: Article;
  relatedArticles?: RelatedArticlesData;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ArticleDetailPage({
  article,
  relatedArticles,
}: ArticleDetailPageProps) {
  const heroUrl = article.thumbnailUrlHero;
  const blogPath = `${NAMESPACE_PATH ?? "/christian-jobs"}/blog`;

  return (
    <>
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Back link */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <Link
          href={blogPath}
          className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
        >
          <span aria-hidden>&#8592;</span>
          <span>All articles</span>
        </Link>
      </nav>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight text-balance mb-4">
        {article.title}
      </h1>

      {/* Excerpt lead / summary */}
      {article.excerpt && (
        <p className="text-xl text-muted-foreground leading-relaxed mb-8 font-light">
          {article.excerpt}
        </p>
      )}

      {/* Author byline */}
      {article.authors.length > 0 && (
        <div className="flex items-center gap-3 mb-4">
          <div className="flex -space-x-2">
            {article.authors
              .filter((a) => a.photoUrl)
              .map((author) => (
                <Image
                  key={author.id}
                  src={author.photoUrl as string}
                  alt={author.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover border-2 border-background bg-muted"
                />
              ))}
          </div>
          <div className="text-sm leading-snug">
            <span className="text-muted-foreground">By </span>
            {article.authors.map((author, i) => (
              <span key={author.id}>
                <span className="font-medium text-foreground">{author.name}</span>
                {author.role && (
                  <span className="text-muted-foreground">{` \u2013 ${author.role}`}</span>
                )}
                {i < article.authors.length - 1 && (
                  <span className="text-muted-foreground">, </span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Metadata row + tag pills */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
        {article.publishedAt && (
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
        )}
        {article.tags.length > 0 && (
          <>
            <span aria-hidden className="text-border">|</span>
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`${blogPath}?tag=${encodeURIComponent(tag)}`}
                className="px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {tag}
              </Link>
            ))}
          </>
        )}
      </div>

      {/* Hero image */}
      {heroUrl && (
        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-8 bg-muted">
          <Image
            src={heroUrl}
            alt={article.thumbnail?.alt ?? article.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      )}

      {/* Body */}
      {article.richText && article.richText.length > 0 ? (
        <div className="prose prose-lg prose-headings:font-semibold prose-headings:text-foreground prose-p:text-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground max-w-none">
          <BlogPortableText value={article.richText} />
        </div>
      ) : (
        <p className="text-muted-foreground">No content available for this article.</p>
      )}
    </main>

    {relatedArticles && (
      <RelatedArticles
        latest={relatedArticles.latest}
        related={relatedArticles.related}
        tags={article.tags}
      />
    )}
    </>
  );
}
