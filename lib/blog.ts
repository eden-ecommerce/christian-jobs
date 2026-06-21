import type { Article } from "@eden-ecommerce/blog-kit";

/**
 * This site is christian-jobs-only: every blog surface is scoped to this single
 * Sanity tag. The listing fetches by it, and the article route guards against
 * it so off-topic articles can't be reached by guessing a URL.
 */
export const CHRISTIAN_JOBS_TAG = "christian jobs";

/** Case-insensitive check that an article carries the christian-jobs tag. */
export function isChristianJobsArticle(article: Pick<Article, "tags">): boolean {
  return article.tags.some(
    (tag) => tag.trim().toLowerCase() === CHRISTIAN_JOBS_TAG,
  );
}
