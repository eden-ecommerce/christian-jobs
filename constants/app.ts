/**
 * Per-project deploy config — `NEXT_PUBLIC_*` env (see `.env.example`).
 *
 * Never throws at module load — use `isDeployEnvConfigured()` + `IntegrationEnvError`
 * in the UI, and `assertDeployEnvForProduction()` in `next.config.ts` for builds.
 */

const isProduction = process.env.NODE_ENV === "production";

const normalizeNamespace = (value: string): string =>
  value.replace(/^\/+|\/+$/g, "");

/** Production origin (assets + API). Required for production builds. */
export const PRODUCTION_ORIGIN = process.env.NEXT_PUBLIC_PRODUCTION_ORIGIN;

/** Local / dev origin (assets + API). Optional — omit for same-origin relative URLs in dev. */
export const DEV_ORIGIN = process.env.NEXT_PUBLIC_DEV_ORIGIN;

/** URL namespace segment — no leading slash (e.g. `christian-jobs`). */
export const NAMESPACE = process.env.NEXT_PUBLIC_NAMESPACE
  ? normalizeNamespace(process.env.NEXT_PUBLIC_NAMESPACE)
  : undefined;

/** Absolute namespace path prefix (e.g. `/christian-jobs`). */
export const NAMESPACE_PATH = NAMESPACE ? `/${NAMESPACE}` : undefined;

const vercelPreviewUrl =
  process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : undefined;

/** Active origin for assets and API (preview URL on Vercel preview deploys). */
export const BASE_URL: string | undefined = isProduction
  ? (vercelPreviewUrl ?? PRODUCTION_ORIGIN)
  : DEV_ORIGIN;

export const ASSET_BASE_URL = BASE_URL;
export const API_BASE_URL = BASE_URL;

/** Fail production builds when required deploy env is missing. Called from `next.config.ts`. */
export function assertDeployEnvForProduction(): void {
  if (!isProduction) return;

  if (!NAMESPACE) {
    throw new Error(
      "Missing required environment variable: NEXT_PUBLIC_NAMESPACE. Set it in .env.local or Vercel project settings.",
    );
  }

  if (!vercelPreviewUrl && !PRODUCTION_ORIGIN) {
    throw new Error(
      "Missing required environment variable: NEXT_PUBLIC_PRODUCTION_ORIGIN. Set it in .env.local or Vercel project settings.",
    );
  }
}
