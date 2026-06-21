import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import { BASE_PATH } from "@lib/constants";
import { ALLOWED_ORIGIN, CORS_HEADERS } from "@lib/cors";

const nextConfig: NextConfig = {
  // Mount the whole app under /christian-jobs. Next serves every route and
  // every `/_next/*` asset under this prefix, RELATIVE to the current origin.
  // This is what makes the build work identically on the v0 preview, the raw
  // *.vercel.app domain, and the eden.co.uk Cloudflare Worker proxy — no
  // hardcoded asset origin required.
  basePath: BASE_PATH,
  // Expose SENTRY_DATASET to client bundles at build time (not a secret).
  env: {
    SENTRY_DATASET: process.env.SENTRY_DATASET ?? "",
  },
  experimental: {
    optimizePackageImports: ["@sentry/nextjs"],
  },
  transpilePackages: [
    "@algolia/client-common",
    // Ships raw TS/TSX source, so Next must transpile it as part of this build.
    "@eden-ecommerce/blog-kit",
    // TEMPORARILY DISABLED: private @christian-360/* packages (unreachable
    // registry). Re-enable when the packages are wired back in.
    // "@christian-360/next-design",
    // "@christian-360/sanity",
  ],
  // No `assetPrefix`: `basePath` already serves `/_next/*` under
  // /christian-jobs on the same origin as the page, which resolves correctly
  // on every host (preview, *.vercel.app, and the eden.co.uk proxy).
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
