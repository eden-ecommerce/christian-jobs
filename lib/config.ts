/**
 * Namespace URL helpers — origins and namespace come from `constants/app.ts` (env).
 */

import {
  API_BASE_URL,
  ASSET_BASE_URL,
  NAMESPACE,
  NAMESPACE_PATH,
  PRODUCTION_ORIGIN,
} from "@/constants/app";

export { API_BASE_URL, ASSET_BASE_URL, NAMESPACE, NAMESPACE_PATH };

/** Vercel-only sandbox hub (not proxied through the Cloudflare worker). */
export const SANDBOX_PATH = "/sandbox";

/** Canonical public origin including namespace — for SEO, JSON-LD, share URLs. */
export const SITE_URL =
  PRODUCTION_ORIGIN && NAMESPACE_PATH
    ? `${PRODUCTION_ORIGIN}${NAMESPACE_PATH}`
    : undefined;

/**
 * Root-relative `/public` path. Namespace prefix applies in production only
 * (Cloudflare Worker mount). In dev, Next serves `public/` from the site root.
 */
export function publicAssetPath(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (process.env.NODE_ENV !== "production" || !NAMESPACE_PATH) {
    return normalized;
  }
  return `${NAMESPACE_PATH}${normalized}`;
}

/**
 * Build an absolute URL for a static asset in `/public` (metadata, dynamic paths).
 * For images prefer `import x from "@public/file.png"` with `next/image` and `unoptimized`.
 */
export function assetUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return ASSET_BASE_URL ? `${ASSET_BASE_URL}${normalized}` : normalized;
}

/**
 * Build a fully-qualified API URL. Use in `fetch-*.ts` when you need the URL
 * string; prefer `apiFetch(path)` which calls this internally.
 */
export function apiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${normalized}` : normalized;
}
