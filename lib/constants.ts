/**
 * REPLACE: Per-project deploy origins.
 *
 * Public config — safe in the client bundle. Hardcode production URLs before deploy.
 * API and asset origins may differ. Dev always uses localhost:3000.
 *
 * Private secrets (API keys, tokens, etc.) belong in `.env` — see `@lib/env-server`.
 *
 * ASSET_BASE_URL drives `assetPrefix` in `next.config.ts` so `/_next/static/*`
 * and imported `@public/*` assets resolve correctly behind the Eden Cloudflare Worker.
 */

/**
 * Canonical proxy origin. The app is served behind the Eden Cloudflare Worker
 * at https://www.eden.co.uk/christian-jobs, so `/_next/static/*` must resolve as
 *   https://www.eden.co.uk/christian-jobs/_next/static/…
 * The Worker forwards /christian-jobs/* back to this deployment.
 */
export const ASSET_PRODUCTION_ORIGIN = "https://www.eden.co.uk/christian-jobs";
export const ASSET_DEV_ORIGIN = "http://localhost:3000";

/** API origin (may differ from assets) */
export const API_PRODUCTION_ORIGIN = "https://www.eden.co.uk/christian-jobs";
export const API_DEV_ORIGIN = "http://localhost:3000";

// Origin resolution:
//
// Production (VERCEL_ENV === "production"): use the canonical proxy origin so
// assets load through the Cloudflare Worker on eden.co.uk. Using VERCEL_URL
// here would point the browser straight at the Vercel deployment, bypass the
// proxy, and break CSS/JS on eden.co.uk (unstyled HTML).
//
// Preview (VERCEL_ENV === "preview"): there is no proxy, so use the
// deployment's own VERCEL_URL. This keeps the v0 preview iframe working and
// avoids the "content blocked" error from a mismatched origin.
//
// Development: same-origin localhost.
const vercelPreviewUrl =
  process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : undefined;

export const ASSET_BASE_URL =
  process.env.NODE_ENV === "production"
    ? (vercelPreviewUrl ?? ASSET_PRODUCTION_ORIGIN)
    : ASSET_DEV_ORIGIN;

export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? (vercelPreviewUrl ?? API_PRODUCTION_ORIGIN)
    : API_DEV_ORIGIN;
