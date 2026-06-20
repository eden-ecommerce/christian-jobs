/**
 * Per-project deploy configuration.
 *
 * Public config — safe in the client bundle.
 */

/**
 * The single path prefix this app is mounted under.
 *
 * Used as the Next.js `basePath` (see `next.config.ts`) AND when building
 * same-origin client fetch URLs (see `apiUrl` / `assetUrl` in `@lib/config`).
 *
 * Because `basePath` is applied to every route, every `/_next/*` asset and
 * every `next/image` src, pages and assets all resolve RELATIVE to whatever
 * origin is currently serving them. That means the same build works in:
 *   - the v0 preview iframe,
 *   - the raw `*.vercel.app` deployment domain (…/christian-jobs), and
 *   - the eden.co.uk Cloudflare Worker proxy (www.eden.co.uk/christian-jobs),
 * with no hardcoded origins. The Worker forwards /christian-jobs/* back to
 * this deployment, and `/christian-jobs/_next/*` resolves correctly on every
 * host.
 */
export const BASE_PATH = "/christian-jobs";

/**
 * Canonical public origin INCLUDING the base path. Use this to build absolute
 * SEO URLs (canonical tags, Open Graph `url`, JSON-LD). Internal navigation
 * must NOT use this — use plain paths so Next.js `basePath` adds the prefix.
 */
export const SITE_URL = `https://www.eden.co.uk${BASE_PATH}`;
