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

/** REPLACE: asset + `_next/static` origin */
export const ASSET_PRODUCTION_ORIGIN =
  "https://events-snowy-phi.vercel.app/events";
export const ASSET_DEV_ORIGIN = "http://localhost:3000";

/** REPLACE: API origin (may differ from assets) */
export const API_PRODUCTION_ORIGIN =
  "https://events-snowy-phi.vercel.app/events";
export const API_DEV_ORIGIN = "http://localhost:3000";

export const ASSET_BASE_URL =
  process.env.NODE_ENV === "production"
    ? ASSET_PRODUCTION_ORIGIN
    : ASSET_DEV_ORIGIN;

export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? API_PRODUCTION_ORIGIN
    : API_DEV_ORIGIN;
