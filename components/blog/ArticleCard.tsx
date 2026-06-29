import { type Article } from "@lib/blog/get-articles";
import { articleHref } from "@lib/blog/article-url";
import { NsLink } from "@components/ns-link";
import Image from "next/image";

type ArticleCardProps = {
  article: Article;
  /** Smaller layout for cross-promotion grids (related/latest sections). */
  compact?: boolean;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ArticleCard({ article, compact = false }: ArticleCardProps) {
  const href = articleHref(article);
  const primaryTag = article.tags[0] ?? null;
  const thumbnailUrl = article.thumbnailUrl;

  return (
    <article className="group flex flex-col bg-card border border-border rounded-lg overflow-hidden transition-shadow hover:shadow-md">
      {/* Thumbnail */}
      {thumbnailUrl && (
        <NsLink href={href} tabIndex={-1} aria-hidden>
          <div className="relative w-full aspect-[3/2] overflow-hidden bg-muted">
            <Image
              src={thumbnailUrl}
              alt={article.thumbnail?.alt ?? article.title}
              fill
              sizes={
                compact
                  ? "(max-width: 640px) 50vw, 20vw"
                  : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              }
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </NsLink>
      )}

      {/* Content */}
      <div className={`flex flex-col flex-1 gap-2 ${compact ? "p-3" : "p-5 gap-3"}`}>
        {/* Tag badge */}
        {primaryTag && (
          <span className={`font-medium uppercase tracking-wider text-primary ${compact ? "text-[10px]" : "text-xs"}`}>
            {primaryTag}
          </span>
        )}

        {/* Title */}
        <h2
          className={`font-semibold leading-snug text-foreground text-balance ${
            compact ? "text-sm line-clamp-2" : "text-base"
          }`}
        >
          <NsLink href={href} className="hover:text-primary transition-colors">
            {article.title}
          </NsLink>
        </h2>

        {/* Excerpt — hidden in compact layout to keep cards small */}
        {!compact && article.excerpt && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
            {article.excerpt}
          </p>
        )}

        {/* Footer: date */}
        {article.publishedAt && (
          <time
            dateTime={article.publishedAt}
            className={`text-muted-foreground mt-auto block ${
              compact ? "text-[11px] pt-2" : "text-xs pt-3 border-t border-border"
            }`}
          >
            {formatDate(article.publishedAt)}
          </time>
        )}
      </div>
    </article>
  );
}
