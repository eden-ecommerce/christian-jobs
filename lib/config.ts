/**
 * ──────────────────────────────────────────────────────────────────────────
 * Per-project configuration
 * ──────────────────────────────────────────────────────────────────────────
 *
 * This app is mounted under a single path namespace via the Next.js
 * `basePath` (see `BASE_PATH` in `@lib/constants` and `next.config.ts`). In
 * production it is served behind the Eden Cloudflare Worker at
 * https://www.eden.co.uk/christian-jobs.
 *
 * Because `basePath` automatically prefixes every `next/link` href,
 * `redirect()` and `next/image` src, internal navigation paths are written
 * WITHOUT the namespace prefix. For absolute SEO URLs, use `SITE_URL`.
 */

import { BASE_PATH, SITE_URL } from "@lib/constants";

export { BASE_PATH, SITE_URL };

/** Human-readable namespace this app is mounted under. */
export const NAMESPACE = "christian-jobs";

/**
 * Internal-link path prefix.
 *
 * Empty on purpose: Next.js `basePath` (BASE_PATH) prepends the namespace to
 * every `next/link` href, `redirect()` and `next/image` src automatically.
 * Build internal hrefs WITHOUT the prefix, e.g. `${NAMESPACE_PATH}/search`
 * resolves to "/search", which Next.js serves at "/christian-jobs/search".
 *
 * For a bare home link, use "/" (not NAMESPACE_PATH). For absolute SEO URLs,
 * use `SITE_URL`.
 */
export const NAMESPACE_PATH = "";

/**
 * Build a same-origin URL for a static asset in `/public`.
 *
 * Returns a `basePath`-prefixed root-relative path (e.g.
 * "/christian-jobs/logo.png"). Use for raw `<img>`/`fetch` references. Prefer
 * `import x from "@public/file.png"` with `next/image`, which adds `basePath`
 * itself — do NOT pass an `assetUrl()` result to `next/image` or the prefix
 * will be doubled.
 *
 * @example assetUrl("/logo.png") -> "/christian-jobs/logo.png"
 */
export function assetUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}

/**
 * Build a same-origin URL for this app's own API routes.
 *
 * Returns a `basePath`-prefixed root-relative path so client-side `fetch`
 * hits the correct route on whatever host is serving the page (preview,
 * *.vercel.app, or the eden.co.uk proxy). Raw `fetch()` does NOT apply
 * `basePath`, so it must be added here.
 *
 * @example apiUrl("/api/health") -> "/christian-jobs/api/health"
 */
export function apiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}
