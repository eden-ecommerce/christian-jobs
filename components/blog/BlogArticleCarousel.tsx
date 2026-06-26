import { getArticlesByTag, articleHref, type Article } from "@eden-ecommerce/blog-kit";
import { isSanityEnvConfigured } from "@lib/env-configured.server";
import { NsLink } from "@components/ns-link";
import { CHRISTIAN_JOBS_TAG } from "@lib/blog";
import { ArrowRight, BookOpen } from "lucide-react";
import Image from "next/image";

function ArticleCarouselCard({ article }: { article: Article }) {
  const href = articleHref(article);
  const tag = article.tags[0] ?? null;

  return (
    <article className="group flex w-64 shrink-0 flex-col sm:w-72">
      {article.thumbnailUrl ? (
        <NsLink href={href} tabIndex={-1} aria-hidden>
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-muted">
            <Image
              src={article.thumbnailUrl}
              alt={article.thumbnail?.alt ?? article.title}
              fill
              sizes="(max-width: 640px) 256px, 288px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </NsLink>
      ) : (
        <div className="flex aspect-[16/9] w-full items-center justify-center rounded-lg bg-accent/40">
          <BookOpen className="h-8 w-8 text-muted-foreground/40" aria-hidden />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-1.5 pt-3">
        {tag && (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
            {tag}
          </span>
        )}
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-balance text-foreground">
          <NsLink href={href} className="hover:text-primary transition-colors">
            {article.title}
          </NsLink>
        </h3>
        {article.publishedAt && (
          <time
            dateTime={article.publishedAt}
            className="mt-auto pt-2 text-[11px] text-muted-foreground"
          >
            {new Date(article.publishedAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </time>
        )}
      </div>
    </article>
  );
}

export async function BlogArticleCarousel() {
  if (!isSanityEnvConfigured()) return null;

  let articles: Article[] = [];
  try {
    const all = await getArticlesByTag(CHRISTIAN_JOBS_TAG);
    articles = all.slice(0, 5);
  } catch {
    // Silently skip the carousel if Sanity is unreachable — it's non-critical.
    return null;
  }

  if (articles.length === 0) return null;

  return (
    <section className="py-8" aria-labelledby="blog-carousel-heading">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2
            id="blog-carousel-heading"
            className="text-lg font-semibold text-foreground"
          >
            From the Jobs Blog
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Advice and inspiration for your Christian career journey
          </p>
        </div>
        <NsLink
          href="/blog"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          All articles <ArrowRight className="h-4 w-4" aria-hidden />
        </NsLink>
      </div>

      {/* Horizontally scrollable strip — snaps to card widths on touch */}
      <div
        className="mt-4 flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
        aria-label="Latest blog articles"
      >
        {articles.map((article) => (
          <div key={article.slug} role="listitem">
            <ArticleCarouselCard article={article} />
          </div>
        ))}
      </div>
    </section>
  );
}
