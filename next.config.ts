import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import { ASSET_BASE_URL } from "@lib/constants";
import { ALLOWED_ORIGIN, CORS_HEADERS } from "@lib/cors";

const nextConfig: NextConfig = {
  // Expose SENTRY_DATASET to client bundles at build time (not a secret).
  env: {
    SENTRY_DATASET: process.env.SENTRY_DATASET ?? "",
  },
  experimental: {
    optimizePackageImports: ["@sentry/nextjs"],
  },
  transpilePackages: [
    "@algolia/client-common",
    // TEMPORARILY DISABLED: private @christian-360/* packages (unreachable
    // registry). Re-enable when the packages are wired back in.
    // "@christian-360/next-design",
    // "@christian-360/sanity",
  ],
  // Only prefix assets in production (behind the Cloudflare Worker). In
  // development assets MUST be served from the same origin the page is served
  // from — hardcoding `http://localhost:3000` here breaks the v0 preview and
  // any proxied/sandbox host because the browser can't reach localhost.
  assetPrefix: process.env.NODE_ENV === "production" ? ASSET_BASE_URL : undefined,
  // v0 iterates quickly — builds tolerate TS errors during dev.
  // Before deploy: run `pnpm predeploy` (ts-check + lint + build) and fix all errors.
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "*.amazonaws.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: ALLOWED_ORIGIN },
          {
            key: "Access-Control-Allow-Methods",
            value: CORS_HEADERS["Access-Control-Allow-Methods"],
          },
          {
            key: "Access-Control-Allow-Headers",
            value: CORS_HEADERS["Access-Control-Allow-Headers"],
          },
        ],
      },
      // Security headers (CSP, HSTS, frame-ancestors) may be owned by the
      // Cloudflare Worker or Vercel edge — confirm with infra before enabling:
      // {
      //   source: "/:path*",
      //   headers: [
      //     { key: "X-Content-Type-Options", value: "nosniff" },
      //     { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      //   ],
      // },
    ];
  },
};

const hasSentryBuildCredentials =
  process.env.SENTRY_ORG &&
  process.env.SENTRY_PROJECT &&
  process.env.SENTRY_AUTH_TOKEN;

export default hasSentryBuildCredentials
  ? withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      widenClientFileUpload: true,
      disableLogger: true,
      reactComponentAnnotation: {
        enabled: false,
      },
      bundleSizeOptimizations: {
        excludeDebugStatements: true,
        excludeTracing: true,
        excludeReplayIframe: true,
        excludeReplayShadowDom: true,
        excludeReplayWorker: true,
      },
    })
  : nextConfig;
