import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";
import { withSentryConfig } from "@sentry/nextjs";
import { ASSET_BASE_URL, assertDeployEnvForProduction, NAMESPACE_PATH } from "./constants/app";
import { NEXT_CONFIG_CORS_HEADERS } from "@eden-ecommerce/lib/cors";

assertDeployEnvForProduction();

const SANITY_CDN_PROJECT_ID =
  process.env.EDEN_SANITY_PROJECT_ID ?? "dc9143c3dc8ee44506ba";
const SANITY_CDN_DATASET = process.env.EDEN_SANITY_DATASET ?? "next-eden";

const clientDir = path.dirname(fileURLToPath(import.meta.url));

const parsedAssetBaseUrl = ASSET_BASE_URL ? new URL(ASSET_BASE_URL) : null;

const nextConfig: NextConfig = {
  env: {
    SENTRY_DATASET: process.env.SENTRY_DATASET ?? "",
    NEXT_PUBLIC_NAMESPACE: process.env.NEXT_PUBLIC_NAMESPACE ?? "",
    NEXT_PUBLIC_PRODUCTION_ORIGIN: process.env.NEXT_PUBLIC_PRODUCTION_ORIGIN ?? "",
    NEXT_PUBLIC_DEV_ORIGIN: process.env.NEXT_PUBLIC_DEV_ORIGIN ?? "",
  },
  turbopack: {
    root: clientDir,
  },
  experimental: {
    optimizePackageImports: ["@sentry/nextjs"],
  },
  transpilePackages: [
    "@algolia/client-common",
    "import-in-the-middle",
    "require-in-the-middle",
    "@eden-ecommerce/common",
    "@eden-ecommerce/lib",
  ],
  assetPrefix: process.env.NODE_ENV === "production" ? ASSET_BASE_URL : undefined,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: `/images/${SANITY_CDN_PROJECT_ID}/${SANITY_CDN_DATASET}/**`,
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "www.eden.co.uk",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "www.eden.co.uk",
        pathname: "/staticimages/**",
      },
      {
        protocol: "https",
        hostname: "www.eden.co.uk",
        pathname: "/assets/**",
      },
      ...(parsedAssetBaseUrl
        ? [
            {
              protocol: parsedAssetBaseUrl.protocol.replace(":", "") as "https" | "http",
              hostname: parsedAssetBaseUrl.hostname,
              pathname: "/**",
            },
          ]
        : []),
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [...NEXT_CONFIG_CORS_HEADERS],
      },
      ...(NAMESPACE_PATH
        ? [
            {
              source: `${NAMESPACE_PATH}/:path*`,
              headers: [...NEXT_CONFIG_CORS_HEADERS],
            },
          ]
        : []),
      {
        source: "/_next/static/:path*",
        headers: [...NEXT_CONFIG_CORS_HEADERS],
      },
    ];
  },
  async redirects() {
    return [];
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
