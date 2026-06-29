/**
 * URL helpers for article detail pages.
 *
 * Canonical article URLs follow the pattern:
 *   /christian-jobs/blog/<first-tag-slug>/<title-slug>/<articleId>
 */

import { NAMESPACE_PATH } from "@lib/config";

/** Turn arbitrary text into a lowercase, hyphen-separated, URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

export type ArticleUrlParts = {
  slug: string;
  title: string;
  tags: string[];
};

/** Build the canonical namespace-relative article path. */
export function articleHref(article: ArticleUrlParts): string {
  const prefix = NAMESPACE_PATH ?? "";
  const tagSlug = slugify(article.tags[0] ?? "") || "article";
  const titleSlug = slugify(article.title) || "post";
  return `${prefix}/blog/${tagSlug}/${titleSlug}/${article.slug}`;
}
